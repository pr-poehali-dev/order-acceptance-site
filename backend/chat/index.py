import json
import os
import uuid
import urllib.parse
import pg8000.native


def get_conn():
    url = urllib.parse.urlparse(os.environ['DATABASE_URL'])
    return pg8000.native.Connection(
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port or 5432,
        database=url.path.lstrip('/')
    )


def handler(event: dict, context) -> dict:
    """Чат: отправка и получение сообщений между клиентом и мастером"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    method = event.get('httpMethod')
    path = event.get('path', '/')
    headers = event.get('headers', {})
    session_id = headers.get('X-Session-Id', '')

    cors = {'Access-Control-Allow-Origin': '*'}

    # GET /messages - получить сообщения сессии (клиент)
    if method == 'GET' and '/messages' in path:
        if not session_id:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'No session'})}
        conn = get_conn()
        rows = conn.run(
            "SELECT id, sender, message, created_at, is_read FROM chat_messages WHERE session_id = :sid ORDER BY created_at ASC",
            sid=session_id
        )
        conn.run(
            "UPDATE chat_messages SET is_read = TRUE WHERE session_id = :sid AND sender = 'admin'",
            sid=session_id
        )
        messages = [
            {'id': r[0], 'sender': r[1], 'message': r[2], 'created_at': r[3].isoformat(), 'is_read': r[4]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'messages': messages})}

    # POST /send - клиент отправляет сообщение
    if method == 'POST' and '/send' in path:
        body = json.loads(event.get('body') or '{}')
        message = body.get('message', '').strip()
        name = body.get('name', '').strip()
        if not message:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Empty message'})}

        conn = get_conn()

        if not session_id:
            session_id = str(uuid.uuid4())

        existing = conn.run("SELECT session_id FROM chat_sessions WHERE session_id = :sid", sid=session_id)
        if not existing:
            conn.run(
                "INSERT INTO chat_sessions (session_id, client_name) VALUES (:sid, :name)",
                sid=session_id, name=name or 'Клиент'
            )

        conn.run(
            "INSERT INTO chat_messages (session_id, sender, message) VALUES (:sid, 'client', :msg)",
            sid=session_id, msg=message
        )

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'ok': True, 'session_id': session_id})
        }

    # GET /sessions - список всех сессий (для админа)
    if method == 'GET' and '/sessions' in path:
        conn = get_conn()
        rows = conn.run("""
            SELECT s.session_id, s.client_name, s.created_at,
                   COUNT(m.id) FILTER (WHERE m.sender = 'client' AND m.is_read = FALSE) AS unread,
                   MAX(m.created_at) AS last_message
            FROM chat_sessions s
            LEFT JOIN chat_messages m ON s.session_id = m.session_id
            GROUP BY s.session_id, s.client_name, s.created_at
            ORDER BY last_message DESC NULLS LAST
        """)
        sessions = [
            {
                'session_id': r[0],
                'client_name': r[1],
                'created_at': r[2].isoformat(),
                'unread': r[3] or 0,
                'last_message': r[4].isoformat() if r[4] else None
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'sessions': sessions})}

    # POST /reply - админ отвечает клиенту
    if method == 'POST' and '/reply' in path:
        body = json.loads(event.get('body') or '{}')
        target_session = body.get('session_id', '').strip()
        message = body.get('message', '').strip()
        if not target_session or not message:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Missing fields'})}

        conn = get_conn()
        conn.run(
            "INSERT INTO chat_messages (session_id, sender, message) VALUES (:sid, 'admin', :msg)",
            sid=target_session, msg=message
        )
        conn.run(
            "UPDATE chat_messages SET is_read = TRUE WHERE session_id = :sid AND sender = 'client'",
            sid=target_session
        )
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    # GET /admin/messages - все сообщения сессии для админа
    if method == 'GET' and '/admin/messages' in path:
        params = event.get('queryStringParameters') or {}
        target_session = params.get('session_id', '')
        if not target_session:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'No session_id'})}
        conn = get_conn()
        rows = conn.run(
            "SELECT id, sender, message, created_at, is_read FROM chat_messages WHERE session_id = :sid ORDER BY created_at ASC",
            sid=target_session
        )
        conn.run(
            "UPDATE chat_messages SET is_read = TRUE WHERE session_id = :sid AND sender = 'client'",
            sid=target_session
        )
        messages = [
            {'id': r[0], 'sender': r[1], 'message': r[2], 'created_at': r[3].isoformat(), 'is_read': r[4]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'messages': messages})}

    return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Not found'})}

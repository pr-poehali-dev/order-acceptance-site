import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/f5ed931d-81ae-4df1-9091-b3bcb4bce520";

interface Session {
  session_id: string;
  client_name: string;
  created_at: string;
  unread: number;
  last_message: string | null;
}

interface Message {
  id: number;
  sender: "client" | "admin";
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function Admin() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSessions = async () => {
    const res = await fetch(`${CHAT_URL}/sessions`);
    if (!res.ok) return;
    const data = await res.json();
    setSessions(data.sessions || []);
  };

  const fetchMessages = async (sid: string) => {
    const res = await fetch(`${CHAT_URL}/admin/messages?session_id=${sid}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages || []);
  };

  useEffect(() => {
    fetchSessions();
    pollRef.current = setInterval(() => {
      fetchSessions();
      if (selected) fetchMessages(selected);
    }, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openSession = (sid: string) => {
    setSelected(sid);
    setMessages([]);
    fetchMessages(sid);
    setSessions(prev => prev.map(s => s.session_id === sid ? { ...s, unread: 0 } : s));
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");
    await fetch(`${CHAT_URL}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: selected, message: text }),
    });
    await fetchMessages(selected);
    setSending(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const totalUnread = sessions.reduce((sum, s) => sum + s.unread, 0);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white flex flex-col" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-4 bg-[#0a1520] border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center">
            <Icon name="Wrench" size={16} className="text-[#0d1b2a]" />
          </div>
          <div>
            <span className="font-bold text-white">Панель мастера</span>
            {totalUnread > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>
            )}
          </div>
        </div>
        <a href="/" className="text-slate-400 hover:text-[#c9a84c] text-sm flex items-center gap-1 transition-colors">
          <Icon name="ExternalLink" size={14} />
          На сайт
        </a>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sessions list */}
        <div className="w-72 flex-shrink-0 border-r border-slate-700 bg-[#0a1520] overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-700/50">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Диалоги</span>
          </div>
          {sessions.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              Сообщений пока нет
            </div>
          )}
          {sessions.map(s => (
            <button
              key={s.session_id}
              onClick={() => openSession(s.session_id)}
              className={`w-full text-left px-4 py-3.5 border-b border-slate-800 transition-colors flex items-start gap-3 ${
                selected === s.session_id ? "bg-[#0f2030] border-l-2 border-l-[#c9a84c]" : "hover:bg-[#0f1e2d]"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="User" size={16} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-white truncate">{s.client_name}</span>
                  {s.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {s.unread}
                    </span>
                  )}
                </div>
                {s.last_message && (
                  <div className="text-xs text-slate-500 mt-0.5">{formatTime(s.last_message)}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Icon name="MessageCircle" size={40} className="text-slate-700" />
              <span className="text-sm">Выберите диалог слева</span>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[65%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                        m.sender === "admin"
                          ? "bg-[#c9a84c] text-[#0d1b2a] font-medium rounded-br-none"
                          : "bg-[#1a2f45] text-white rounded-bl-none"
                      }`}
                    >
                      <div>{m.message}</div>
                      <div className={`text-xs mt-1 ${m.sender === "admin" ? "text-[#0d1b2a]/60" : "text-slate-500"}`}>
                        {formatTime(m.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Reply input */}
              <div className="px-4 py-3 border-t border-slate-700 flex items-center gap-2 bg-[#0a1520]">
                <input
                  className="flex-1 bg-[#0f2030] border border-slate-600 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#c9a84c] placeholder-slate-500"
                  placeholder="Ваш ответ..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendReply()}
                  disabled={sending}
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="px-4 py-2.5 rounded-lg bg-[#c9a84c] hover:bg-[#b8943d] disabled:opacity-40 text-[#0d1b2a] font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Icon name="Send" size={16} />
                  Отправить
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

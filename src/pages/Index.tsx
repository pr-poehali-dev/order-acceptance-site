import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/f5ed931d-81ae-4df1-9091-b3bcb4bce520";

const prices = [
  { service: "Замена экрана", price: "500 ₽" },
  { service: "Защитное стекло", price: "300 ₽" },
  { service: "Замена аккумулятора", price: "600 ₽" },
  { service: "Замена всего", price: "1 000 ₽" },
];

function getSessionId(): string {
  let sid = localStorage.getItem("chat_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

interface Message {
  id: number;
  sender: "client" | "admin";
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function Index() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState(() => localStorage.getItem("chat_name") || "");
  const [nameSet, setNameSet] = useState(() => !!localStorage.getItem("chat_name"));
  const [sending, setSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    const sid = getSessionId();
    const res = await fetch(`${CHAT_URL}/messages`, {
      headers: { "X-Session-Id": sid },
    });
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages || []);
    const unread = (data.messages || []).some(
      (m: Message) => m.sender === "admin" && !m.is_read
    );
    if (!chatOpen && unread) setHasUnread(true);
    if (chatOpen) setHasUnread(false);
  };

  useEffect(() => {
    if (!nameSet) return;
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [nameSet, chatOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  useEffect(() => {
    if (chatOpen) setHasUnread(false);
  }, [chatOpen]);

  const saveName = () => {
    if (!name.trim()) return;
    localStorage.setItem("chat_name", name.trim());
    setNameSet(true);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    const sid = getSessionId();
    await fetch(`${CHAT_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid },
      body: JSON.stringify({ name, message: text }),
    });
    await fetchMessages();
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0d1b2a] via-[#122235] to-[#0a1520]" />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#c9a84c] opacity-5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#c9a84c] opacity-5 blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-sm font-medium tracking-[0.3em] uppercase">Ремонт телефонов</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
            БЫСТРЫЙ<br />
            <span className="text-[#c9a84c]">РЕМОНТ</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-xl mb-12 leading-relaxed">
            Замена экранов, аккумуляторов, стёкол. Пишите прямо здесь — отвечу быстро.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center justify-center gap-3 bg-[#c9a84c] hover:bg-[#b8943d] text-[#0d1b2a] font-bold px-8 py-4 text-lg transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              <Icon name="MessageCircle" size={20} />
              Написать мастеру
            </button>
            <a
              href="#prices"
              className="inline-flex items-center justify-center gap-3 border border-slate-600 hover:border-[#c9a84c] text-slate-300 hover:text-[#c9a84c] font-medium px-8 py-4 text-lg transition-all duration-200"
            >
              <Icon name="Tag" size={20} />
              Посмотреть цены
            </a>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-5xl pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-700/30 border border-slate-700/50">
            {[
              { icon: "ShieldCheck", label: "Гарантия качества", value: "100%" },
              { icon: "Clock3", label: "Быстрый ремонт", value: "1–2 ч" },
              { icon: "Headphones", label: "Ответ в чате", value: "Скоро" },
            ].map((item) => (
              <div key={item.label} className="bg-[#0f2030] px-8 py-6 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-[#c9a84c]">
                  <Icon name={item.icon} size={22} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.value}</div>
                  <div className="text-sm text-slate-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="py-24 bg-[#0a1520]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-medium tracking-[0.3em] uppercase">Прайс-лист</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Oswald', sans-serif" }}>Цены на ремонт</h2>

          <div className="flex flex-col gap-3">
            {prices.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-5 border border-slate-700/60 bg-[#0f2030] hover:border-[#c9a84c]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Icon name="Wrench" size={18} className="text-[#c9a84c]" />
                  <span className="font-medium text-base text-white">{item.service}</span>
                </div>
                <span className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 bg-[#c9a84c]/5 border border-[#c9a84c]/20 px-6 py-4">
            <Icon name="Info" size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
            <p className="text-slate-400 text-sm leading-relaxed">
              Цены указаны за стандартные работы. Точную стоимость для вашей модели уточните в чате.
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-3 bg-[#c9a84c] hover:bg-[#b8943d] text-[#0d1b2a] font-bold px-8 py-4 text-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <Icon name="MessageCircle" size={20} />
              Уточнить цену в чате
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-800 bg-[#0a1520]">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 — Ремонт телефонов. Все права защищены.</p>
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 text-[#c9a84c] hover:text-[#d4b05a] text-sm font-medium transition-colors"
          >
            <Icon name="MessageCircle" size={14} />
            Написать мастеру
          </button>
        </div>
      </footer>

      {/* CHAT BUBBLE */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#c9a84c] hover:bg-[#b8943d] text-[#0d1b2a] flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110"
      >
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0d1b2a]" />
        )}
        <Icon name="MessageCircle" size={24} />
      </button>

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] flex flex-col bg-[#0f2030] border border-slate-700 rounded-xl shadow-2xl overflow-hidden" style={{ height: "480px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a1520] border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center">
                <Icon name="Wrench" size={16} className="text-[#0d1b2a]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Мастер</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">Онлайн</span>
                </div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Name input */}
          {!nameSet ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
              <Icon name="User" size={32} className="text-[#c9a84c]" />
              <p className="text-slate-300 text-sm text-center">Как вас зовут? Это поможет мастеру обратиться к вам.</p>
              <input
                className="w-full bg-[#0a1520] border border-slate-600 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#c9a84c] placeholder-slate-500"
                placeholder="Ваше имя"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveName()}
                autoFocus
              />
              <button
                onClick={saveName}
                disabled={!name.trim()}
                className="w-full bg-[#c9a84c] hover:bg-[#b8943d] disabled:opacity-40 text-[#0d1b2a] font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Начать чат
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
                {messages.length === 0 && (
                  <div className="text-center text-slate-500 text-sm mt-8">
                    Напишите ваш вопрос — мастер ответит в ближайшее время
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "client" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        m.sender === "client"
                          ? "bg-[#c9a84c] text-[#0d1b2a] font-medium rounded-br-none"
                          : "bg-[#1a2f45] text-white rounded-bl-none"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-slate-700 flex items-center gap-2">
                <input
                  className="flex-1 bg-[#0a1520] border border-slate-600 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-[#c9a84c] placeholder-slate-500"
                  placeholder="Ваш вопрос..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-9 h-9 rounded-lg bg-[#c9a84c] hover:bg-[#b8943d] disabled:opacity-40 text-[#0d1b2a] flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

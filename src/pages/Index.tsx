import { useState } from "react";
import Icon from "@/components/ui/icon";

const schedule = [
  { day: "Понедельник", slots: ["09:00", "11:00", "14:00", "16:00"], active: true },
  { day: "Вторник", slots: ["10:00", "13:00", "15:00"], active: true },
  { day: "Среда", slots: ["09:00", "12:00", "17:00"], active: true },
  { day: "Четверг", slots: ["10:00", "14:00", "16:00"], active: true },
  { day: "Пятница", slots: ["09:00", "11:00", "13:00"], active: true },
  { day: "Суббота", slots: ["10:00", "12:00"], active: true },
  { day: "Воскресенье", slots: [], active: false },
];

const faqs = [
  {
    question: "Как оформить заказ?",
    answer: "Вступите в нашу группу по ссылке ниже, ознакомьтесь с условиями и напишите нам в выбранное время из расписания.",
  },
  {
    question: "Какие сроки выполнения?",
    answer: "Сроки зависят от сложности заказа. Стандартное время — от 1 до 5 рабочих дней. Точные сроки обсуждаются индивидуально.",
  },
  {
    question: "Какие способы оплаты принимаете?",
    answer: "Мы принимаем оплату на карту, через СБП, а также по безналичному расчёту для юридических лиц.",
  },
  {
    question: "Можно ли отменить заказ?",
    answer: "Отмена возможна до начала выполнения работ. После старта — по договорённости с учётом уже выполненных этапов.",
  },
  {
    question: "Где узнать актуальные цены?",
    answer: "Все актуальные цены и прайс-листы доступны в нашей группе. Вступайте и получайте полную информацию.",
  },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0d1b2a] via-[#122235] to-[#0a1520]" />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#c9a84c] opacity-5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#c9a84c] opacity-5 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(201,168,76,0.3) 60px, rgba(201,168,76,0.3) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(201,168,76,0.3) 60px, rgba(201,168,76,0.3) 61px)",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-sm font-medium tracking-[0.3em] uppercase">Профессиональный сервис</span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight animate-fade-in"
            style={{ fontFamily: "'Oswald', sans-serif", animationDelay: "0.1s" }}
          >
            ДОБРО<br />
            <span className="text-[#c9a84c]">ПОЖАЛОВАТЬ</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-xl mb-4 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Вы находитесь на странице приёма заказов. Мы работаем профессионально и в срок.
          </p>

          <div className="flex items-center gap-2 mb-12 animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Приём заказов открыт</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <a
              href="https://max.ru/join/5SVVCCJMIh2HVLw9caKvS56FiQ9AWW6oJqNAHPnqDaE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#c9a84c] hover:bg-[#b8943d] text-[#0d1b2a] font-bold px-8 py-4 text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <Icon name="Users" size={20} />
              Вступить в группу
            </a>
            <a
              href="#schedule"
              className="inline-flex items-center justify-center gap-3 border border-slate-600 hover:border-[#c9a84c] text-slate-300 hover:text-[#c9a84c] font-medium px-8 py-4 text-lg transition-all duration-200"
            >
              <Icon name="Clock" size={20} />
              Расписание приёма
            </a>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-5xl pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-700/30 border border-slate-700/50">
            {[
              { icon: "ShieldCheck", label: "Гарантия качества", value: "100%" },
              { icon: "Clock3", label: "Соблюдение сроков", value: "Всегда" },
              { icon: "Headphones", label: "Поддержка клиентов", value: "24/7" },
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

      {/* SCHEDULE */}
      <section id="schedule" className="py-24 bg-[#0a1520]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-medium tracking-[0.3em] uppercase">Режим работы</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>Расписание приёма</h2>
          <p className="text-slate-400 mb-12">Выберите удобное время и напишите нам в группе</p>

          <div className="grid gap-3">
            {schedule.map((item) => (
              <div
                key={item.day}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 border transition-all duration-200 ${
                  item.active
                    ? "border-slate-700/60 bg-[#0f2030] hover:border-[#c9a84c]/30"
                    : "border-slate-800/40 bg-[#0d1b25] opacity-50"
                }`}
              >
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active && item.slots.length > 0 ? "bg-emerald-400" : "bg-slate-600"}`} />
                  <span className="font-semibold text-base">{item.day}</span>
                </div>

                {item.active && item.slots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.slots.map((slot) => (
                      <span
                        key={slot}
                        className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-mono px-3 py-1"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-sm italic">Выходной</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 bg-[#c9a84c]/5 border border-[#c9a84c]/20 px-6 py-4">
            <Icon name="Info" size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
            <p className="text-slate-400 text-sm leading-relaxed">
              Для оформления заказа вступите в группу и напишите нам в одно из указанных временных слотов. Заявки принимаются строго по расписанию.
            </p>
          </div>
        </div>
      </section>

      {/* JOIN BANNER */}
      <section className="py-20 bg-gradient-to-r from-[#c9a84c] via-[#d4b05a] to-[#c9a84c]">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#0d1b2a] mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Готовы сделать заказ?
            </h3>
            <p className="text-[#0d1b2a]/70 text-lg">Вступите в группу и оставьте заявку прямо сейчас</p>
          </div>
          <a
            href="https://max.ru/join/5SVVCCJMIh2HVLw9caKvS56FiQ9AWW6oJqNAHPnqDaE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#0d1b2a] hover:bg-[#122235] text-white font-bold px-8 py-4 text-lg whitespace-nowrap transition-all duration-200 hover:scale-[1.02] shadow-xl"
          >
            <Icon name="ArrowRight" size={20} />
            Вступить в группу
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0d1b2a]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-medium tracking-[0.3em] uppercase">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Вопросы и ответы
          </h2>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border transition-all duration-300 ${
                  openFaq === i ? "border-[#c9a84c]/40 bg-[#0f2030]" : "border-slate-700/50 bg-[#0f1e2d] hover:border-slate-600"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-base text-white">{faq.question}</span>
                  <div
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#c9a84c] transition-transform duration-300 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    <Icon name="Plus" size={18} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <div className="h-px bg-slate-700/50 mb-4" />
                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-800 bg-[#0a1520]">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 — Приём заказов. Все права защищены.</p>
          <a
            href="https://max.ru/join/5SVVCCJMIh2HVLw9caKvS56FiQ9AWW6oJqNAHPnqDaE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#c9a84c] hover:text-[#d4b05a] text-sm font-medium transition-colors"
          >
            <Icon name="ExternalLink" size={14} />
            Наша группа
          </a>
        </div>
      </footer>
    </div>
  );
}
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";

type Form = {
  name: string;
  email: string;
  topic: string;
  message: string;
  consent: boolean;
  website?: string;
};

const TOPICS = [
  { value: "pytanie", label: "Pytanie dotyczące funkcji" },
  { value: "wspolpraca", label: "Współpraca / partnerstwo" },
  { value: "bug", label: "Zgłoszenie błędu" },
  { value: "inne", label: "Inne" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    topic: "pytanie",
    message: "",
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "fail">(null);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Podaj imię i nazwisko.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email)) e.email = "Podaj poprawny adres e-mail.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Napisz kilka zdań (min. 10 znaków).";
    if (!form.consent) e.consent = "Wymagana zgoda na przetwarzanie danych.";
    if (form.website && form.website.trim() !== "") e.website = "Wykryto pole anty-spam.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const key = "wp_contact_inbox";
      const raw = localStorage.getItem(key);
      type InboxItem = Form & { id: string; date: string; status: string };
      const prev: InboxItem[] = raw ? (JSON.parse(raw) as InboxItem[]) : [];
      prev.unshift({
        ...form,
        id: crypto.randomUUID?.() || String(Date.now()),
        date: new Date().toISOString(),
        status: "new",
      });
      localStorage.setItem(key, JSON.stringify(prev));
      setSent("ok");
      setForm({ name: "", email: "", topic: "pytanie", message: "", consent: false, website: "" });
    } catch {
      setSent("fail");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSent(null), 3000);
    }
  }

  const baseInput = "w-full rounded-xl border border-stone-300 px-3 py-2 bg-white";
  const labelCls = "block text-xs text-stone-500 mb-1";

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Kontakt</h1>
          <p className="text-stone-600">Masz pytanie, pomysł lub chcesz zgłosić błąd? Napisz do nas.</p>
        </div>
        <NavLink to="/faq" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200">
          <MessageSquare size={16} /> Sprawdź FAQ
        </NavLink>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <InfoCard
          icon={<Mail size={18} />}
          title="E-mail"
          lines={["kontakt@weddingplanner.app"]}
        />
        <InfoCard
          icon={<Phone size={18} />}
          title="Telefon"
          lines={["+48 600 000 000 (pn–pt 9:00–16:00)"]}
        />
        <InfoCard
          icon={<Clock size={18} />}
          title="Czas odpowiedzi"
          lines={["Zwykle w 24–48h roboczych"]}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
          <h2 className="text-lg font-semibold mb-2">Napisz do nas</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Imię i nazwisko</label>
                <input
                  className={baseInput}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="np. Anna Kowalska"
                  autoComplete="name"
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </div>
              <div>
                <label className={labelCls}>E-mail</label>
                <input
                  className={baseInput}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="np. anna@example.com"
                  inputMode="email"
                  autoComplete="email"
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Temat</label>
              <select
                className={baseInput}
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
              >
                {TOPICS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Wiadomość</label>
              <textarea
                className={baseInput}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={6}
                placeholder="Opisz krótko sprawę…"
              />
              {errors.message && <FieldError>{errors.message}</FieldError>}
            </div>

            <div className="hidden">
              <label>Strona</label>
              <input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
              {errors.website && <FieldError>{errors.website}</FieldError>}
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 rounded border-stone-300"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
              />
              <span>
                Wyrażam zgodę na przetwarzanie moich danych w celu obsługi zapytania.
                <span className="block text-xs text-stone-500">
                  Administratorem danych jest Wedding Planner. Dane przechowujemy tylko lokalnie (mock).
                </span>
              </span>
            </label>
            {errors.consent && <FieldError>{errors.consent}</FieldError>}

            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-stone-500 inline-flex items-center gap-1">
                <Shield size={14} /> Dane nie są wysyłane na serwer (wersja demo).
              </div>
              <button
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-60"
              >
                <Send size={16} />
                {submitting ? "Wysyłanie…" : "Wyślij wiadomość"}
              </button>
            </div>
          </form>

          {sent === "ok" && (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              Dziękujemy! Wiadomość została zapisana (mock).
            </div>
          )}
          {sent === "fail" && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              Ups! Coś poszło nie tak. Spróbuj ponownie.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
            <h2 className="text-lg font-semibold mb-2">Dane kontaktowe</h2>
            <ul className="space-y-2 text-sm text-stone-700">
              <li className="flex items-center gap-2"><MapPin size={16}/> Kraków / Warszawa (zdalnie)</li>
              <li className="flex items-center gap-2"><Mail size={16}/> kontakt@weddingplanner.app</li>
              <li className="flex items-center gap-2"><Phone size={16}/> +48 600 000 000</li>
              <li className="flex items-center gap-2"><Clock size={16}/> Pon–Pt 9:00–16:00 (CET)</li>
            </ul>
            <div className="mt-3 text-xs text-stone-500">
              W sprawach pilnych prosimy pisać w tytule: <strong>[PILNE]</strong>.
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-200/60 shadow">
            <div className="h-56 w-full bg-brand-100 grid place-items-center text-stone-600">
              <div className="text-sm">Mapa dojazdu</div>
              <div style={{ width: "100%" }}>
                <iframe
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Grunwaldzka%2017,%2033-300%20Nowy%20S%C4%85cz+(WSB%20-%20NLU)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                >
                  <a href="https://www.mapsdirections.info/it/calcola-la-popolazione-su-una-mappa/">mappa della popolazione Italia</a>
                </iframe>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/60 p-4">
            <div className="text-sm text-stone-600">
              Szukasz informacji technicznych lub odpowiedzi natychmiast?
              Zobacz <NavLink to="/faq" className="text-stone-900 underline">FAQ</NavLink>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-stone-800">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 border border-brand-200">
          {icon}
        </span>
        <div className="font-medium">{title}</div>
      </div>
      <ul className="mt-2 text-sm text-stone-600 space-y-1">
        {lines.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-rose-600">{children}</div>;
}

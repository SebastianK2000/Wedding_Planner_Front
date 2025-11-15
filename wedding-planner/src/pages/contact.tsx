import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageSquare, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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
      await new Promise(res => setTimeout(res, 750));
      localStorage.setItem(key, JSON.stringify(prev));
      setSent("ok");
      setForm({ name: "", email: "", topic: "pytanie", message: "", consent: false, website: "" });
      setErrors({});
    } catch {
      setSent("fail");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSent(null), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="text-center space-y-6 py-8">
           <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full text-rose-600 mb-2">
              <MessageSquare className="h-8 w-8" />
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
             Skontaktuj się z nami
           </h1>
           <p className="text-stone-500 max-w-lg mx-auto">
             Masz pytanie, pomysł na funkcję, a może chcesz zgłosić błąd? 
             Jesteśmy tu, aby pomóc.
           </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-stone-200/60 overflow-hidden grid lg:grid-cols-2">
           <div className="p-8 md:p-12 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-stone-900 mb-2">Informacje kontaktowe</h2>
                <p className="text-stone-500 leading-relaxed">
                  Zanim napiszesz, sprawdź naszą bazę wiedzy. 
                  Być może odpowiedź na Twoje pytanie już tam jest!
                </p>
              </div>

              <ul className="space-y-4 text-stone-700">
                <li className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="font-semibold">kontakt@weddingplanner.app</span>
                    <span className="block text-sm text-stone-500">Najlepszy sposób kontaktu</span>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="font-semibold">+48 600 000 000</span>
                    <span className="block text-sm text-stone-500">Pn–Pt 9:00–16:00</span>
                  </div>
                </li>
                 <li className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="font-semibold">Kraków / Warszawa</span>
                    <span className="block text-sm text-stone-500">Pracujemy głównie zdalnie</span>
                  </div>
                </li>
              </ul>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                      <img src="https://placehold.co/80x80/ffe4e6/ec4899?text=FAQ" alt="FAQ" className="rounded-full w-20 h-20 object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                      <h4 className="font-semibold text-stone-800">Sprawdź nasze FAQ</h4>
                      <p className="text-sm text-stone-500 mb-3">Szybkie odpowiedzi na najczęstsze pytania.</p>
                      <Button asChild variant="outline" className="rounded-full bg-white shadow-sm">
                          <NavLink to="/faq">Przejdź do FAQ</NavLink>
                      </Button>
                  </div>
              </div>
           </div>

           <div className="p-8 md:p-12 bg-stone-50/70 border-l border-stone-100">
              
              {sent === "ok" ? (
                <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-500">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-semibold text-stone-900">Wiadomość zapisana!</h2>
                    <p className="text-stone-500 mt-2 max-w-xs">
                        Dziękujemy za kontakt. W tej wersji demo, wiadomość została zapisana w Twojej przeglądarce.
                    </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-700">Imię i nazwisko</label>
                      <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="np. Anna Kowalska"
                        autoComplete="name"
                        className="h-11 bg-white rounded-xl"
                      />
                      {errors.name && <FieldError>{errors.name}</FieldError>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-700">E-mail</label>
                      <Input
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="np. anna@example.com"
                        inputMode="email"
                        autoComplete="email"
                        className="h-11 bg-white rounded-xl"
                      />
                      {errors.email && <FieldError>{errors.email}</FieldError>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-700">Temat</label>
                      <Select value={form.topic} onValueChange={(v) => set("topic", v)}>
                        <SelectTrigger className="h-11 bg-white rounded-xl"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          {TOPICS.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-700">Wiadomość</label>
                      <Textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        rows={6}
                        placeholder="Opisz krótko sprawę..."
                        className="bg-white rounded-xl"
                      />
                      {errors.message && <FieldError>{errors.message}</FieldError>}
                  </div>

                  <div className="hidden">
                    <label>Strona</label>
                    <input value={form.website} onChange={(e) => set("website", e.target.value)} tabIndex={-1} autoComplete="off" />
                    {errors.website && <FieldError>{errors.website}</FieldError>}
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox id="consent" checked={form.consent} onCheckedChange={(c) => set("consent", Boolean(c))} className="mt-1" />
                    <div className="grid gap-1.5">
                        <label htmlFor="consent" className="text-sm font-medium leading-none cursor-pointer">
                          Wyrażam zgodę na przetwarzanie danych.
                        </label>
                        <p className="text-xs text-stone-500">
                          Dane są przetwarzane tylko na potrzeby odpowiedzi (wersja demo).
                        </p>
                        {errors.consent && <FieldError>{errors.consent}</FieldError>}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                     <div className="text-xs text-stone-500 inline-flex items-center gap-1.5">
                       <Shield size={14} /> Dane zapisywane lokalnie (demo).
                     </div>
                     <Button
                       type="submit"
                       disabled={submitting}
                       className="w-full sm:w-auto rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 h-12 px-8"
                     >
                       <Send size={16} className="mr-2" />
                       {submitting ? "Wysyłanie…" : "Wyślij wiadomość"}
                     </Button>
                  </div>

                  {sent === "fail" && (
                     <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Ups! Coś poszło nie tak. Spróbuj ponownie.</span>
                     </div>
                  )}
                </form>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <div className="mt-1.5 text-xs font-medium text-rose-600 animate-in fade-in duration-300">{children}</div>;
}
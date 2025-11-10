import { useParams, useNavigate } from "react-router-dom";
import { PHOTOGRAPHERS } from "@/data/photographers";
import { useEffect, useState } from "react";
import { CalendarDays, Check, Info, PlusCircle, Sparkles, TicketCheck } from "lucide-react";

const CART_KEY = "wp_cart_photographers";

type Photographer = (typeof PHOTOGRAPHERS)[number];

export default function PhotographerOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = PHOTOGRAPHERS.find((p) => p.id === id);

  const baseBtn =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary =
    baseBtn + " border border-stone-200 bg-white text-stone-700 hover:bg-stone-50";
  const btnPrimary = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [toast, setToast] = useState<string | null>(null);

  function addToCart() {
    if (!item) return;
    const raw = localStorage.getItem(CART_KEY);
    const prev: Photographer[] = raw ? (JSON.parse(raw) as Photographer[]) : [];
    const exists = prev.some((p) => p.id === item.id);
    const next = exists ? prev : [...prev, item];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setToast(exists ? "Już w planie ✨" : `Dodano: ${item.name}`);
    window.dispatchEvent(
      new CustomEvent("wp:cart:update", {
        detail: { count: next.length, key: CART_KEY },
      })
    );
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!item) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nie znaleziono oferty</h2>
        <button className={btnSecondary} onClick={() => navigate(-1)}>
          Wróć
        </button>
      </div>
    );
  }

  const included = [
    "Reportaż 10–12h",
    "Skrócony film highlight (opcjonalnie)",
    "Galeria online + album",
  ];

  const addons: { label: string; desc?: string; price?: string }[] = [
    {
      label: "Sesja narzeczeńska",
      desc: "60–90 min, 20–30 zdjęć obr.",
      price: "od 800 zł",
    },
    { label: "Drugi fotograf", desc: "+30% więcej ujęć", price: "+ 900 zł" },
    { label: "Fotobudka", desc: "druk 10×15, rekwizyty", price: "od 1200 zł" },
  ];

  const rawDates = [
    "2025-05-17",
    "2025-06-14",
    "2025-07-12",
    "2025-08-23",
    "2025-09-13",
  ];

  const today = new Date();
  const plDate = (d: Date) =>
    new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "short",
    }).format(d);

  type DateRow = { iso: string; date: Date; status: "past" | "today" | "future" };
  const dates: DateRow[] = rawDates.map((iso) => {
    const d = new Date(iso + "T12:00:00");
    const sameDay =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
    const status: DateRow["status"] = sameDay
      ? "today"
      : d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ? "past"
      : "future";
    return { iso, date: d, status };
  });

  const hasUpcoming = dates.some((d) => d.status === "future" || d.status === "today");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow border border-stone-200/60 bg-white">
        <img src={item.img} alt={item.name} className="w-full h-72 object-cover" />
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {item.name}
              </h1>
              <p className="text-stone-600 mt-1">
                {item.city} • od{" "}
                <strong>
                  {new Intl.NumberFormat("pl-PL").format(item.priceFrom)} zł
                </strong>
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2" aria-hidden>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <Sparkles size={14} /> Rekomendowany
              </span>
            </div>
          </div>
          <p className="text-stone-700 mt-3 leading-relaxed">{item.desc}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button className={btnSecondary} onClick={() => navigate(-1)}>
              Wróć
            </button>
            <button className={btnPrimary} onClick={addToCart}>
              <PlusCircle className="h-4 w-4" /> Dodaj do planu
            </button>
          </div>
        </div>
      </div>

      <section aria-labelledby="section-info" className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 bg-white rounded-2xl shadow p-4 md:p-5 border border-stone-200/60">
          <h3 id="section-info" className="font-semibold mb-3 flex items-center gap-2">
            <TicketCheck className="h-5 w-5 text-accent-500" /> Co w pakiecie?
          </h3>
          <ul className="text-sm text-stone-700 space-y-2">
            {included.map((it, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 p-0.5">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 flex gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            Materiały dostarczane w 14–28 dni roboczych. Surowe pliki są archiwizowane przez 6 miesięcy.
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl shadow p-4 md:p-5 border border-stone-200/60">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-500" /> Dodatki
          </h3>
          <ul className="divide-y divide-stone-100">
            {addons.map((a, i) => (
              <li key={i} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-stone-800">{a.label}</p>
                  {a.desc && (
                    <p className="text-xs text-stone-600 mt-0.5">{a.desc}</p>
                  )}
                </div>
                {a.price && (
                  <span className="shrink-0 inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700">
                    {a.price}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button className={btnSecondary} onClick={addToCart}>
              <PlusCircle className="h-4 w-4" /> Dodaj dodatki do planu
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow p-4 md:p-5 border border-stone-200/60">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent-500" /> Terminy
          </h3>

          <div className="space-y-2">
            {dates.map((d) => (
              <div
                key={d.iso}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                  d.status === "future"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : d.status === "today"
                    ? "border-accent-200 bg-accent-50 text-accent-800"
                    : "border-stone-200 bg-stone-50 text-stone-600"
                }`}
                title={d.status === "past" ? "Termin minął" : d.status === "today" ? "Dziś" : "Wolny"}
              >
                <span>{plDate(d.date)}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
                    d.status === "future"
                      ? "bg-white/70 border-emerald-300 text-emerald-700"
                      : d.status === "today"
                      ? "bg-white/70 border-accent-300 text-accent-700"
                      : "bg-white/70 border-stone-300 text-stone-700"
                  }`}
                >
                  {d.status === "future" && "wolny"}
                  {d.status === "today" && "dzisiaj"}
                  {d.status === "past" && "minął"}
                </span>
              </div>
            ))}
          </div>

          {!hasUpcoming && (
            <p className="mt-3 text-xs text-stone-600">
              Brak nadchodzących terminów z listy — wyślij zapytanie o inne daty.
            </p>
          )}

          <button className={`${btnPrimary} w-full mt-3`} onClick={addToCart}>
            Zapytaj o dostępność
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 border border-stone-200/60">
          <h4 className="font-medium mb-2">Warunki współpracy</h4>
          <dl className="text-sm text-stone-700 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-stone-600">Zadatek</dt>
              <dd className="font-medium">30% przy rezerwacji</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-stone-600">Umowa</dt>
              <dd className="font-medium">online / podpis elektroniczny</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-stone-600">Faktura</dt>
              <dd className="font-medium">tak, VAT</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 border border-stone-200/60">
          <h4 className="font-medium mb-2">Dostawa materiałów</h4>
          <p className="text-sm text-stone-700">
            Galeria online + album drukowany. Czas realizacji: 14–28 dni roboczych. Wszystkie pliki w pełnej
            rozdzielczości, bez znaków wodnych.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 border border-stone-200/60">
          <h4 className="font-medium mb-2">Prawa autorskie</h4>
          <p className="text-sm text-stone-700">
            Licencja do użytku prywatnego. Zgoda na publikację w materiałach promocyjnych — opcjonalna.
          </p>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900 text-white px-4 py-2 shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { FLORISTS } from "@/data/florists";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Info,
  Leaf,
  Flower2,
  Sparkles,
  Truck,
  PlusCircle,
} from "lucide-react";

const CART_KEY = "wp_cart_florists";

export default function FloristOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = FLORISTS.find((f) => f.id === id);

  const baseBtn =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-stone-200 bg-white text-stone-700 hover:bg-stone-50";
  const btnPrimary = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  function addToCart() {
    if (!item) return;
    type Florist = (typeof FLORISTS)[number];
    const raw = localStorage.getItem(CART_KEY);
    const prev: Florist[] = raw ? (JSON.parse(raw) as Florist[]) : [];
    const exists = prev.some((x) => x.id === item.id);
    const next = exists ? prev : [...prev, item];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setToast(exists ? "Już w planie ✨" : `Dodano: ${item.title}`);
    window.dispatchEvent(
      new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY } })
    );
  }

  const scope = [
    "Bukiet Panny Młodej + butonierka",
    "Dekoracja ceremonii (kościół/USC/plener)",
    "Centerpiece na stoły + dekoracja stołu prezydialnego",
  ];

  const styles: { label: string; tip?: string }[] = [
    { label: "Boho / rustykalny" },
    { label: "Klasyczny / elegancki" },
    { label: "Minimal / greenery" },
    { label: "Pastel / romantic" },
  ];

  const addons: { label: string; desc?: string; price?: string; icon?: ReactNode }[] = [
    { label: "Ścianka kwiatowa", price: "od 1200 zł", icon: <Flower2 className="h-4 w-4" /> },
    { label: "Łuk na ceremonię", price: "od 900 zł", icon: <Leaf className="h-4 w-4" /> },
    { label: "Wystrój auta", price: "od 300 zł", icon: <Truck className="h-4 w-4" /> },
  ];

  const plDate = (d: Date) =>
    new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "short",
    }).format(d);

  type DateRow = { iso: string; date: Date; status: "past" | "today" | "future" };
  const dates: DateRow[] = useMemo(() => {
    const rawDates = ["2025-05-17", "2025-06-14", "2025-07-12", "2025-08-23", "2025-09-13"];
    const today = new Date();
    return rawDates.map((iso) => {
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
  }, []);

  const hasUpcoming = dates.some((d) => d.status === "future" || d.status === "today");

  if (!item) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nie znaleziono oferty</h2>
        <button className={btnSecondary} onClick={() => navigate(-1)}>Wróć</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-stone-200/60 bg-white shadow">
        <img src={item.image} alt={item.title} className="h-72 w-full object-cover" />
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{item.title}</h1>
              <p className="mt-1 text-stone-600">
                {item.companyName} • od <strong>{new Intl.NumberFormat("pl-PL").format(item.priceFrom)} zł</strong>
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2" aria-hidden>
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                <Sparkles size={14} /> Rekomendowany florysta
              </span>
            </div>
          </div>

          <p className="mt-3 text-stone-700 leading-relaxed">{item.desc}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button className={btnSecondary} onClick={() => navigate(-1)}>Wróć</button>
            <button className={btnPrimary} onClick={addToCart}>
              <PlusCircle className="h-4 w-4" /> Dodaj do planu
            </button>
          </div>
        </div>
      </div>

      <section aria-labelledby="florist-info" className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-2xl border border-stone-200/60 bg-white p-4 md:p-5 shadow">
          <h3 id="florist-info" className="mb-3 flex items-center gap-2 font-semibold">
            <Flower2 className="h-5 w-5 text-accent-500" /> Zakres prac
          </h3>
          <ul className="space-y-2 text-sm text-stone-700">
            {scope.map((line, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 rounded-md border border-emerald-200 bg-emerald-50 p-0.5 text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2 text-xs text-stone-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Kwiaty dobierane sezonowo. Możliwe zamienniki przy ograniczonej dostępności.
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-stone-200/60 bg-white p-4 md:p-5 shadow">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Leaf className="h-5 w-5 text-accent-500" /> Styl & kolorystyka
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-stone-700">
            {styles.map((s) => (
              <li key={s.label} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
                {s.label}
              </li>
            ))}
          </ul>

          <h4 className="mt-4 text-sm font-semibold text-stone-800">Dodatki</h4>
          <ul className="divide-y divide-stone-100">
            {addons.map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-2">
                  {a.icon}
                  <p className="text-sm font-medium text-stone-800">{a.label}</p>
                </div>
                {a.price && (
                  <span className="inline-flex shrink-0 items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700">
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

        <div className="lg:col-span-3 rounded-2xl border border-stone-200/60 bg-white p-4 md:p-5 shadow">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
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
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                    d.status === "future"
                      ? "border-emerald-300 bg-white/70 text-emerald-700"
                      : d.status === "today"
                      ? "border-accent-300 bg-white/70 text-accent-700"
                      : "border-stone-300 bg-white/70 text-stone-700"
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
            <p className="mt-3 text-xs text-stone-600">Brak nadchodzących terminów — wyślij zapytanie o inne daty.</p>
          )}
          <button className={`${btnPrimary} mt-3 w-full`} onClick={addToCart}>Zapytaj o dostępność</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200/60 bg-white p-4 shadow">
          <h4 className="mb-2 font-medium">Warunki współpracy</h4>
          <dl className="space-y-2 text-sm text-stone-700">
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
        <div className="rounded-2xl border border-stone-200/60 bg-white p-4 shadow">
          <h4 className="mb-2 font-medium">Logistyka & montaż</h4>
          <p className="text-sm text-stone-700">
            Montaż w dniu uroczystości lub dzień wcześniej (po uzgodnieniu z salą). Demontaż następnego dnia.
            Prosimy o dostęp do sali min. 3h przed rozpoczęciem.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200/60 bg-white p-4 shadow">
          <h4 className="mb-2 font-medium">Konserwacja</h4>
          <p className="text-sm text-stone-700">
            Używamy odżywek florystycznych; dekoracje zabezpieczone przed przesuszeniem. Rośliny doniczkowe opcjonalnie.
          </p>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-stone-900 px-4 py-2 text-white shadow">{toast}</div>
      )}
    </div>
  );
}

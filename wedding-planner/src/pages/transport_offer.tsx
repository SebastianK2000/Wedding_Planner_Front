import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TRANSPORT, type TransportVendor, CART_KEY_TRANSPORT } from "@/data/transport";
import { CalendarDays, Clock, Info, MapPin, Route, Sparkles, Users, Bus, Car, PlusCircle } from "lucide-react";

type Booking = {
  vendorId: string;
  date: string;
  time: string;
  from: string;
  to: string;
  trips: number;
  passengers?: number;
  notes?: string;
};

const LS_BOOKINGS = "wp_transport_bookings";

export default function TransportOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = TRANSPORT.find((t) => t.id === id) as TransportVendor | undefined;

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

  const [form, setForm] = useState<Booking>(() => ({
    vendorId: id || "",
    date: "",
    time: "",
    from: "",
    to: "",
    trips: 1,
    passengers: item?.capacity ?? undefined,
    notes: "",
  }));

  const estPrice = useMemo(() => {
    if (!item) return 0;
    return item.type === "Bus" ? item.priceFrom * Math.max(1, form.trips) : item.priceFrom;
  }, [item, form.trips]);

  function addToPlan() {
    if (!item) return;
    try {
      const raw = localStorage.getItem(CART_KEY_TRANSPORT);
      const prev: TransportVendor[] = raw ? JSON.parse(raw) : [];
      const exists = prev.some((p) => p.id === item.id);
      const next = exists ? prev : [...prev, item];
      localStorage.setItem(CART_KEY_TRANSPORT, JSON.stringify(next));
      window.dispatchEvent(
        new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY_TRANSPORT } })
      );
      setToast(exists ? "Już w planie ✨" : `Dodano: ${item.name}`);
    } catch {
      setToast("Ups, nie udało się zapisać");
    }
  }

  function book() {
    if (!item) return;
    if (!form.date || !form.time || !form.from || !form.to) {
      setToast("Uzupełnij datę, godzinę oraz trasę.");
      return;
    }
    try {
      const raw = localStorage.getItem(LS_BOOKINGS);
      const prev: Booking[] = raw ? JSON.parse(raw) : [];
      const next = [{ ...form, vendorId: item.id }, ...prev];
      localStorage.setItem(LS_BOOKINGS, JSON.stringify(next));
      setToast("Zapisano rezerwację (mock)");
    } catch {
      setToast("Nie udało się zapisać rezerwacji");
    }
  }

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

  const perks = [
    { icon: <Route className="h-4 w-4" />, label: "Elastyczne trasy" },
    { icon: <Clock className="h-4 w-4" />, label: "Rozliczenie godzinowe" },
    { icon: <Users className="h-4 w-4" />, label: `${item.capacity ? `${item.capacity}+ miejsc` : "Różne pojemności"}` },
  ];

  const fleet = [
    { icon: <Bus className="h-4 w-4" />, label: "Autokar / bus klimatyzowany" },
    { icon: <Car className="h-4 w-4" />, label: "Auto dla Pary Młodej" },
    { icon: <MapPin className="h-4 w-4" />, label: "Transfery lotnisko / hotel" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow border border-stone-200/60 bg-white">
        <img src={item.img} alt={item.name} className="w-full h-72 object-cover" />
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{item.name}</h1>
              <p className="text-stone-600 mt-1">
                {item.city} • {item.type}
                {item.capacity ? <> • {item.capacity} miejsc</> : null} • od <strong>{new Intl.NumberFormat("pl-PL").format(item.priceFrom)} zł</strong>
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2" aria-hidden>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <Sparkles size={14} /> Rekomendowany przewoźnik
              </span>
            </div>
          </div>
          <p className="text-stone-700 mt-3 leading-relaxed">{item.desc}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button className={btnSecondary} onClick={() => navigate(-1)}>Wróć</button>
            <button className={btnPrimary} onClick={addToPlan}><PlusCircle className="h-4 w-4" /> Dodaj do planu</button>
          </div>
        </div>
      </div>

      <section aria-labelledby="transport-info" className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5 bg-white rounded-2xl shadow p-4 md:p-5 border border-stone-200/60">
          <h3 id="transport-info" className="font-semibold mb-3 flex items-center gap-2">
            <Route className="h-5 w-5 text-accent-500" /> Zakres usług
          </h3>
          <ul className="text-sm text-stone-700 space-y-2">
            <li className="flex items-start gap-2"><span className="mt-0.5 rounded-md bg-emerald-50 border border-emerald-200 p-0.5 text-emerald-700">•</span> Przewóz gości: ceremonia ⇄ sala, postój na zdjęcia</li>
            <li className="flex items-start gap-2"><span className="mt-0.5 rounded-md bg-emerald-50 border border-emerald-200 p-0.5 text-emerald-700">•</span> Transfer Pary Młodej oraz VIP</li>
            <li className="flex items-start gap-2"><span className="mt-0.5 rounded-md bg-emerald-50 border border-emerald-200 p-0.5 text-emerald-700">•</span> Shuttle po północy (kursy na żądanie)</li>
          </ul>
          <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 flex gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" /> Elastyczne czasy postoju i możliwość dodawania przystanków.
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl shadow p-4 md:p-5 border border-stone-200/60">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Bus className="h-5 w-5 text-accent-500" /> Flota & wyposażenie
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-stone-700">
            {fleet.map((f) => (
              <li key={f.label} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
                {f.icon} {f.label}
              </li>
            ))}
          </ul>
          <h4 className="mt-4 text-sm font-semibold text-stone-800">Atuty</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {perks.map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700">
                {p.icon} {p.label}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow p-4 md:p-5 border border-stone-200/60">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent-500" /> Terminy
          </h3>
          <p className="text-sm text-stone-700">
            Rezerwacje przyjmujemy z 6–12 mies. wyprzedzeniem. Wysoki popyt: maj–wrzesień.
          </p>
          <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Obszar: {item.city} i okolice (do 80 km). Dalsze trasy — na zapytanie.
          </div>
        </div>
      </section>

      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <h3 className="text-lg font-semibold">Rezerwacja (mock)</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          <div>
            <label className="block text-xs text-stone-500 mb-1">Data</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Godzina</label>
            <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Liczba kursów</label>
            <input type="number" min={1} value={form.trips} onChange={(e) => setForm((f) => ({ ...f, trips: Math.max(1, Number(e.target.value) || 1) }))} className="w-full rounded-xl border border-stone-300 px-3 py-2" />
          </div>
          {item.type === "Bus" && (
            <div>
              <label className="block text-xs text-stone-500 mb-1">Pasażerowie (opc.)</label>
              <input type="number" min={0} value={form.passengers ?? ""} onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value ? Number(e.target.value) : undefined }))} className="w-full rounded-xl border border-stone-300 px-3 py-2" placeholder="np. 60" />
            </div>
          )}
          <div>
            <label className="block text-xs text-stone-500 mb-1">Skąd</label>
            <input value={form.from} onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-2" placeholder="np. Kościół — ul. ..." />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Dokąd</label>
            <input value={form.to} onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-2" placeholder="np. Sala weselna — ..." />
          </div>
          <div className="lg:col-span-3">
            <label className="block text-xs text-stone-500 mb-1">Notatki</label>
            <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2" rows={3} placeholder="np. dwa przystanki po drodze, fotobudka z osobnym transportem…" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-stone-600">
            Szacowana cena: <strong>{new Intl.NumberFormat("pl-PL").format(estPrice)} zł</strong>
            {item.type === "Bus" && form.trips > 1 && " (x kursy)"}
          </div>
          <div className="flex gap-2">
            <button className={btnSecondary} onClick={() => navigate(-1)}>Anuluj</button>
            <button className={btnPrimary} onClick={book}>Zapisz rezerwację</button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900 text-white px-4 py-2 shadow">{toast}</div>
      )}
    </div>
  );
}

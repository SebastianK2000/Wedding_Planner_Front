import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRANSPORT, type TransportVendor, CART_KEY_TRANSPORT } from "@/data/transport";

export default function Transport() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";
  const btnPrimary   = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  // ---- Planner pojemności
  const [guests, setGuests] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [mix, setMix] = useState<{ [id: string]: number }>({}); // id -> liczba pojazdów

  const buses = useMemo(() => TRANSPORT.filter(t => t.type === "Bus" && t.capacity), []);
  const totalSeats = useMemo(() =>
    Object.entries(mix).reduce((s, [id, count]) => {
      const v = TRANSPORT.find(x => x.id === id);
      return s + (v?.capacity || 0) * (count || 0);
    }, 0), [mix]);

  function suggestMix() {
    if (!guests || guests <= 0) return setMix({});
    // Greedy: najpierw największe autobusy
    const sorted = [...buses].sort((a, b) => (b.capacity! - a.capacity!));
    let remaining = Number(guests);
    const result: Record<string, number> = {};
    for (const b of sorted) {
      const take = Math.floor(remaining / (b.capacity || 1));
      if (take > 0) {
        result[b.id] = take;
        remaining -= take * (b.capacity || 0);
      }
    }
    if (remaining > 0) {
      // dołóż najmniejszy bus, by domknąć
      const smallest = sorted[sorted.length - 1];
      result[smallest.id] = (result[smallest.id] || 0) + 1;
      remaining = 0;
    }
    setMix(result);
  }

  // ---- Modal Szczegóły
  const [selected, setSelected] = useState<TransportVendor | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function openDetails(item: TransportVendor) { setSelected(item); setOpen(true); }
  function closeDetails() { setOpen(false); setSelected(null); }

  function addToPlan(item: TransportVendor) {
    try {
      const raw = localStorage.getItem(CART_KEY_TRANSPORT);
      const prev: TransportVendor[] = raw ? JSON.parse(raw) : [];
      const exists = prev.some(p => p.id === item.id);
      const next = exists ? prev : [...prev, item];
      localStorage.setItem(CART_KEY_TRANSPORT, JSON.stringify(next));
      setToast(exists ? "Już w planie ✨" : `Dodano: ${item.name}`);
      // powiadom navbar/badge
      window.dispatchEvent(new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY_TRANSPORT } }));
    } catch {
      setToast("Ups, nie udało się zapisać 😕");
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transport</h2>
      <p className="text-stone-600">Busy dla gości, samochód ślubny, logistyka dojazdu.</p>

      {/* Planner pojemności */}
      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-stone-500 mb-1">Liczba gości do przewozu</label>
            <input
              inputMode="numeric"
              value={guests}
              onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
              placeholder="np. 80"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Miasto startu</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
              placeholder="np. Kraków"
            />
          </div>
          <div className="flex items-end">
            <button className={btnSecondary} onClick={suggestMix} disabled={!guests}>Zaproponuj układ busów</button>
          </div>
        </div>

        {/* Dobór busów */}
        {Object.keys(mix).length > 0 && (
          <div className="mt-3 rounded-xl border border-stone-200 p-3">
            <div className="text-sm font-medium mb-2">Proponowany układ</div>
            <div className="flex flex-wrap gap-2 text-sm">
              {Object.entries(mix).map(([id, count]) => {
                const v = TRANSPORT.find(x => x.id === id)!;
                return (
                  <span key={id} className="px-3 py-1 rounded-xl bg-brand-100 border border-brand-200">
                    {v.name} × {count} ({v.capacity} miejsc)
                  </span>
                );
              })}
            </div>
            <div className="text-sm text-stone-600 mt-2">
              Razem miejsc: <strong>{totalSeats}</strong>{guests ? ` • Gości: ${guests}` : ""}
              {guests && totalSeats < guests && <span className="text-rose-600"> • Za mało miejsc — dołóż pojazd.</span>}
            </div>
          </div>
        )}
      </div>

      {/* Lista przewoźników */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRANSPORT.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl shadow border border-stone-200/60 overflow-hidden">
            <img src={t.img} alt={`${t.name}`} className="w-full h-40 object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-stone-600">
                {t.type} • {t.city}
                {t.capacity ? <> • {t.capacity} miejsc</> : null} • od{" "}
                <strong>{new Intl.NumberFormat("pl-PL").format(t.priceFrom)} zł</strong>
              </div>
              <div className="text-sm text-stone-600 mt-1">Opis: {t.desc}</div>
              <div className="pt-3 flex flex-wrap gap-2">
                <button className={btnSecondary} onClick={() => openDetails(t)}>Szczegóły</button>
                <button className={btnSecondary} onClick={() => navigate(`/transport/${t.id}`)}>Idź do oferty</button>
                <button className={btnPrimary}   onClick={() => addToPlan(t)}>Dodaj</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Szczegóły */}
      {open && selected && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={closeDetails}>
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <img src={selected.img} alt={selected.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-stone-600">
                {selected.type} • {selected.city}
                {selected.capacity ? <> • {selected.capacity} miejsc</> : null} • od{" "}
                <strong>{new Intl.NumberFormat("pl-PL").format(selected.priceFrom)} zł</strong>
              </p>
              <p className="text-sm text-stone-600 mt-2">{selected.desc}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button className={btnSecondary} onClick={closeDetails}>Zamknij</button>
                <button className={btnSecondary} onClick={() => navigate(`/transport/${selected.id}`)}>Idź do oferty</button>
                <button className={btnPrimary} onClick={() => { addToPlan(selected); closeDetails(); }}>Dodaj do planu</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900 text-white px-4 py-2 shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRANSPORT, type TransportVendor, CART_KEY_TRANSPORT } from "@/data/transport";

export default function Transport() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";
  const btnPrimary   = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";


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
      window.dispatchEvent(new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY_TRANSPORT } }));
    } catch {
      setToast("Ups, nie udało się zapisać");
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
      <p className="text-stone-600">Busy dla gości, samochód ślubny, szeroka możliwość wyboru!</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRANSPORT.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl shadow border border-stone-200/60 overflow-hidden">
            <img src={t.img} alt={`${t.name}`} className="w-full h-40 object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-stone-600">
                {t.city} • {t.type}
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

      {open && selected && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={closeDetails}>
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <img src={selected.img} alt={selected.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-stone-600">
                {selected.city} • {selected.type}
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900 text-white px-4 py-2 shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

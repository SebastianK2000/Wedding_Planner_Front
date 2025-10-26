import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FLORISTS, type FloristItem } from "@/data/florists";

const CART_KEY = "wp_cart_florists";

export default function Florist() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";
  const btnPrimary   = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [selected, setSelected] = useState<FloristItem | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function openDetails(item: FloristItem) { setSelected(item); setOpen(true); }
  function closeDetails() { setOpen(false); setSelected(null); }

  function addToCart(item: FloristItem) {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev: FloristItem[] = raw ? JSON.parse(raw) : [];
      const exists = prev.some((x) => x.id === item.id);
      const next = exists ? prev : [...prev, item];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      setToast(exists ? "Już w planie ✨" : `Dodano: ${item.title}`);
      window.dispatchEvent(new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY } }));
    } catch { setToast("Ups, nie udało się zapisać 😕"); }
  }

  useEffect(() => { if (!toast) return; const t = setTimeout(()=>setToast(null), 2000); return ()=>clearTimeout(t); }, [toast]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Florysta</h2>
      <p className="text-stone-600">Dekoracje, bukiety, ścianka i dodatki.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FLORISTS.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl shadow border border-stone-200/60 overflow-hidden">
            <img src={f.image} alt={f.title} className="w-full h-40 object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-stone-600">Opis: {f.desc}</div>
              <div className="pt-3 flex flex-wrap gap-2">
                <button className={btnSecondary} onClick={() => openDetails(f)}>Szczegóły</button>
                <button className={btnSecondary} onClick={() => navigate(`/florysta/${f.id}`)}>Idź do oferty</button>
                <button className={btnPrimary}   onClick={() => addToCart(f)}>Dodaj</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && selected && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={closeDetails}>
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{selected.title}</h3>
              <p className="text-sm text-stone-600 mt-2">{selected.desc}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button className={btnSecondary} onClick={closeDetails}>Zamknij</button>
                <button className={btnSecondary} onClick={() => navigate(`/florysta/${selected.id}`)}>Idź do oferty</button>
                <button className={btnPrimary} onClick={() => { addToCart(selected); closeDetails(); }}>Dodaj do planu</button>
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

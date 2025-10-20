import { useParams, useNavigate } from "react-router-dom";
import { PHOTOGRAPHERS } from "@/data/photographers";
import { useEffect, useState } from "react";

const CART_KEY = "wp_cart_photographers";

export default function PhotographerOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = PHOTOGRAPHERS.find(p => p.id === id);

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";
  const btnPrimary   = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return; const t = setTimeout(()=>setToast(null), 2000); return ()=>clearTimeout(t);
  }, [toast]);

  function addToCart() {
    if (!item) return;
    const raw = localStorage.getItem(CART_KEY);
    const prev = raw ? JSON.parse(raw) : [];
    const exists = prev.some((p) => p.id === item.id);
    const next = exists ? prev : [...prev, item];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setToast(exists ? "Już w planie ✨" : `Dodano: ${item.name}`);
    window.dispatchEvent(new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY } }));
  }

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
      <div className="rounded-2xl overflow-hidden shadow border border-stone-200/60">
        <img src={item.img} alt={item.name} className="w-full h-72 object-cover" />
        <div className="p-4">
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="text-stone-600">
            {item.city} • pakiet od <strong>{new Intl.NumberFormat("pl-PL").format(item.priceFrom)} zł</strong>
          </p>
          <p className="text-stone-600 mt-2">{item.desc}</p>

          <div className="mt-4 flex gap-2">
            <button className={btnSecondary} onClick={() => navigate(-1)}>Wróć</button>
            <button className={btnPrimary} onClick={addToCart}>Dodaj do planu</button>
          </div>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 border border-stone-200/60">
          <h3 className="font-medium mb-1">Co w pakiecie?</h3>
          <ul className="text-sm text-stone-600 list-disc pl-5 space-y-1">
            <li>Reportaż 10–12h</li><li>Skrócony film highlight (opcjonalnie)</li><li>Galeria online + album</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 border border-stone-200/60">
          <h3 className="font-medium mb-1">Dodatki</h3>
          <ul className="text-sm text-stone-600 list-disc pl-5 space-y-1">
            <li>Sesja narzeczeńska</li><li>Drugi fotograf</li><li>Fotobudka</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 border border-stone-200/60">
          <h3 className="font-medium mb-1">Terminy</h3>
          <p className="text-sm text-stone-600">
            - 2025-05-17 <br/>
            - 2025-06-14 <br/>
            - 2025-07-12 <br/>
            - 2025-08-23 <br/>
            - 2025-09-13
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
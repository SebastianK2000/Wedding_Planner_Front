import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MUSIC, type MusicItem } from "@/data/music";

const CART_KEY = "wp_cart_music";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "nazwa";

export default function Music() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-stone-200 bg-white text-stone-700 hover:bg-stone-50";
  const btnPrimary = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [selected, setSelected] = useState<MusicItem | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function openDetails(item: MusicItem) { setSelected(item); setOpen(true); }
  function closeDetails() { setOpen(false); setSelected(null); }

  function addToCart(item: MusicItem) {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev: MusicItem[] = raw ? JSON.parse(raw) : [];
      const exists = prev.some((x) => x.id === item.id);
      const next = exists ? prev : [...prev, item];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      setToast(exists ? "Już w planie ✨" : `Dodano: ${item.name}`);
      window.dispatchEvent(new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY } }));
    } catch { setToast("Ups, nie udało się zapisać 😕"); }
  }

  useEffect(() => { if (!toast) return; const t = setTimeout(()=>setToast(null), 2000); return ()=>clearTimeout(t); }, [toast]);

  const [q, setQ] = useState("");
  const [mtype, setMtype] = useState<string>("Wszystkie");
  const [sort, setSort] = useState<SortKey>("rekomendowane");

  const [priceMin, setPriceMin] = useState<number>(() => MUSIC.reduce((m, v) => Math.min(m, v.priceFrom), Number.POSITIVE_INFINITY));
  const [priceMax, setPriceMax] = useState<number>(() => MUSIC.reduce((m, v) => Math.max(m, v.priceFrom), 0));

  const [rangeMin, rangeMax] = useMemo(() => {
    const min = MUSIC.reduce((m, v) => Math.min(m, v.priceFrom), Number.POSITIVE_INFINITY);
    const max = MUSIC.reduce((m, v) => Math.max(m, v.priceFrom), 0);
    return [min, max];
  }, []);

  useEffect(() => {
    if (!Number.isFinite(priceMin)) setPriceMin(rangeMin);
    if (!Number.isFinite(priceMax) || priceMax === 0) setPriceMax(rangeMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const types = useMemo(() => ["Wszystkie", ...Array.from(new Set(MUSIC.map(m => m.type)))], []);

  const filtered = useMemo(() => {
    let items = MUSIC.filter((m) => {
      const hay = `${m.name} ${m.city} ${m.type} ${m.desc}`.toLowerCase();
      const matchesText = q ? hay.includes(q.toLowerCase()) : true;
      const matchesType = mtype === "Wszystkie" ? true : m.type === mtype;
      const matchesPrice = m.priceFrom >= priceMin && m.priceFrom <= priceMax;
      return matchesText && matchesType && matchesPrice;
    });

    switch (sort) {
      case "cena-rosn":
        items = items.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "cena-malej":
        items = items.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "nazwa":
        items = items.sort((a, b) => a.name.localeCompare(b.name, "pl"));
        break;
      default:
        items = items.sort((a, b) => a.priceFrom - b.priceFrom);
    }

    return items;
  }, [q, mtype, priceMin, priceMax, sort]);

  return (
    <div className="space-y-4">
      {/* Pasek tytuł + filtry */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow">
        <div className="grid gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <h2 className="text-xl font-semibold">Muzyka</h2>
            <p className="text-stone-600">Wybierz swój zespół lub DJ'a i zapewnij sobie niesamowite przeżycia!</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 md:col-span-8 md:grid-cols-5">
            {/* Szukaj */}
            <div>
              <label className="mb-1 block text-xs text-stone-500">Szukaj</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="nazwa, miasto, opis..."
                className="w-full rounded-xl border border-stone-300 px-3 py-2"
              />
            </div>

            {/* Typ */}
            <div>
              <label className="mb-1 block text-xs text-stone-500">Typ</label>
              <select
                value={mtype}
                onChange={(e) => setMtype(e.target.value)}
                className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Cena min */}
            <div>
              <label className="mb-1 block text-xs text-stone-500">Cena min (zł)</label>
              <input
                type="number"
                min={rangeMin}
                max={priceMax}
                placeholder="min"
                onChange={(e) => setPriceMin(Math.max(rangeMin, Number(e.target.value) || rangeMin))}
                className="w-full rounded-xl border border-stone-300 px-3 py-2"
              />
            </div>

            {/* Cena max */}
            <div>
              <label className="mb-1 block text-xs text-stone-500">Cena max (zł)</label>
              <input
                type="number"
                min={priceMin}
                max={rangeMax}
                placeholder="max"
                onChange={(e) => setPriceMax(Math.min(rangeMax, Number(e.target.value) || rangeMax))}
                className="w-full rounded-xl border border-stone-300 px-3 py-2"
              />
            </div>

            {/* Sortowanie */}
            <div>
              <label className="mb-1 block text-xs text-stone-500">Sortowanie</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 bg-brand-100"
              >
                <option value="rekomendowane">Rekomendowane</option>
                <option value="cena-rosn">Cena: rosnąco</option>
                <option value="cena-malej">Cena: malejąco</option>
                <option value="nazwa">Nazwa A–Z</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-stone-600">
        <span>Zakres cen: <strong>{numberFmt(rangeMin)}–{numberFmt(rangeMax)} zł</strong></span>
        <span>Znaleziono: <strong>{filtered.length}</strong></span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow">
            <img src={m.img} alt={`${m.name} – ${m.type}`} className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-stone-600">{m.city} • {m.type} • od <strong>{numberFmt(m.priceFrom)} zł</strong></div>
              <div className="mt-1 text-sm text-stone-600">Opis: {m.desc}</div>
              <div className="pt-3 flex flex-wrap gap-2">
                <button className={btnSecondary} onClick={() => openDetails(m)}>Szczegóły</button>
                <button className={btnSecondary} onClick={() => navigate(`/muzyka/${m.id}`)}>Idź do oferty</button>
                <button className={btnPrimary} onClick={() => addToCart(m)}>Dodaj</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && selected && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={closeDetails}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <img src={selected.img} alt={selected.name} className="h-64 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-stone-600">{selected.city} • {selected.type} • od <strong>{numberFmt(selected.priceFrom)} zł</strong></p>
              <p className="mt-2 text-sm text-stone-600">{selected.desc}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button className={btnSecondary} onClick={closeDetails}>Zamknij</button>
                <button className={btnSecondary} onClick={() => navigate(`/muzyka/${selected.id}`)}>Idź do oferty</button>
                <button className={btnPrimary} onClick={() => { addToCart(selected); closeDetails(); }}>Dodaj do planu</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900 px-4 py-2 text-white shadow">{toast}</div>)}
    </div>
  );
}

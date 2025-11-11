import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHOTOGRAPHERS, type PhotographerItem } from "@/data/photographers";

const CART_KEY = "wp_cart_photographers";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "nazwa";

export default function Photographer() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary = baseBtn + " border border-stone-200 bg-white text-stone-700 hover:bg-stone-50";
  const btnPrimary   = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [selected, setSelected] = useState<PhotographerItem | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function openDetails(item: PhotographerItem) { setSelected(item); setOpen(true); }
  function closeDetails() { setOpen(false); setSelected(null); }

  function addToCart(item: PhotographerItem) {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev: PhotographerItem[] = raw ? JSON.parse(raw) : [];
      const exists = prev.some((p) => p.id === item.id);
      const next = exists ? prev : [...prev, item];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      setToast(exists ? "Już w planie ✨" : `Dodano: ${item.name}`);
      window.dispatchEvent(new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY } }));
    } catch {
      setToast("Ups, nie udało się zapisać");
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("rekomendowane");

  const [priceMinInit, priceMaxInit] = useMemo(() => {
    const min = PHOTOGRAPHERS.reduce((m, p) => Math.min(m, p.priceFrom), Number.POSITIVE_INFINITY);
    const max = PHOTOGRAPHERS.reduce((m, p) => Math.max(m, p.priceFrom), 0);
    return [min, max];
  }, []);

  const [priceMin, setPriceMin] = useState<number>(priceMinInit);
  const [priceMax, setPriceMax] = useState<number>(priceMaxInit);

  useEffect(() => {
    if (!Number.isFinite(priceMin)) setPriceMin(priceMinInit);
    if (!Number.isFinite(priceMax) || priceMax === 0) setPriceMax(priceMaxInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let items = PHOTOGRAPHERS.filter((p) => {
      const hay = `${p.name} ${p.city} ${p.desc}`.toLowerCase();
      const matchesText = q ? hay.includes(q.toLowerCase()) : true;
      const matchesPrice = p.priceFrom >= priceMin && p.priceFrom <= priceMax;
      return matchesText && matchesPrice;
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
  }, [q, priceMin, priceMax, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Fotograf</h2>
            <p className="text-stone-600">
              Wybierz swojego fotografa, który zapewni pamiątkę na całe życie!
            </p>
          </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 md:min-w-[520px]">
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Szukaj</label>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="nazwa, miasto, opis..."
                    className="w-full rounded-xl border border-stone-300 px-3 py-2"
                  />
              </div>

              <div>
                <label className="mb-1 block text-xs text-stone-500">Cena min (zł)</label>
                <input
                  type="number"
                  min={priceMinInit}
                  max={priceMax}
                  placeholder="min"
                  onChange={(e) =>
                    setPriceMin(Math.max(priceMinInit, Number(e.target.value) || priceMinInit))
                  }
                  className="w-full rounded-xl border border-stone-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-stone-500">Cena max (zł)</label>
                <input
                  type="number"
                  min={priceMin}
                  max={priceMaxInit}
                  placeholder="max"
                  onChange={(e) =>
                    setPriceMax(Math.min(priceMaxInit, Number(e.target.value) || priceMaxInit))
                  }
                  className="w-full rounded-xl border border-stone-300 px-3 py-2"
                />
              </div>

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

              <div className="hidden lg:block" />
          </div>
      </div>
      <div className="flex items-center justify-between text-sm text-stone-600">
        <span>
          Zakres cen: <strong>{numberFmt(priceMinInit)}–{numberFmt(priceMaxInit)} zł</strong>
        </span>
        <span>
          Znaleziono: <strong>{filtered.length}</strong>
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow border border-stone-200/60 overflow-hidden"
          >
            <img
              src={p.img}
              alt={`${p.name} – portfolio`}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-stone-600">
                {p.city} • od <strong>{numberFmt(p.priceFrom)} zł</strong>
              </div>
              <div className="text-sm text-stone-600 mt-1">Opis: {p.desc}</div>
              <div className="pt-3 flex flex-wrap gap-2">
                <button className={btnSecondary} onClick={() => openDetails(p)}>
                  Szczegóły
                </button>
                <button className={btnSecondary} onClick={() => navigate(`/fotograf/${p.id}`)}>
                  Idź do oferty
                </button>
                <button className={btnPrimary} onClick={() => addToCart(p)}>
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={closeDetails}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selected.img} alt={selected.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-stone-600">
                {selected.city} • od <strong>{numberFmt(selected.priceFrom)} zł</strong>
              </p>
              <p className="text-sm text-stone-600 mt-2">{selected.desc}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button className={btnSecondary} onClick={closeDetails}>Zamknij</button>
                <button className={btnSecondary} onClick={() => navigate(`/fotograf/${selected.id}`)}>
                  Idź do oferty
                </button>
                <button
                  className={btnPrimary}
                  onClick={() => { addToCart(selected); closeDetails(); }}
                >
                  Dodaj do planu
                </button>
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

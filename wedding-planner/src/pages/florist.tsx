import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FLORISTS, type FloristItem } from "@/data/florists";

const CART_KEY = "wp_cart_florists";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "nazwa";

export default function Florist() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary =
    baseBtn + " border border-stone-200 bg-white text-stone-700 hover:bg-stone-50";
  const btnPrimary = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

  const [selected, setSelected] = useState<FloristItem | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function openDetails(item: FloristItem) {
    setSelected(item);
    setOpen(true);
  }
  function closeDetails() {
    setOpen(false);
    setSelected(null);
  }

  function addToCart(item: FloristItem) {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev: FloristItem[] = raw ? JSON.parse(raw) : [];
      const exists = prev.some((x) => x.id === item.id);
      const next = exists ? prev : [...prev, item];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      setToast(exists ? "Już w planie ✨" : `Dodano: ${item.title}`);
      window.dispatchEvent(
        new CustomEvent("wp:cart:update", { detail: { count: next.length, key: CART_KEY } })
      );
    } catch {
      setToast("Ups, nie udało się zapisać 😕");
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const [q, setQ] = useState("");
  const [priceMin, setPriceMin] = useState<number>(() =>
    FLORISTS.reduce((m, f) => Math.min(m, f.priceFrom), Number.POSITIVE_INFINITY)
  );
  const [priceMax, setPriceMax] = useState<number>(() =>
    FLORISTS.reduce((m, f) => Math.max(m, f.priceFrom), 0)
  );
  const [sort, setSort] = useState<SortKey>("rekomendowane");

  const [rangeMin, rangeMax] = useMemo(() => {
    const min = FLORISTS.reduce((m, f) => Math.min(m, f.priceFrom), Number.POSITIVE_INFINITY);
    const max = FLORISTS.reduce((m, f) => Math.max(m, f.priceFrom), 0);
    return [min, max];
  }, []);

  useEffect(() => {
    if (!Number.isFinite(priceMin)) setPriceMin(rangeMin);
    if (!Number.isFinite(priceMax) || priceMax === 0) setPriceMax(rangeMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let items = FLORISTS.filter((f) => {
      const hay = `${f.title} ${f.companyName} ${f.desc}`.toLowerCase();
      const matchesText = q ? hay.includes(q.toLowerCase()) : true;
      const matchesPrice = f.priceFrom >= priceMin && f.priceFrom <= priceMax;
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
        items = items.sort((a, b) => a.title.localeCompare(b.title, "pl"));
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
          <h2 className="text-xl font-semibold">Florysta</h2>
          <p className="text-stone-600">Dekoracje, bukiety, kwiaty i ozdoby. To wszystko znajdziesz tutaj!</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 md:min-w-[520px]">
          <div>
            <label className="mb-1 block text-xs text-stone-500">Szukaj</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="nazwa, firma, opis..."
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Cena min (zł)</label>
            <input
              type="number"
              min={rangeMin}
              max={priceMax}
              placeholder="kwota minimalna"
              onChange={(e) => setPriceMin(Math.max(rangeMin, Number(e.target.value) || rangeMin))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Cena max (zł)</label>
            <input
              type="number"
              min={priceMin}
              max={rangeMax}
              placeholder="kwota maksymalna"
              onChange={(e) => setPriceMax(Math.min(rangeMax, Number(e.target.value) || rangeMax))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Sortowanie</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            >
              <option value="rekomendowane">Rekomendowane</option>
              <option value="cena-rosn">Cena: rosnąco</option>
              <option value="cena-malej">Cena: malejąco</option>
              <option value="nazwa">Nazwa A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-stone-600">
        <span>
          Zakres cen: <strong>{numberFmt(rangeMin)}–{numberFmt(rangeMax)} zł</strong>
        </span>
        <span>
          Znaleziono: <strong>{filtered.length}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow"
          >
            <img src={f.image} alt={f.title} className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-stone-600">
                {f.city} • {f.companyName} • od {numberFmt(f.priceFrom)} zł
              </div>
              <div className="text-sm text-stone-600">Opis: {f.desc}</div>
              <div className="pt-3 flex flex-wrap gap-2">
                <button className={btnSecondary} onClick={() => openDetails(f)}>
                  Szczegóły
                </button>
                <button className={btnSecondary} onClick={() => navigate(`/florysta/${f.id}`)}>
                  Idź do oferty
                </button>
                <button className={btnPrimary} onClick={() => addToCart(f)}>
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
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selected.image} alt={selected.title} className="h-64 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{selected.title}</h3>
              <div className="text-sm text-stone-600">
                {selected.city} • {selected.companyName} • od {numberFmt(selected.priceFrom)} zł
              </div>
              <p className="mt-2 text-sm text-stone-600">{selected.desc}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button className={btnSecondary} onClick={closeDetails}>
                  Zamknij
                </button>
                <button
                  className={btnSecondary}
                  onClick={() => navigate(`/florysta/${selected.id}`)}
                >
                  Idź do oferty
                </button>
                <button
                  className={btnPrimary}
                  onClick={() => {
                    addToCart(selected);
                    closeDetails();
                  }}
                >
                  Dodaj do planu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900 px-4 py-2 text-white shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

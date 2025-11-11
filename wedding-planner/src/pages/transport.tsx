import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRANSPORT, type TransportVendor, CART_KEY_TRANSPORT } from "@/data/transport";

export default function Transport() {
  const navigate = useNavigate();

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary =
    baseBtn + " border border-stone-200 bg-white text-stone-700 hover:bg-stone-50";
  const btnPrimary = baseBtn + " bg-accent-500 text-white hover:bg-accent-600 shadow-sm";

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

  function nf(n: number) { return new Intl.NumberFormat("pl-PL").format(n); }

  type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "miejsca" | "nazwa";

  const [q, setQ] = useState("");
  const [vType] = useState<string>("Wszystkie");
  const [minSeats, setMinSeats] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("rekomendowane");

  const [priceMinInit, priceMaxInit] = useMemo(() => {
    const min = TRANSPORT.reduce((m, v) => Math.min(m, v.priceFrom), Number.POSITIVE_INFINITY);
    const max = TRANSPORT.reduce((m, v) => Math.max(m, v.priceFrom), 0);
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
    let items = TRANSPORT.filter((t) => {
      const hay = `${t.name} ${t.city} ${t.type} ${t.desc}`.toLowerCase();
      const matchesText = q ? hay.includes(q.toLowerCase()) : true;
      const matchesType = vType === "Wszystkie" ? true : t.type === vType;
      const matchesSeats = minSeats > 0 ? (t.capacity ?? 0) >= minSeats : true;
      const matchesPrice = t.priceFrom >= priceMin && t.priceFrom <= priceMax;
      return matchesText && matchesType && matchesSeats && matchesPrice;
    });

    switch (sort) {
      case "cena-rosn":
        items = items.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "cena-malej":
        items = items.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "miejsca":
        items = items.sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0));
        break;
      case "nazwa":
        items = items.sort((a, b) => a.name.localeCompare(b.name, "pl"));
        break;
      default:
        items = items.sort((a, b) => a.priceFrom - b.priceFrom);
    }
    return items;
  }, [q, vType, minSeats, priceMin, priceMax, sort]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow">
        <div className="grid gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <h2 className="text-xl font-semibold">Transport</h2>
            <p className="text-stone-600">Busy dla gości, samochód ślubny, klasyki bądź nowoczesne limuzyny — szeroki wybór!</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:col-span-8 md:grid-cols-5">
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
                <label className="mb-1 block text-xs text-stone-500">Min. liczba miejsc</label>
                <input
                  type="number"
                  min={0}
                  value={minSeats}
                  onChange={(e) => setMinSeats(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="np. 50"
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
                  onChange={(e) => setPriceMin(Math.max(priceMinInit, Number(e.target.value) || priceMinInit))}
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
                  onChange={(e) => setPriceMax(Math.min(priceMaxInit, Number(e.target.value) || priceMaxInit))}
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
                  <option value="miejsca">Liczba miejsc</option>
                  <option value="nazwa">Nazwa A–Z</option>
                </select>
              </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-stone-600">
        <span>Zakres cen: <strong>{nf(priceMinInit)}–{nf(priceMaxInit)} zł</strong></span>
        <span>Znaleziono: <strong>{filtered.length}</strong></span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl shadow border border-stone-200/60 overflow-hidden">
            <img src={t.img} alt={t.name} className="w-full h-40 object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-stone-600">
                {t.city} • {t.type}
                {t.capacity ? <> • {t.capacity} miejsc</> : null} • od{" "}
                <strong>{nf(t.priceFrom)} zł</strong>
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
                <strong>{nf(selected.priceFrom)} zł</strong>
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

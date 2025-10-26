import { useEffect, useMemo, useState } from "react";

type Category =
  | "Sala"
  | "Muzyka"
  | "Foto/Video"
  | "Florystyka"
  | "Transport"
  | "Papeteria"
  | "Dekoracje"
  | "Suknia/Garnitur"
  | "Biżuteria"
  | "Tort/Catering"
  | "Inne";

type BudgetItem = {
  id: string;
  name: string;
  category: Category;
  planned: number;
  actual: number;
  paid: boolean;
  notes?: string;
};

const CATEGORIES: Category[] = [
  "Sala",
  "Muzyka",
  "Foto/Video",
  "Florystyka",
  "Transport",
  "Papeteria",
  "Dekoracje",
  "Suknia/Garnitur",
  "Biżuteria",
  "Tort/Catering",
  "Inne",
];

const LS_KEY = "wp_budget";

const PLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(n) + " zł";

const seed: BudgetItem[] = [
  { id: "b1", name: "Sala weselna", category: "Sala", planned: 30000, actual: 0, paid: false },
  { id: "b2", name: "Muzyka – DJ/Zespół", category: "Muzyka", planned: 6000, actual: 0, paid: false },
  { id: "b3", name: "Fotograf", category: "Foto/Video", planned: 5000, actual: 0, paid: false },
  { id: "b4", name: "Florysta", category: "Florystyka", planned: 3500, actual: 0, paid: false },
  { id: "b5", name: "Papeteria (zaproszenia)", category: "Papeteria", planned: 800, actual: 0, paid: false },
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Budget() {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as BudgetItem[]) : seed;
    } catch {
      return seed;
    }
  });

  const [editing, setEditing] = useState<BudgetItem | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "wszystkie">("wszystkie");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const stats = useMemo(() => {
    const planned = items.reduce((s, i) => s + i.planned, 0);
    const actual = items.reduce((s, i) => s + i.actual, 0);
    const remaining = Math.max(0, planned - actual);
    return { planned, actual, remaining };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const okCat = cat === "wszystkie" ? true : i.category === cat;
      const okQ =
        q.length === 0 ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [items, query, cat]);

  function addEmpty() {
    setEditing({
      id: uid(),
      name: "",
      category: "Inne",
      planned: 0,
      actual: 0,
      paid: false,
      notes: "",
    });
  }

  function save(item: BudgetItem) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      const next = exists ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev];
      return next;
    });
    setEditing(null);
    setToast("Zapisano pozycję");
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setToast("Usunięto pozycję");
  }

  function duplicate(item: BudgetItem) {
    const copy: BudgetItem = { ...item, id: uid(), name: item.name + " (kopia)", paid: false };
    setItems((prev) => [copy, ...prev]);
    setToast("Skopiowano pozycję");
  }

  function togglePaid(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, paid: !p.paid, actual: p.paid ? p.actual : p.planned } : p)));
  }

  function exportCSV() {
    const header = ["id","nazwa","kategoria","plan","rzeczywiste","roznica","oplacone","notatki"];
    const rows = filtered.map((i) => [
      i.id,
      i.name,
      i.category,
      i.planned,
      i.actual,
      i.actual - i.planned,
      i.paid ? 1 : 0,
      i.notes ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budzet.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">Budżet</h2>
          <p className="text-stone-600">Plan vs rzeczywiste koszty, kontrola i eksport.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-2xl text-sm border border-brand-200 bg-brand-200 hover:bg-brand-200" onClick={exportCSV}>
            Eksport CSV
          </button>
          <button className="px-4 py-2 rounded-2xl text-sm text-white bg-accent-600 hover:bg-yellow-700" onClick={addEmpty}>
            Dodaj pozycję
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Plan" value={PLN(stats.planned)} />
        <Stat label="Rzeczywiste" value={PLN(stats.actual)} tone="ok" />
        <Stat label="Pozostało" value={PLN(stats.remaining)} tone="warn" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-stone-500 mb-1">Szukaj</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="nazwa/kategoria…"
              className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <div className="w-full sm:w-60">
            <label className="block text-xs text-stone-500 mb-1">Kategoria</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as Category | "wszystkie")}
              className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            >
              <option value="wszystkie">Wszystkie</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-0 overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-200/60">
                <th className="py-3 px-4">Nazwa</th>
                <th className="py-3 px-4">Kategoria</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Rzeczywiste</th>
                <th className="py-3 px-4">Różnica</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const diff = i.actual - i.planned;
                return (
                  <tr key={i.id} className="border-b border-stone-100">
                    <td className="py-3 px-4">
                      <div className="font-medium">{i.name}</div>
                      {i.notes && <div className="text-xs text-stone-500">{i.notes}</div>}
                    </td>
                    <td className="py-3 px-4">{i.category}</td>
                    <td className="py-3 px-4">{PLN(i.planned)}</td>
                    <td className="py-3 px-4">{PLN(i.actual)}</td>
                    <td className={`py-3 px-4 ${diff > 0 ? "text-rose-600" : diff < 0 ? "text-green-600" : ""}`}>
                      {diff === 0 ? "—" : (diff > 0 ? "+" : "") + PLN(Math.abs(diff)).replace(" zł","")} zł
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePaid(i.id)}
                        className={
                          "px-2.5 py-1 rounded-xl text-xs " +
                          (i.paid
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200")
                        }
                        title="Przełącz: opłacone/nieopłacone"
                      >
                        {i.paid ? "opłacone" : "zaliczka/otwarte"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-xl border border-stone-300 hover:bg-stone-50" onClick={() => setEditing(i)}>
                          Edytuj
                        </button>
                        <button className="px-3 py-1 rounded-xl border border-stone-300 hover:bg-stone-50" onClick={() => duplicate(i)}>
                          Kopiuj
                        </button>
                        <button className="px-3 py-1 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => remove(i.id)}>
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-500">Brak pozycji do wyświetlenia.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4 space-y-3">
          {filtered.map((i) => {
            const diff = i.actual - i.planned;
            return (
              <div key={i.id} className="rounded-2xl border border-stone-200 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-stone-500">{i.category}</div>
                  </div>
                  <button
                    onClick={() => togglePaid(i.id)}
                    className={
                      "px-2.5 py-1 rounded-xl text-xs " +
                      (i.paid
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200")
                    }
                  >
                    {i.paid ? "opłacone" : "otwarte"}
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div><div className="text-stone-500 text-xs">Plan</div><div>{PLN(i.planned)}</div></div>
                  <div><div className="text-stone-500 text-xs">Rzeczywiste</div><div>{PLN(i.actual)}</div></div>
                  <div>
                    <div className="text-stone-500 text-xs">Różnica</div>
                    <div className={`${diff>0?"text-rose-600":diff<0?"text-green-600":""}`}>
                      {diff === 0 ? "—" : (diff > 0 ? "+" : "") + PLN(Math.abs(diff)).replace(" zł","")} zł
                    </div>
                  </div>
                </div>

                {i.notes && <div className="mt-2 text-xs text-stone-600">{i.notes}</div>}

                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 rounded-xl border border-stone-300" onClick={() => setEditing(i)}>Edytuj</button>
                  <button className="px-3 py-1 rounded-xl border border-stone-300" onClick={() => duplicate(i)}>Kopiuj</button>
                  <button className="ml-auto px-3 py-1 rounded-xl border border-rose-200 text-rose-700" onClick={() => remove(i.id)}>Usuń</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center text-stone-500 py-8">Brak pozycji.</div>}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-stone-200/60">
              <div className="text-lg font-semibold">{items.some((x) => x.id === editing.id) ? "Edytuj pozycję" : "Dodaj pozycję"}</div>
            </div>
            <Editor
              value={editing}
              onCancel={() => setEditing(null)}
              onSave={save}
            />
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

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  const toneCls =
    tone === "ok"
      ? "bg-green-50 border-green-200 text-green-900"
      : tone === "warn"
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : "bg-brand-50 border-brand-200 text-stone-900";
  return (
    <div className={`rounded-2xl border p-4 ${toneCls}`}>
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Editor({
  value,
  onSave,
  onCancel,
}: {
  value: BudgetItem;
  onSave: (v: BudgetItem) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BudgetItem>(value);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BudgetItem>(key: K, val: BudgetItem[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Podaj nazwę pozycji.");
    if (form.planned < 0 || form.actual < 0) return setError("Kwoty nie mogą być ujemne.");
    setError(null);
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Nazwa</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            placeholder="np. Sala weselna"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Kategoria</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as Category)}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Plan</label>
          <input
            type="number"
            min={0}
            value={form.planned}
            onChange={(e) => update("planned", Number(e.target.value))}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Rzeczywiste</label>
          <input
            type="number"
            min={0}
            value={form.actual}
            onChange={(e) => update("actual", Number(e.target.value))}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            placeholder="0"
          />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="bg-brand-100 rounded border-stone-300"
              checked={form.paid}
              onChange={(e) => update("paid", e.target.checked)}
            />
            Opłacone
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1">Notatki (opcjonalnie)</label>
        <textarea
          value={form.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
          className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
          rows={3}
          placeholder="np. zaliczka do T-60, faktura proforma"
        />
      </div>

      {error && <div className="text-sm text-rose-600">{error}</div>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-2xl text-sm border border-stone-300 hover:bg-stone-50">
          Anuluj
        </button>
        <button type="submit" className="px-4 py-2 rounded-2xl text-sm bg-accent-500 text-white hover:bg-accent-600">
          Zapisz
        </button>
      </div>
    </form>
  );
}

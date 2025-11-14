import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Wallet, 
  PieChart, 
  CreditCard, 
  Plus, 
  FileDown, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal, 
  Check, 
  X,
  AlertCircle,
  Banknote,
  CheckCircle2
} from "lucide-react";

type Category =
  | "Sala" | "Muzyka" | "Foto/Video" | "Florystyka" | "Transport"
  | "Papeteria" | "Dekoracje" | "Suknia/Garnitur" | "Biżuteria"
  | "Tort/Catering" | "Inne";

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
  "Sala", "Muzyka", "Foto/Video", "Florystyka", "Transport",
  "Papeteria", "Dekoracje", "Suknia/Garnitur", "Biżuteria",
  "Tort/Catering", "Inne",
];

const LS_KEY = "wp_budget";

const PLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(n) + " zł";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const seed: BudgetItem[] = [
  { id: "b1", name: "Sala weselna", category: "Sala", planned: 30000, actual: 0, paid: false },
  { id: "b2", name: "Muzyka – DJ/Zespół", category: "Muzyka", planned: 6000, actual: 0, paid: false },
  { id: "b3", name: "Fotograf", category: "Foto/Video", planned: 5000, actual: 0, paid: false },
];

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

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const stats = useMemo(() => {
    const planned = items.reduce((s, i) => s + i.planned, 0);
    const actual = items.reduce((s, i) => s + i.actual, 0);
    const toPay = items.reduce((sum, item) => {
      if (item.paid) return sum;
      const cost = item.actual > 0 ? item.actual : item.planned;
      return sum + cost;
    }, 0);
    
    const usage = planned > 0 ? Math.round((actual / planned) * 100) : 0;

    return { planned, actual, toPay, usage };
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
      return exists ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev];
    });
    setEditing(null);
    setToast("Zapisano pozycję");
  }

  function remove(id: string) {
    if(!confirm("Czy na pewno chcesz usunąć ten wydatek?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    setToast("Usunięto pozycję");
  }

  function duplicate(item: BudgetItem) {
    const copy: BudgetItem = { ...item, id: uid(), name: item.name + " (kopia)", paid: false };
    setItems((prev) => [copy, ...prev]);
    setToast("Skopiowano pozycję");
  }

  function togglePaid(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, paid: !p.paid } : p)));
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Budzet Weselny", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Plan: ${PLN(stats.planned)}  |  Rzeczywiste: ${PLN(stats.actual)}  |  Do zaplaty: ${PLN(stats.toPay)}`,
      14,
      22
    );

    const tableColumn = ["Nazwa", "Kategoria", "Plan", "Rzeczywiste", "Roznica", "Status", "Notatki"];
    const tableRows = filtered.map((i) => {
      const diff = i.actual - i.planned;
      return [
        i.name,
        i.category,
        PLN(i.planned),
        PLN(i.actual),
        `${diff > 0 ? "+" : ""}${PLN(diff)}`,
        i.paid ? "Oplacone" : "Otwarte",
        i.notes || ""
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [231, 108, 129] },
    });
    doc.save("budzet-weselny.pdf");
  }

  const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors shadow-md shadow-accent-500/20";
  const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium border border-brand-200 bg-white text-stone-700 hover:bg-brand-50 transition-colors";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Budżet</h2>
          <p className="text-stone-500 mt-1">Kontroluj wydatki i planuj koszty wesela.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={exportPDF}>
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <button className={btnPrimary} onClick={addEmpty}>
            <Plus className="h-4 w-4" /> Dodaj pozycję
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Zaplanowano" value={PLN(stats.planned)} icon={<Wallet />} tone="neutral" />
        <StatCard label="Wydano" value={PLN(stats.actual)} icon={<PieChart />} tone="blue" />
        <StatCard label="Do zapłaty" value={PLN(stats.toPay)} icon={<CreditCard />} tone={stats.toPay > 0 ? "orange" : "green"} />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
           <div className="flex flex-col">
             <span className="text-sm font-medium text-stone-700">Wykorzystanie budżetu</span>
             <span className="text-xs text-stone-500">
                {stats.actual > stats.planned ? "Uwaga! Przekroczono budżet." : "Wydatki pod kontrolą."}
             </span>
           </div>
           <span className={`text-xl font-bold ${stats.actual > stats.planned ? "text-rose-600" : "text-stone-900"}`}>{stats.usage}%</span>
        </div>
        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
           <div 
             className={`h-full transition-all duration-1000 ${stats.actual > stats.planned ? "bg-rose-500" : "bg-gradient-to-r from-accent-400 to-accent-600"}`}
             style={{ width: `${Math.min(stats.usage, 100)}%` }}
           />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-1 shadow-sm flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj wydatku..."
            className="w-full bg-transparent pl-9 pr-4 py-3 text-sm outline-none text-stone-700 placeholder:text-stone-400"
          />
        </div>
        <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>
        <div className="w-full sm:w-auto px-2 sm:px-0 pb-2 sm:pb-0">
           <Select
              value={cat}
              onChange={(v) => setCat(v as Category | "wszystkie")}
              options={[{ value: "wszystkie", label: "Kategoria: Wszystkie" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
              className="bg-white min-w-[200px]"
            />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/50 text-stone-500">
              <tr>
                <th className="py-3 px-6 font-medium">Nazwa / Kategoria</th>
                <th className="py-3 px-4 font-medium">Plan</th>
                <th className="py-3 px-4 font-medium">Rzeczywiste</th>
                <th className="py-3 px-4 font-medium">Różnica</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-6 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((i) => {
                const diff = i.actual - i.planned;
                const isOverBudget = diff > 0;
                const isSaving = diff < 0 && i.paid;

                return (
                  <tr key={i.id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-6 align-top">
                      <div className="font-medium text-stone-900">{i.name}</div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                         <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">{i.category}</span>
                         {i.notes && <span className="truncate max-w-[150px] italic opacity-70">— {i.notes}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-medium align-middle">{PLN(i.planned)}</td>
                    <td className="py-3 px-4 font-bold text-stone-800 align-middle">{PLN(i.actual)}</td>
                    <td className="py-3 px-4 align-middle">
                       <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                          isOverBudget ? "text-rose-700 bg-rose-50" : isSaving ? "text-green-700 bg-green-50" : "text-stone-500 bg-stone-100"
                       }`}>
                          {isOverBudget ? <TrendingUp className="h-3 w-3" /> : isSaving ? <TrendingDown className="h-3 w-3" /> : null}
                          {diff === 0 ? "—" : (diff > 0 ? "+" : "") + PLN(Math.abs(diff))}
                       </div>
                    </td>
                    <td className="py-3 px-4 text-center align-middle">
                      <button
                        onClick={() => togglePaid(i.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          i.paid 
                            ? "bg-green-100 text-green-800 ring-1 ring-green-200 hover:bg-green-200" 
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {i.paid ? <><Check className="h-3 w-3"/> Opłacone</> : <><Banknote className="h-3 w-3"/> Do zapłaty</>}
                      </button>
                    </td>
                    <td className="py-3 px-6 align-middle text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Banknote className="h-4 w-4" />} onClick={() => duplicate(i)} label="Kopiuj" />
                        <ActionButton icon={<MoreHorizontal className="h-4 w-4" />} onClick={() => setEditing(i)} label="Edytuj" />
                        <ActionButton icon={<X className="h-4 w-4" />} onClick={() => remove(i.id)} label="Usuń" danger />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-stone-500">
                    <div className="flex flex-col items-center gap-2">
                       <div className="bg-stone-50 p-3 rounded-full">
                          <Search className="h-6 w-6 text-stone-300" />
                       </div>
                       <p>Brak pozycji spełniających kryteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4 space-y-3">
          {filtered.map((i) => {
             const diff = i.actual - i.planned;
             const isOverBudget = diff > 0;
             return (
              <div key={i.id} className="rounded-2xl border border-stone-200 p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <div className="font-semibold text-stone-900">{i.name}</div>
                      <div className="text-xs text-stone-500 uppercase tracking-wide mt-1">{i.category}</div>
                   </div>
                   <button
                        onClick={() => togglePaid(i.id)}
                        className={`p-2 rounded-full transition-colors ${i.paid ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-400"}`}
                      >
                        <Check className="h-4 w-4" />
                   </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                   <div className="bg-stone-50 p-2 rounded-xl">
                      <div className="text-[10px] text-stone-500 uppercase">Plan</div>
                      <div className="font-medium">{PLN(i.planned)}</div>
                   </div>
                   <div className="bg-stone-50 p-2 rounded-xl">
                      <div className="text-[10px] text-stone-500 uppercase">Faktura</div>
                      <div className="font-medium">{PLN(i.actual)}</div>
                   </div>
                   <div className={`p-2 rounded-xl ${isOverBudget ? "bg-rose-50 text-rose-700" : "bg-stone-50 text-stone-600"}`}>
                      <div className="text-[10px] opacity-70 uppercase">Różnica</div>
                      <div className="font-medium">{diff > 0 ? "+" : ""}{PLN(diff)}</div>
                   </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
                   <button onClick={() => setEditing(i)} className="text-xs font-medium px-3 py-1.5 bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200">Edytuj</button>
                   <button onClick={() => remove(i.id)} className="text-xs font-medium px-3 py-1.5 bg-rose-50 rounded-lg text-rose-600 hover:bg-rose-100">Usuń</button>
                </div>
              </div>
             )
          })}
          {filtered.length === 0 && (
             <div className="text-center text-stone-500 py-8">Brak pozycji.</div>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="text-lg font-bold text-stone-800">
                {items.some((x) => x.id === editing.id) ? "Edytuj wydatek" : "Nowy wydatek"}
              </div>
              <button onClick={() => setEditing(null)} className="text-stone-400 hover:text-stone-600">Anuluj</button>
            </div>
            <Editor value={editing} onCancel={() => setEditing(null)} onSave={save} />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-stone-900/90 backdrop-blur text-white px-5 py-3 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: "neutral" | "blue" | "green" | "orange" }) {
  const styles = {
    neutral: "bg-white text-stone-600 border-stone-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className={`rounded-3xl border p-5 flex items-center gap-4 ${styles[tone]} transition-all hover:shadow-sm`}>
       <div className="p-3 bg-white/60 rounded-2xl shadow-sm">
          <div className="h-6 w-6 flex items-center justify-center">{icon}</div>
       </div>
       <div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-xs font-medium opacity-80 uppercase tracking-wide">{label}</div>
       </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className="relative min-w-[140px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border border-stone-200 px-4 py-2 pr-8 text-sm font-medium text-stone-600 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 ${className ?? ""}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
         <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
      </div>
    </div>
  );
}

function ActionButton({ icon, onClick, label, danger }: { icon: React.ReactNode, onClick: () => void, label: string, danger?: boolean }) {
   return (
     <button 
       onClick={onClick} 
       title={label}
       className={`p-2 rounded-xl transition-colors ${danger ? "text-stone-400 hover:text-rose-600 hover:bg-rose-50" : "text-stone-400 hover:text-accent-600 hover:bg-accent-50"}`}
     >
        {icon}
     </button>
   )
}

function Editor({ value, onSave, onCancel }: { value: BudgetItem; onSave: (v: BudgetItem) => void; onCancel: () => void }) {
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
    <form onSubmit={submit} className="p-6 space-y-5">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5">Nazwa wydatku</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
            placeholder="np. Zaliczka za salę"
            autoFocus
          />
        </div>
        
        <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Kategoria</label>
            <div className="relative">
                <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as Category)}
                className="w-full appearance-none rounded-xl border border-stone-200 px-4 py-3 bg-white text-stone-700 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                >
                {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                   <MoreHorizontal className="h-4 w-4" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Planowana kwota</label>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    value={form.planned}
                    onChange={(e) => update("planned", Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-200 pl-4 pr-8 py-3 text-stone-800 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                    placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium">PLN</span>
            </div>
           </div>
           <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Kwota z faktury</label>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    value={form.actual}
                    onChange={(e) => update("actual", Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-200 pl-4 pr-8 py-3 text-stone-800 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                    placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium">PLN</span>
            </div>
           </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors hover:bg-stone-100" onClick={() => update("paid", !form.paid)}>
           <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${form.paid ? "bg-green-500 border-green-500" : "bg-white border-stone-300"}`}>
                 {form.paid && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm font-medium text-stone-700">Oznacz jako opłacone</span>
           </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5">Notatki</label>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all min-h-[80px]"
            placeholder="Numer faktury, termin płatności..."
          />
        </div>
      </div>

      {error && <div className="text-sm text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="h-4 w-4"/> {error}</div>}

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
        >
          Anuluj
        </button>
        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 transition-all transform active:scale-95">
          Zapisz
        </button>
      </div>
    </form>
  );
}
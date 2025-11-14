import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  ListTodo, 
  Circle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  FileDown, 
  Search, 
  MoreHorizontal, 
  X, 
  AlertCircle, 
  Calendar as CalendarIcon,
  Flag,
  Check
} from "lucide-react";

type Status = "todo" | "doing" | "done";
type Priority = "low" | "normal" | "high";
type Category =
  | "Sala" | "Muzyka" | "Fotograf" | "Florysta" | "Goście" 
  | "Budżet" | "Papeteria" | "Transport" | "Dekoracje" | "Inne";

type Task = {
  id: string;
  label: string;
  status: Status;
  priority: Priority;
  category: Category;
  due?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const CATEGORIES: Category[] = [
  "Sala", "Muzyka", "Fotograf", "Florysta", "Goście", 
  "Budżet", "Papeteria", "Transport", "Dekoracje", "Inne",
];

const LS_KEY = "wp_tasks";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function addDaysISO(startISO: string, days: number) {
  const d = new Date(startISO);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

const priorityMap: Record<Priority, string> = {
  high: "Wysoki",
  normal: "Normalny",
  low: "Niski",
};

const statusMap: Record<Status, string> = {
  todo: "Do zrobienia",
  doing: "W toku",
  done: "Gotowe",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as Task[];
    } catch (err) {
      console.warn("Failed to read tasks from localStorage:", err);
    }
    const now = new Date().toISOString();
    return [
      { id: uid(), label: "Rezerwacja sali", status: "done", priority: "high", category: "Sala", due: addDaysISO(todayISO(), -5), createdAt: now, updatedAt: now },
      { id: uid(), label: "Wybrać fotografa", status: "todo", priority: "normal", category: "Fotograf", due: addDaysISO(todayISO(), 10), createdAt: now, updatedAt: now },
      { id: uid(), label: "Ustalić menu", status: "doing", priority: "normal", category: "Sala", due: addDaysISO(todayISO(), 20), createdAt: now, updatedAt: now },
    ];
  });

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "wszyscy">("wszyscy");
  const [catFilter, setCatFilter] = useState<Category | "wszystkie">("wszystkie");
  const [prioFilter, setPrioFilter] = useState<Priority | "wszystkie">("wszystkie");
  const [editing, setEditing] = useState<Task | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const doing = tasks.filter((t) => t.status === "doing").length;
    const todo = total - done - doing;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, doing, todo, progress };
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const okStatus = statusFilter === "wszyscy" ? true : t.status === statusFilter;
      const okCat = catFilter === "wszystkie" ? true : t.category === catFilter;
      const okPrio = prioFilter === "wszystkie" ? true : t.priority === prioFilter;
      const okQuery =
        q.length === 0 ||
        t.label.toLowerCase().includes(q) ||
        (t.notes ?? "").toLowerCase().includes(q);
      return okStatus && okCat && okPrio && okQuery;
    });
  }, [tasks, query, statusFilter, catFilter, prioFilter]);

  const groups = useMemo(() => {
    const today = todayISO();
    const weekEnd = addDaysISO(today, 7);
    const buckets: Record<string, Task[]> = {
      "Zaległe": [],
      "Dziś": [],
      "Tydzień": [],
      "Później": [],
      "Bez terminu": [],
    };
    for (const t of filtered) {
      if (!t.due) buckets["Bez terminu"].push(t);
      else if (t.due < today) buckets["Zaległe"].push(t);
      else if (t.due === today) buckets["Dziś"].push(t);
      else if (t.due <= weekEnd) buckets["Tydzień"].push(t);
      else buckets["Później"].push(t);
    }
    return buckets;
  }, [filtered]);

  function addQuick(label: string, category: Category) {
    const now = new Date().toISOString();
    setTasks((prev) => [
      {
        id: uid(),
        label,
        status: "todo",
        priority: "normal",
        category,
        due: null,
        createdAt: now,
        updatedAt: now,
      },
      ...prev,
    ]);
    setToast("Dodano zadanie: " + label);
  }

  function save(task: Task) {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists
        ? prev.map((t) => (t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t))
        : [{ ...task, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
    });
    setEditing(null);
    setToast("Zapisano zadanie");
  }

  function remove(id: string) {
    if(!confirm("Czy na pewno chcesz usunąć to zadanie?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setToast("Usunięto zadanie");
  }

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "done" ? "todo" : "done",
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lista Zadan - Planer Weselny", 14, 15);
    doc.setFontSize(10);
    doc.text(`Postep: ${stats.progress}% ukonczonych zadan.`, 14, 22);

    const tableColumn = ["Zadanie", "Kategoria", "Priorytet", "Termin", "Status", "Notatki"];
    const tableRows = filtered.map((t) => [
      t.label,
      t.category,
      priorityMap[t.priority],
      t.due ? formatPL(t.due) : "-",
      statusMap[t.status],
      t.notes || ""
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [231, 108, 129] },
    });
    doc.save("zadania-weselne.pdf");
  }

  const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors shadow-md shadow-accent-500/20";
  const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium border border-brand-200 bg-white text-stone-700 hover:bg-brand-50 transition-colors";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Zadania</h2>
          <p className="text-stone-500 mt-1">Zarządzaj listą rzeczy do zrobienia przed wielkim dniem.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={exportPDF}>
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <button className={btnPrimary} onClick={() => setEditing(makeEmptyTask())}>
            <Plus className="h-4 w-4" /> Dodaj zadanie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<ListTodo />} label="Wszystkie" value={String(stats.total)} tone="neutral" />
        <StatCard icon={<Circle />} label="Do zrobienia" value={String(stats.todo)} tone="neutral" />
        <StatCard icon={<Clock />} label="W toku" value={String(stats.doing)} tone="blue" />
        <StatCard icon={<CheckCircle2 />} label="Gotowe" value={String(stats.done)} tone="green" />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
             <span className="text-sm font-medium text-stone-700">Postęp organizacji</span>
             <span className="text-xs text-stone-500">
               {stats.progress === 100 ? "Wszystko gotowe! Gratulacje! 🎉" : 
                stats.progress > 70 ? "Już z górki! Oby tak dalej." : "Przed Tobą jeszcze trochę pracy."}
             </span>
          </div>
          <span className="text-xl font-bold text-accent-600">{stats.progress}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-400 to-accent-600 transition-all duration-1000 ease-out" 
            style={{ width: `${stats.progress}%` }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-1 shadow-sm flex flex-col lg:flex-row gap-2 items-center">
         <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj zadania..."
              className="w-full bg-transparent pl-9 pr-4 py-3 text-sm outline-none text-stone-700 placeholder:text-stone-400"
            />
         </div>
         
         <div className="h-8 w-px bg-stone-200 hidden lg:block"></div>

         <div className="flex gap-2 w-full lg:w-auto px-2 lg:px-0 pb-2 lg:pb-0 overflow-x-auto">
            <Select
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as Status | "wszyscy")}
              options={[
                { value: "wszyscy", label: "Status: Wszyscy" },
                { value: "todo", label: "Do zrobienia" },
                { value: "doing", label: "W toku" },
                { value: "done", label: "Gotowe" },
              ]}
              className="bg-white min-w-[160px]"
            />
            <Select
              value={catFilter}
              onChange={(v) => setCatFilter(v as Category | "wszystkie")}
              options={[{ value: "wszystkie", label: "Kategoria: Wszystkie" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
              className="bg-white min-w-[180px]"
            />
            <Select
              value={prioFilter}
              onChange={(v) => setPrioFilter(v as Priority | "wszystkie")}
              options={[
                { value: "wszystkie", label: "Priorytet" },
                { value: "high", label: "Wysoki" },
                { value: "normal", label: "Normalny" },
                { value: "low", label: "Niski" },
              ]}
              className="bg-white min-w-[140px]"
            />
         </div>
      </div>

      {statusFilter === "wszyscy" && query === "" && (
          <div className="flex flex-wrap gap-2 px-1">
             <span className="inline-flex items-center text-xs font-medium text-stone-500 mr-1">Szybki start:</span>
            <QuickChip onClick={() => addQuick("Potwierdzić godziny i menu", "Sala")} label="Sala" />
            <QuickChip onClick={() => addQuick("Wysłać brief muzyczny", "Muzyka")} label="Muzyka" />
            <QuickChip onClick={() => addQuick("Lista ujęć must-have", "Fotograf")} label="Fotograf" />
          </div>
      )}

      {Object.entries(groups).map(([title, list]) => (
           list.length > 0 && (
            <section key={title} className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-stone-800 uppercase tracking-wider pl-1 mt-4">
                 {title} <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs">{list.length}</span>
              </h3>

              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="hidden md:block">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50/50 text-stone-500">
                      <tr>
                        <th className="py-3 px-6 font-medium w-10"></th>
                        <th className="py-3 px-4 font-medium">Zadanie</th>
                        <th className="py-3 px-4 font-medium">Kategoria</th>
                        <th className="py-3 px-4 font-medium">Priorytet</th>
                        <th className="py-3 px-4 font-medium">Termin</th>
                        <th className="py-3 px-4 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {list.map((t) => (
                        <tr key={t.id} className={`group transition-colors hover:bg-stone-50/50 ${t.status === "done" ? "bg-stone-50/30" : ""}`}>
                          <td className="py-3 pl-6 w-10 align-middle">
                            <div 
                                onClick={() => toggleDone(t.id)} 
                                className={`w-5 h-5 rounded-full border cursor-pointer flex items-center justify-center transition-all ${t.status === "done" ? "bg-green-500 border-green-500" : "bg-white border-stone-300 hover:border-accent-500"}`}
                            >
                                {t.status === "done" && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </td>
                          <td className="py-3 px-4 align-middle">
                             <div className={`font-medium text-base transition-all ${t.status === "done" ? "line-through text-stone-400" : "text-stone-800"}`}>
                               {t.label}
                             </div>
                             {t.notes && <div className="text-xs text-stone-500 mt-1 line-clamp-1">{t.notes}</div>}
                          </td>
                          <td className="py-3 px-4 align-middle">
                             <span className="bg-stone-100 px-2 py-1 rounded-lg text-xs font-medium text-stone-600">{t.category}</span>
                          </td>
                          <td className="py-3 px-4 align-middle"><PriorityBadge p={t.priority} /></td>
                          <td className="py-3 px-4 align-middle"><DueBadge due={t.due} /></td>
                          <td className="py-3 px-4 align-middle text-right">
                            <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <ActionButton icon={<MoreHorizontal className="h-4 w-4" />} onClick={() => setEditing(t)} label="Edytuj" />
                              <ActionButton icon={<X className="h-4 w-4" />} onClick={() => remove(t.id)} label="Usuń" danger />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden p-4 space-y-3">
                  {list.map((t) => (
                    <div key={t.id} className={`rounded-2xl border p-4 bg-white shadow-sm ${t.status === "done" ? "border-stone-100 opacity-70" : "border-stone-200"}`}>
                       <div className="flex items-start gap-3">
                          <div 
                                onClick={() => toggleDone(t.id)} 
                                className={`mt-1 w-5 h-5 rounded-full border cursor-pointer flex-shrink-0 flex items-center justify-center transition-all ${t.status === "done" ? "bg-green-500 border-green-500" : "bg-white border-stone-300"}`}
                            >
                                {t.status === "done" && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                             <div className={`font-medium text-stone-900 ${t.status === "done" ? "line-through text-stone-400" : ""}`}>{t.label}</div>
                             <div className="text-xs text-stone-500 mt-1">{t.category}</div>
                             
                             <div className="flex flex-wrap gap-2 mt-3">
                                <PriorityBadge p={t.priority} inline />
                                {t.due && <DueBadge due={t.due} inline />}
                             </div>
                          </div>
                       </div>
                       <div className="flex justify-end gap-2 border-t border-stone-100 pt-3 mt-3">
                          <button onClick={() => setEditing(t)} className="text-xs font-medium px-3 py-1.5 bg-stone-100 rounded-lg text-stone-600">Edytuj</button>
                          <button onClick={() => remove(t.id)} className="text-xs font-medium px-3 py-1.5 bg-rose-50 rounded-lg text-rose-600">Usuń</button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
           )
      ))}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-300">
           <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Search className="h-8 w-8 text-stone-300" />
           </div>
           <h3 className="text-lg font-medium text-stone-900">Brak zadań</h3>
           <p className="text-stone-500 max-w-xs mt-1 mb-6">Nie znaleźliśmy zadań pasujących do Twoich filtrów lub lista jest pusta.</p>
           <button className={btnPrimary} onClick={() => setEditing(makeEmptyTask())}>
              Dodaj pierwsze zadanie
           </button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="text-lg font-bold text-stone-800">
                {tasks.some((x) => x.id === editing.id) ? "Edytuj zadanie" : "Nowe zadanie"}
              </div>
              <button onClick={() => setEditing(null)} className="text-stone-400 hover:text-stone-600">Anuluj</button>
            </div>
            <TaskEditor value={editing} onCancel={() => setEditing(null)} onSave={save} />
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


function makeEmptyTask(): Task {
  const now = new Date().toISOString();
  return {
    id: uid(),
    label: "",
    status: "todo",
    priority: "normal",
    category: "Inne",
    due: null,
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
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
         <MoreHorizontal className="h-4 w-4" />
      </div>
    </div>
  );
}

function PriorityBadge({ p, inline }: { p: Priority; inline?: boolean }) {
  const map = {
    high: "bg-rose-100 text-rose-700 border-rose-200",
    normal: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-green-50 text-green-700 border-green-200",
  } as const;
  const labels = { high: "Wysoki", normal: "Normalny", low: "Niski" } as const;
  return (
    <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-medium ${map[p]} ${inline ? "" : "inline-flex"}`}>
      {labels[p]}
    </span>
  );
}

function DueBadge({ due, inline }: { due?: string | null; inline?: boolean }) {
  if (!due) return <span className={`text-xs text-stone-400 ${inline ? "" : "inline-block"}`}>—</span>;
  const today = todayISO();
  let cls = "text-stone-600 bg-stone-100";
  let icon = null;

  if (due < today) {
     cls = "text-rose-700 bg-rose-50 border border-rose-200";
     icon = <AlertCircle className="h-3 w-3 mr-1" />;
  }
  else if (due === today) cls = "text-amber-700 bg-amber-50 border border-amber-200";
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${cls} ${inline ? "" : ""}`}>
      {icon} {formatPL(due)}
    </span>
  );
}

function formatPL(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

function QuickChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-brand-300 bg-brand-50 text-stone-600 hover:bg-brand-100 hover:border-brand-400 hover:text-accent-700 text-xs transition-colors"
    >
      <Plus className="h-3 w-3" /> {label}
    </button>
  );
}

function TaskEditor({
  value,
  onSave,
  onCancel,
}: {
  value: Task;
  onSave: (t: Task) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Task>(value);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Task>(key: K, val: Task[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim()) return setError("Podaj nazwę zadania.");
    setError(null);
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5">Co jest do zrobienia?</label>
          <input
            value={form.label}
            onChange={(e) => update("label", e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
            placeholder="np. Zamówić tort weselny"
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Kategoria</label>
            <div className="relative">
                <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as Category)}
                className="w-full appearance-none rounded-xl border border-stone-200 px-4 py-2.5 bg-white text-stone-700 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
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
           <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Termin</label>
            <div className="relative">
                <input
                    type="date"
                    value={form.due ?? ""}
                    onChange={(e) => update("due", e.target.value || null)}
                    className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-700 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                   <CalendarIcon className="h-4 w-4" />
                </div>
            </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Priorytet</label>
                <div className="flex bg-stone-100 rounded-xl p-1">
                    {(["low", "normal", "high"] as const).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => update("priority", p)}
                            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                                form.priority === p 
                                ? "bg-white text-stone-900 shadow-sm" 
                                : "text-stone-500 hover:text-stone-700"
                            }`}
                        >
                            {p === "high" && <Flag className="h-3 w-3" />} {priorityMap[p]}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Status</label>
                <div className="flex bg-stone-100 rounded-xl p-1">
                    {(["todo", "doing", "done"] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => update("status", s)}
                            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                                form.status === s 
                                ? "bg-white text-stone-900 shadow-sm" 
                                : "text-stone-500 hover:text-stone-700"
                            }`}
                        >
                            {s === "todo" ? "Start" : s === "doing" ? "W toku" : "Koniec"}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5">Dodatkowe notatki</label>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all min-h-[80px]"
            placeholder="Szczegóły, telefony, adresy..."
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
          Zapisz zmiany
        </button>
      </div>
    </form>
  );
}
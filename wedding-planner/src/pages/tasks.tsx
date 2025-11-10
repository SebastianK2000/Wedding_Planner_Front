import { useEffect, useMemo, useState } from "react";

type Status = "todo" | "doing" | "done";
type Priority = "low" | "normal" | "high";
type Category =
  | "Sala"
  | "Muzyka"
  | "Fotograf"
  | "Florysta"
  | "Goście"
  | "Budżet"
  | "Papeteria"
  | "Transport"
  | "Dekoracje"
  | "Inne";

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
  "Sala",
  "Muzyka",
  "Fotograf",
  "Florysta",
  "Goście",
  "Budżet",
  "Papeteria",
  "Transport",
  "Dekoracje",
  "Inne",
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

const TEMPLATES: Task[] = [
  { id: uid(), label: "Potwierdzić rezerwację sali i zaliczkę", status: "todo", priority: "high", category: "Sala", due: addDaysISO(todayISO(), 7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uid(), label: "Podpisanie umowy z fotografem", status: "todo", priority: "normal", category: "Fotograf", due: addDaysISO(todayISO(), 10), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uid(), label: "Playlista ‚must/never’ dla DJ/Zespołu", status: "todo", priority: "low", category: "Muzyka", due: addDaysISO(todayISO(), 21), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uid(), label: "Wybór bukietu i dekoracji stołów", status: "todo", priority: "normal", category: "Florysta", due: addDaysISO(todayISO(), 30), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uid(), label: "Rozesłać zaproszenia (RSVP T-60)", status: "todo", priority: "high", category: "Papeteria", due: addDaysISO(todayISO(), 45), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uid(), label: "Lista gości – weryfikacja diet", status: "todo", priority: "normal", category: "Goście", due: addDaysISO(todayISO(), 14), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uid(), label: "Transport gości – wstępne trasy", status: "todo", priority: "low", category: "Transport", due: addDaysISO(todayISO(), 25), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

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
    setToast("Dodano zadanie");
  }

  function save(task: Task) {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      const next = exists
        ? prev.map((t) => (t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t))
        : [{ ...task, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
      return next;
    });
    setEditing(null);
    setToast("Zapisano zadanie");
  }

  function remove(id: string) {
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

  function exportCSV() {
    const header = ["id","label","status","priority","category","due","notes","createdAt","updatedAt"];
    const rows = filtered.map((t) => [
      t.id, t.label, t.status, t.priority, t.category, t.due ?? "", t.notes ?? "", t.createdAt, t.updatedAt
    ]);
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "zadania.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function loadTemplates() {
    setTasks((prev) => [...TEMPLATES.map(t => ({ ...t, id: uid() })), ...prev]);
    setToast("Dodano szablony zadań");
  }

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnPrimary = baseBtn + " bg-accent-500 text-white hover:bg-accent-600";
  const btnSecondary = baseBtn + " border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">Zadania</h2>
          <p className="text-stone-600">Planer weselny: statusy, terminy i priorytety.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={loadTemplates}>Szablony</button>
          <button className={btnSecondary} onClick={exportCSV}>Eksport CSV</button>
          <button className={btnPrimary} onClick={() => setEditing(makeEmptyTask())}>Dodaj zadanie</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Stat label="Wszystkie" value={String(stats.total)} />
        <Stat label="Do zrobienia" value={String(stats.todo)} />
        <Stat label="W toku" value={String(stats.doing)} />
        <Stat label="Gotowe" value={String(stats.done)} tone="ok" />
      </div>
      <Progress value={stats.progress} />

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-stone-500 mb-1">Szukaj</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="nazwa/notatki…"
              className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as Status | "wszyscy")}
            options={[
              { value: "wszyscy", label: "Wszyscy" },
              { value: "todo", label: "Do zrobienia" },
              { value: "doing", label: "W toku" },
              { value: "done", label: "Gotowe" },
            ]}
            className="bg-brand-100 text-stone-600 border-stone-300"
          />
          <Select
            label="Kategoria"
            value={catFilter}
            onChange={(v) => setCatFilter(v as Category | "wszystkie")}
            options={[{ value: "wszystkie", label: "Wszystkie" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
            className="bg-brand-100 text-stone-600 border-stone-300"
          />
          <Select
            label="Priorytet"
            value={prioFilter}
            onChange={(v) => setPrioFilter(v as Priority | "wszystkie")}
            options={[
              { value: "wszystkie", label: "Wszystkie" },
              { value: "high", label: "Wysoki" },
              { value: "normal", label: "Normalny" },
              { value: "low", label: "Niski" },
            ]}
            className="bg-brand-100 text-stone-600 border-stone-300"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="text-sm text-stone-600 mb-3">Szybkie dodawanie</div>
        <div className="flex flex-wrap gap-2">
          <QuickChip onClick={() => addQuick("Potwierdzić godziny i menu", "Sala")} label="Sala" />
          <QuickChip onClick={() => addQuick("Wysłać brief muzyczny do DJ", "Muzyka")} label="Muzyka" />
          <QuickChip onClick={() => addQuick("Lista ujęć must-have", "Fotograf")} label="Fotograf" />
          <QuickChip onClick={() => addQuick("Dobór kwiatów sezonowych", "Florysta")} label="Florysta" />
          <QuickChip onClick={() => addQuick("Zebrać preferencje diet", "Goście")} label="Goście" />
          <QuickChip onClick={() => addQuick("Sprawdzić zaliczki/faktury", "Budżet")} label="Budżet" />
        </div>
      </div>

      {Object.entries(groups).map(([title, list]) => (
        <section key={title} className="space-y-2">
          <h3 className="text-sm font-semibold text-stone-700">{title} <span className="text-stone-400">({list.length})</span></h3>

          <div className="hidden md:block bg-white rounded-2xl shadow border border-stone-200/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200/60">
                  <th className="py-3 px-4">Zadanie</th>
                  <th className="py-3 px-4">Kategoria</th>
                  <th className="py-3 px-4">Priorytet</th>
                  <th className="py-3 px-4">Termin</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id} className="border-b border-stone-100">
                    <td className="py-3 px-4">
                      <label className="inline-flex items-start gap-2">
                        <input type="checkbox" className="mt-1" checked={t.status === "done"} onChange={() => toggleDone(t.id)} />
                        <div>
                          <div className={`font-medium ${t.status === "done" ? "line-through text-stone-400" : ""}`}>{t.label}</div>
                          {t.notes && <div className="text-xs text-stone-500">{t.notes}</div>}
                        </div>
                      </label>
                    </td>
                    <td className="py-3 px-4">{t.category}</td>
                    <td className="py-3 px-4"><PriorityBadge p={t.priority} /></td>
                    <td className="py-3 px-4"><DueBadge due={t.due} /></td>
                    <td className="py-3 px-4"><StatusBadge s={t.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <button className="px-3 py-1 rounded-xl border border-stone-300 hover:bg-stone-50" onClick={() => setEditing(t)}>Edytuj</button>
                        <button className="px-3 py-1 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => remove(t.id)}>Usuń</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-center text-stone-500">Brak zadań.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid gap-2">
            {list.map((t) => (
              <div key={t.id} className="rounded-2xl border border-stone-200 bg-white p-3">
                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" checked={t.status === "done"} onChange={() => toggleDone(t.id)} />
                  <div className="flex-1">
                    <div className={`font-medium ${t.status === "done" ? "line-through text-stone-400" : ""}`}>{t.label}</div>
                    <div className="text-xs text-stone-600 flex flex-wrap gap-2 mt-1">
                      <span>{t.category}</span> • <PriorityBadge p={t.priority} inline />
                      {t.due && <> • <DueBadge due={t.due} inline /></>}
                    </div>
                    {t.notes && <div className="text-xs text-stone-500 mt-1">{t.notes}</div>}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-1 rounded-xl border border-stone-300" onClick={() => setEditing(t)}>Edytuj</button>
                  <button className="ml-auto px-3 py-1 rounded-xl border border-rose-200 text-rose-700" onClick={() => remove(t.id)}>Usuń</button>
                </div>
              </div>
            ))}
            {list.length === 0 && <div className="text-center text-stone-500 py-4">Brak zadań.</div>}
          </div>
        </section>
      ))}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-stone-200/60">
              <div className="text-lg font-semibold">
                {tasks.some((x) => x.id === editing.id) ? "Edytuj zadanie" : "Dodaj zadanie"}
              </div>
            </div>
            <TaskEditor value={editing} onCancel={() => setEditing(null)} onSave={save} />
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

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" }) {
  const cls = tone
    ? "bg-green-50 border-green-200 text-green-900"
    : "bg-brand-50 border-brand-200 text-stone-900";
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
      <div className="flex items-center justify-between text-sm mb-2">
        <div className="text-stone-600">Postęp</div>
        <div className="font-medium">{value}%</div>
      </div>
      <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
        <div className="h-full bg-accent-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className="w-full lg:w-56">
      <label className="block text-xs text-stone-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-stone-300 px-3 py-2 ${className ?? ""}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PriorityBadge({ p, inline }: { p: Priority; inline?: boolean }) {
  const map = {
    high: "bg-rose-100 text-rose-700 border-rose-200",
    normal: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  } as const;
  const labels = { high: "Wysoki", normal: "Normalny", low: "Niski" } as const;
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs ${map[p]} ${inline ? "" : "inline-block"}`}>
      {labels[p]}
    </span>
  );
}

function StatusBadge({ s }: { s: Status }) {
  const map = {
    todo: "bg-stone-100 text-stone-700 border-stone-200",
    doing: "bg-blue-100 text-blue-700 border-blue-200",
    done: "bg-green-100 text-green-700 border-green-200",
  } as const;
  const labels = { todo: "Do zrobienia", doing: "W toku", done: "Gotowe" } as const;
  return <span className={`px-2 py-0.5 rounded-full border text-xs ${map[s]}`}>{labels[s]}</span>;
}

function DueBadge({ due, inline }: { due?: string | null; inline?: boolean }) {
  if (!due) return <span className={`text-xs text-stone-500 ${inline ? "" : "inline-block"}`}>—</span>;
  const today = todayISO();
  let cls = "bg-stone-100 text-stone-700 border-stone-200";
  if (due < today) cls = "bg-rose-100 text-rose-700 border-rose-200";
  else if (due === today) cls = "bg-amber-100 text-amber-800 border-amber-200";
  else cls = "bg-green-100 text-green-700 border-green-200";
  return <span className={`px-2 py-0.5 rounded-full border text-xs ${cls} ${inline ? "" : "inline-block"}`}>{formatPL(due)}</span>;
}

function formatPL(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

function QuickChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-xl border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200 text-sm"
    >
      {label}
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
    <form onSubmit={submit} className="p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Zadanie</label>
          <input
            value={form.label}
            onChange={(e) => update("label", e.target.value)}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            placeholder="np. Zamówić tort"
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
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Priorytet</label>
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value as Priority)}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
          >
            <option value="high">Wysoki</option>
            <option value="normal">Normalny</option>
            <option value="low">Niski</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as Status)}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
          >
            <option value="todo">Do zrobienia</option>
            <option value="doing">W toku</option>
            <option value="done">Gotowe</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Termin</label>
          <input
            type="date"
            value={form.due ?? ""}
            onChange={(e) => update("due", e.target.value || null)}
            className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1">Notatki (opcjonalnie)</label>
        <textarea
          value={form.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
          className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
          rows={3}
          placeholder="np. kontakt do dostawcy, warunki umowy…"
        />
      </div>

      {error && <div className="text-sm text-rose-600">{error}</div>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-2xl text-sm border border-stone-300 hover:bg-stone-50"
        >
          Anuluj
        </button>
        <button type="submit" className="px-4 py-2 rounded-2xl text-sm bg-accent-500 text-white hover:bg-accent-600">
          Zapisz
        </button>
      </div>
    </form>
  );
}

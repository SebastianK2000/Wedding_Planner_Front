import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight, RefreshCw, Search, Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  details: string;
  status: "todo" | "done";
}
interface TimelineGroup {
  id: string;
  timeLabel: string;
  tasks: Task[];
}

const initialTimelineData: TimelineGroup[] = [
  {
    id: "group-1",
    timeLabel: "12+ miesięcy przed",
    tasks: [
      { id: "t-1-1", title: "Ustal budżet ślubny", details: "Określ maksymalną kwotę na całe wydarzenie.", status: "todo" },
      { id: "t-1-2", title: "Stwórz wstępną listę gości", details: "Wielkość wesela wpływa na salę i budżet.", status: "todo" },
      { id: "t-1-3", title: "Wybierz datę i miejsce", details: "Zarezerwuj kościół/USC i salę weselną.", status: "todo" },
    ],
  },
  {
    id: "group-2",
    timeLabel: "9–12 miesięcy przed",
    tasks: [
      { id: "t-2-1", title: "Zarezerwuj kluczowych usługodawców", details: "Fotograf, kamerzysta, zespół/DJ.", status: "todo" },
      { id: "t-2-2", title: "Wybierz świadków", details: "Poproście o pełnienie funkcji.", status: "todo" },
      { id: "t-2-3", title: "Rozpocznij poszukiwania sukni", details: "Umów pierwsze przymiarki.", status: "todo" },
    ],
  },
  {
    id: "group-3",
    timeLabel: "6–9 miesięcy przed",
    tasks: [
      { id: "t-3-1", title: "Podpisz umowę z florystą", details: "Ustal styl dekoracji i kolorystykę.", status: "todo" },
      { id: "t-3-2", title: "Zamów zaproszenia", details: "Wybierz projekt i treść.", status: "todo" },
      { id: "t-3-3", title: "Zarezerwuj transport", details: "Auto dla pary i busy dla gości.", status: "todo" },
    ],
  },
  {
    id: "group-4",
    timeLabel: "3–6 miesięcy przed",
    tasks: [
      { id: "t-4-1", title: "Wyślij zaproszenia", details: "Daj gościom czas na odpowiedź.", status: "todo" },
      { id: "t-4-2", title: "Kup obrączki", details: "Z grawerem i rozmiarami.", status: "todo" },
      { id: "t-4-3", title: "Ustal menu", details: "Degustacja + tort.", status: "todo" },
    ],
  },
  {
    id: "group-5",
    timeLabel: "1–3 miesiące przed",
    tasks: [
      { id: "t-5-1", title: "Wieczory panieński/kawalerski", details: "Z pomocą świadków.", status: "todo" },
      { id: "t-5-2", title: "Ostateczne przymiarki", details: "Suknia/garnitur i dodatki.", status: "todo" },
      { id: "t-5-3", title: "Plan usadzenia gości", details: "Stoliki i tablica gości.", status: "todo" },
    ],
  },
  {
    id: "group-6",
    timeLabel: "Dzień ślubu",
    tasks: [
      { id: "t-6-1", title: "Odbierz bukiet i kwiaty", details: "Sprawdź dostawę na czas.", status: "todo" },
      { id: "t-6-2", title: "Oddychaj i ciesz się chwilą", details: "To Wasz dzień ❤️", status: "todo" },
    ],
  },
];

const LS_KEY = "wp_timeline_v1";
const uid = () => Math.random().toString(36).slice(2, 9);

export default function Timeline() {
  const [timeline, setTimeline] = useState<TimelineGroup[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as TimelineGroup[]) : initialTimelineData;
    } catch {
      return initialTimelineData;
    }
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(timeline));
  }, [timeline]);

  const toggleTask = (groupId: string, taskId: string) => {
    setTimeline((curr) =>
      curr.map((g) =>
        g.id === groupId
          ? { ...g, tasks: g.tasks.map((t) => (t.id === taskId ? { ...t, status: t.status === "todo" ? "done" : "todo" } : t)) }
          : g
      )
    );
  };

  const [totalTasks, completedTasks] = useMemo(() => {
    let total = 0;
    let completed = 0;
    timeline.forEach((g) => {
      total += g.tasks.length;
      completed += g.tasks.filter((t) => t.status === "done").length;
    });
    return [total, completed];
  }, [timeline]);
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return timeline;
    return timeline
      .map((g) => ({
        ...g,
        tasks: g.tasks.filter((t) => t.title.toLowerCase().includes(q) || t.details.toLowerCase().includes(q)),
      }))
      .filter((g) => g.tasks.length > 0);
  }, [timeline, query]);

  const expandAll = () => setCollapsed({});
  const collapseAll = () =>
    setCollapsed(Object.fromEntries(timeline.map((g) => [g.id, true])));

  const resetAll = () => {
    setTimeline(initialTimelineData);
    setCollapsed({});
    setQuery("");
  };

  const addTask = (groupId: string) => {
    const title = prompt("Tytuł zadania:");
    if (!title) return;
    const details = prompt("Szczegóły (opcjonalnie):") || "";
    setTimeline((curr) =>
      curr.map((g) =>
        g.id === groupId
          ? { ...g, tasks: [...g.tasks, { id: `t-${g.id}-${uid()}`, title, details, status: "todo" }] }
          : g
      )
    );
    setCollapsed((c) => ({ ...c, [groupId]: false }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Nagłówek */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Harmonogram</h2>
          <p className="text-lg text-stone-600">Kluczowe zadania do wykonania przed wielkim dniem.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-2 rounded-xl border border-stone-300 text-sm hover:bg-stone-50"
          >
            Pokaż wszystkie
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 rounded-xl border border-stone-300 text-sm hover:bg-stone-50"
          >
            Zwiń wszystkie
          </button>
          <button
            onClick={resetAll}
            title="Przywróć domyślny harmonogram"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-accent-500 text-white hover:bg-accent-600"
          >
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Pasek postępu + filtr */}
      <div className="mt-6 grid gap-3 md:grid-cols-3 items-center">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center text-sm font-medium text-stone-600 mb-1">
            <span>Postęp</span>
            <span>{completedTasks} / {totalTasks} zadań • {progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <label className="relative block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj w zadaniach…"
            className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-3 py-2 text-sm"
          />
        </label>
      </div>

      {/* Oś czasu */}
      <div className="relative mt-8">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-stone-200" aria-hidden="true" />

        {filtered.map((group) => {
          const groupTotal = group.tasks.length;
          const groupDone = group.tasks.filter((t) => t.status === "done").length;
          const groupPct = groupTotal ? Math.round((groupDone / groupTotal) * 100) : 0;
          const isCollapsed = !!collapsed[group.id];

          return (
            <section key={group.id} className="mb-8">
              {/* Nagłówek grupy */}
              <div className="rounded-lg sticky top-16 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 py-2 pl-10 pr-2">
                <button
                  onClick={() => setCollapsed((c) => ({ ...c, [group.id]: !c[group.id] }))}
                  className="group inline-flex items-center gap-2"
                  aria-expanded={!isCollapsed}
                  aria-controls={`grp-${group.id}`}
                >
                  {isCollapsed ? (
                    <ChevronRight className="text-stone-500 group-hover:text-stone-700" size={18} />
                  ) : (
                    <ChevronDown className="text-stone-500 group-hover:text-stone-700" size={18} />
                  )}
                  <h3 className="text-xl font-semibold text-stone-800">{group.timeLabel}</h3>
                  <span className="ml-2 text-xs rounded-full bg-stone-100 text-stone-700 px-2 py-0.5">
                    {groupDone}/{groupTotal} • {groupPct}%
                  </span>
                </button>

                {/* mini progress paska w headerze grupy */}
                <div className="mt-2 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-500 transition-[width] duration-300"
                    style={{ width: `${groupPct}%` }}
                  />
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => addTask(group.id)}
                    className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border border-stone-300 hover:bg-stone-50"
                    title="Dodaj zadanie do tej sekcji"
                  >
                    <Plus size={14} /> Dodaj zadanie
                  </button>
                </div>
              </div>

              {/* Lista zadań */}
              <div
                id={`grp-${group.id}`}
                className={`transition-[height,opacity] duration-200 ease-out ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}
              >
                <div className="mt-4 space-y-6">
                  {group.tasks.map((task) => (
                    <div key={task.id} className="relative grid grid-cols-[28px_1fr] gap-4 pl-8 items-start">
                      {/* kolumna 1: checkbox */}
                      <button
                        onClick={() => toggleTask(group.id, task.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTask(group.id, task.id); }
                        }}
                        role="checkbox"
                        aria-checked={task.status === "done"}
                        aria-label={`${task.status === "todo" ? "Oznacz jako ukończone" : "Oznacz jako do zrobienia"}: ${task.title}`}
                        className={[
                          "w-7 h-7 rounded-full border-2 flex items-center justify-center pr-1 mt-2",
                          "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
                          "focus-visible:ring-accent-500/50 focus-visible:ring-offset-2",
                          task.status === "done"
                            ? "bg-accent-500 border-accent-600 text-white"
                            : "bg-white border-stone-400 text-transparent hover:border-accent-500"
                        ].join(" ")}
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>

                      {/* kolumna 2: treść */}
                      <div className="pt-1">
                        <h4 className={`font-semibold ${task.status === "done" ? "text-stone-500 line-through decoration-stone-400" : "text-stone-900"}`}>
                          {task.title}
                        </h4>
                        <p className={`text-sm mt-1 ${task.status === "done" ? "text-stone-400" : "text-stone-600"}`}>
                          {task.details}
                        </p>
                      </div>
                    </div>

                  ))}

                  {/* Pusta sekcja po filtrze */}
                  {group.tasks.length === 0 && (
                    <div className="pl-10 text-sm text-stone-500">Brak zadań w tej sekcji dla zastosowanego filtra.</div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="pl-10 text-stone-600">
            Brak wyników. Spróbuj innego zapytania lub wyczyść filtr.
          </div>
        )}
      </div>
    </div>
  );
}

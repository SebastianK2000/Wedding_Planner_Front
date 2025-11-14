import { useEffect, useMemo, useState } from "react";
import { 
  Check, 
  ChevronDown, 
  ChevronRight, 
  RefreshCw, 
  Search, 
  Plus, 
  Clock, 
  Flag,
  X,
  Calendar
} from "lucide-react";

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

interface TaskFormState extends Task {
  groupId: string;
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
  const [editing, setEditing] = useState<TaskFormState | null>(null);

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
    if(!confirm("Czy na pewno chcesz przywrócić domyślny harmonogram? Wszystkie zmiany zostaną utracone.")) return;
    setTimeline(initialTimelineData);
    setCollapsed({});
    setQuery("");
  };

  const openAddModal = (groupId: string) => {
    setEditing({
      id: `t-${uid()}`,
      groupId: groupId,
      title: "",
      details: "",
      status: "todo"
    });
  };

  const openEditModal = (groupId: string, task: Task) => {
    setEditing({
      ...task,
      groupId
    });
  };

  const saveTask = (form: TaskFormState) => {
    setTimeline((curr) => {
      let newTimeline = [...curr];

      const originalGroup = newTimeline.find(g => g.tasks.some(t => t.id === form.id));
      if (originalGroup) {
         newTimeline = newTimeline.map(g => ({
            ...g,
            tasks: g.tasks.filter(t => t.id !== form.id)
         }));
      }

      newTimeline = newTimeline.map(g => {
        if (g.id === form.groupId) {
          return {
            ...g,
            tasks: [...g.tasks, { id: form.id, title: form.title, details: form.details, status: form.status }]
          };
        }
        return g;
      });

      return newTimeline;
    });
    
    setEditing(null);
    setCollapsed((c) => ({ ...c, [form.groupId]: false }));
  };

  const removeTask = (groupId: string, taskId: string) => {
    if(!confirm("Usunąć ten punkt z harmonogramu?")) return;
    setTimeline(curr => curr.map(g => 
       g.id === groupId ? { ...g, tasks: g.tasks.filter(t => t.id !== taskId) } : g
    ));
    setEditing(null);
  };

  const btnSecondary = "inline-flex items-center justify-center px-3 py-2 rounded-xl text-sm font-medium border border-brand-200 bg-white text-stone-700 hover:bg-brand-50 transition-colors";
  const btnAction = "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-brand-100 text-stone-700 hover:bg-brand-200 transition-colors border border-brand-200";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Harmonogram</h2>
          <p className="text-stone-500 mt-1">Twoja mapa drogowa do wielkiego dnia.</p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button onClick={expandAll} className={btnSecondary}>Pokaż wszystkie</button>
          <button onClick={collapseAll} className={btnSecondary}>Zwiń wszystkie</button>
          <button onClick={resetAll} className={btnAction} title="Przywróć domyślne">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
           <div className="flex flex-col">
             <span className="text-sm font-medium text-stone-700">Postęp przygotowań</span>
             <span className="text-xs text-stone-500">
               {progressPercent === 100 ? "Gotowe do ślubu! 💍" : "Krok po kroku do celu."}
             </span>
           </div>
           <span className="text-xl font-bold text-accent-600">{progressPercent}%</span>
        </div>
        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-accent-400 to-accent-600 transition-all duration-1000 ease-out"
             style={{ width: `${progressPercent}%` }}
           />
        </div>
        <div className="mt-2 text-xs text-stone-400 text-right">
           Ukończono {completedTasks} z {totalTasks} zadań
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-1 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj w harmonogramie..."
            className="w-full bg-transparent pl-9 pr-4 py-3 text-sm outline-none text-stone-700 placeholder:text-stone-400"
          />
        </div>
      </div>

      <div className="relative pl-4 sm:pl-8">
        <div className="absolute left-[27px] sm:left-[43px] top-4 bottom-0 w-px bg-stone-200" aria-hidden="true" />

        <div className="space-y-8">
          {filtered.map((group) => {
            const groupTotal = group.tasks.length;
            const groupDone = group.tasks.filter((t) => t.status === "done").length;
            const isCollapsed = !!collapsed[group.id];
            const isCompleted = groupTotal > 0 && groupTotal === groupDone;

            return (
              <section key={group.id} className="relative">
                
                <div className="sticky top-2 z-10 flex items-start -ml-[11px] sm:-ml-[11px]">
                   <div className={`mt-3 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-20 transition-colors ${isCompleted ? "border-green-500 text-green-500" : "border-accent-500 text-accent-500"}`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                   </div>

                   <div className="ml-4 flex-1 bg-white/90 backdrop-blur border border-stone-200 shadow-sm rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setCollapsed((c) => ({ ...c, [group.id]: !c[group.id] }))}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors"
                      >
                         <div>
                            <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                               {group.timeLabel}
                            </h3>
                            <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                               <Clock size={12} /> {groupDone}/{groupTotal} zadań ukończonych
                            </div>
                         </div>
                         <div className="text-stone-400">
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                         </div>
                      </button>
                      
                      <div className="h-1 w-full bg-stone-100">
                         <div 
                            className={`h-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-accent-400"}`}
                            style={{ width: `${(groupDone / groupTotal) * 100}%` }}
                         />
                      </div>
                   </div>
                </div>

                <div
                  className={`ml-10 mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"}`}
                >
                  <div className="space-y-3 pb-4">
                    {group.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`group flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm bg-white ${task.status === "done" ? "border-stone-100 bg-stone-50/50" : "border-stone-200"}`}
                      >
                        <button
                          onClick={() => toggleTask(group.id, task.id)}
                          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            task.status === "done" 
                              ? "bg-green-500 border-green-500 text-white scale-105" 
                              : "bg-white border-stone-300 text-transparent hover:border-accent-500"
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </button>

                        <div 
                            className="flex-1 cursor-pointer" 
                            onClick={() => openEditModal(group.id, task)}
                        >
                          <h4 className={`font-medium transition-colors ${task.status === "done" ? "text-stone-500 line-through decoration-stone-300" : "text-stone-900"}`}>
                            {task.title}
                          </h4>
                          {task.details && (
                            <p className="text-xs text-stone-500 mt-1">
                              {task.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => openAddModal(group.id)}
                      className="w-full py-2 border border-dashed border-stone-300 rounded-xl text-stone-500 text-sm hover:bg-stone-50 hover:text-accent-600 hover:border-accent-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Dodaj punkt do tego etapu
                    </button>
                  </div>
                </div>
              </section>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12">
               <div className="inline-block p-4 rounded-full bg-stone-50 mb-3">
                  <Flag className="h-8 w-8 text-stone-300" />
               </div>
               <p className="text-stone-500">Brak wyników wyszukiwania.</p>
            </div>
          )}
          
          <div className="relative z-10 flex items-center gap-4 -ml-[11px] sm:-ml-[11px] opacity-50">
             <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-white">
                <div className="w-2 h-2 bg-stone-400 rounded-full" />
             </div>
             <div className="text-sm text-stone-400 font-medium">Koniec harmonogramu</div>
          </div>

        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="text-lg font-bold text-stone-800">
                Punkt harmonogramu
              </div>
              <button onClick={() => setEditing(null)} className="text-stone-400 hover:text-stone-600">
                 <X size={20} />
              </button>
            </div>
            
            <TimelineEditor 
               value={editing} 
               groups={timeline} 
               onSave={saveTask} 
               onDelete={() => removeTask(editing.groupId, editing.id)}
               onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}

function TimelineEditor({ 
   value, 
   groups, 
   onSave, 
   onCancel,
   onDelete 
}: { 
   value: TaskFormState; 
   groups: TimelineGroup[];
   onSave: (val: TaskFormState) => void; 
   onCancel: () => void;
   onDelete: () => void;
}) {
  const [form, setForm] = useState<TaskFormState>(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
       <div className="space-y-4">
          <div>
             <label className="block text-xs font-medium text-stone-500 mb-1.5">Co trzeba zrobić?</label>
             <input 
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
                placeholder="np. Zamówić tort"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                autoFocus
             />
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Kiedy?</label>
                <div className="relative">
                   <select 
                      className="w-full appearance-none rounded-xl border border-stone-200 px-4 py-3 bg-white text-stone-700 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                      value={form.groupId}
                      onChange={(e) => setForm({...form, groupId: e.target.value})}
                   >
                      {groups.map(g => (
                         <option key={g.id} value={g.id}>{g.timeLabel}</option>
                      ))}
                   </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <Calendar size={16} />
                   </div>
                </div>
             </div>
          </div>

          <div>
             <label className="block text-xs font-medium text-stone-500 mb-1.5">Szczegóły (opcjonalnie)</label>
             <textarea 
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all min-h-[100px]"
                placeholder="Dodatkowe informacje, kontakty, adresy..."
                value={form.details}
                onChange={(e) => setForm({...form, details: e.target.value})}
             />
          </div>
       </div>

       <div className="flex justify-between pt-4 border-t border-stone-100">
          <button 
             type="button" 
             onClick={onDelete}
             className="text-stone-400 hover:text-rose-600 px-2 py-2 text-sm font-medium transition-colors"
          >
             Usuń punkt
          </button>
          <div className="flex gap-3">
             <button 
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
             >
                Anuluj
             </button>
             <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 transition-all transform active:scale-95"
             >
                Zapisz
             </button>
          </div>
       </div>
    </form>
  );
}
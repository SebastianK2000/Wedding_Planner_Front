import { useMemo, useState } from "react";
import { GUESTS, type Guest, type GuestStatus } from "@/data/guests";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Plus, 
  FileDown, 
  Utensils, 
  Mail, 
  Phone, 
  MapPin, 
  UserPlus,
  Pencil,
  Trash2
} from "lucide-react";

const statusLabels: Record<GuestStatus, string> = {
  potwierdzone: "Potwierdzone",
  oczekuje: "Oczekuje",
  odmowa: "Odmowa",
};

const statusStyles: Record<GuestStatus, string> = {
  potwierdzone: "bg-green-100 text-green-700 border-green-200",
  oczekuje: "bg-amber-50 text-amber-700 border-amber-200",
  odmowa: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Guests() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuestStatus | "wszyscy">("wszyscy");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [local, setLocal] = useState<Guest[]>(GUESTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);

  const counts = useMemo(() => {
    return local.reduce(
      (acc, g) => {
        acc.total++;
        acc[g.status]++;
        return acc;
      },
      { total: 0, potwierdzone: 0, oczekuje: 0, odmowa: 0 } as Record<string, number>
    );
  }, [local]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return local.filter((g) => {
      const okStatus = statusFilter === "wszyscy" ? true : g.status === statusFilter;
      const okQuery =
        q.length === 0 ||
        g.name.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q) ||
        String(g.table ?? "").includes(q);
      return okStatus && okQuery;
    });
  }, [local, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function cycleStatus(g: Guest) {
    const next: GuestStatus =
      g.status === "potwierdzone" ? "oczekuje" : g.status === "oczekuje" ? "odmowa" : "potwierdzone";
    setLocal((prev) =>
      prev.map((x) => (x.id === g.id ? { ...x, status: next, table: next === "odmowa" ? null : x.table } : x))
    );
  }

  function updateTable(g: Guest, table: number | null) {
    setLocal((prev) => prev.map((x) => (x.id === g.id ? { ...x, table } : x)));
  }

  function deleteGuest(g: Guest) {
    if (!confirm(`Usunąć gościa: ${g.name}?`)) return;
    setLocal((prev) => {
      const next = prev.filter((x) => x.id !== g.id);
      const newTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
      if (page > newTotalPages && page > 1) setPage(newTotalPages);
      return next;
    });
  }

  function saveGuest(guest: Guest) {
    if (editing) {
      setLocal((prev) => prev.map((x) => (x.id === guest.id ? guest : x)));
    } else {
      setLocal((prev) => [guest, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lista Gosci Weselnych", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Razem: ${counts.total}  |  Potwierdzone: ${counts.potwierdzone}  |  Oczekuje: ${counts.oczekuje}`,
      14,
      22
    );

    const tableColumn = ["Imie i nazwisko", "Status", "Strona", "Stolik", "Dieta", "+1", "Kontakt"];
    const tableRows = filtered.map((g) => [
        g.name,
        statusLabels[g.status],
        g.side,
        g.table ? String(g.table) : "-",
        g.diet || "-",
        g.plusOne ? "Tak" : "Nie",
        [g.email, g.phone].filter(Boolean).join("\n") || "-"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [231, 108, 129] },
    });
    doc.save("lista-gosci.pdf");
  }

  const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors shadow-md shadow-accent-500/20";
  const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium border border-brand-200 bg-white text-stone-700 hover:bg-brand-50 transition-colors";
  const tabClass = (active: boolean, colorClass: string) => 
    `flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-medium transition-all border ${active ? `${colorClass} shadow-sm scale-105` : "border-transparent text-stone-500 hover:bg-stone-100"}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Goście</h2>
          <p className="text-stone-500 mt-1">Zarządzaj listą zaproszonych, dietami i stolikami.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={exportPDF}>
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <button className={btnPrimary} onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" /> Dodaj gościa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Razem" value={counts.total} icon={<Users />} tone="neutral" />
        <StatCard label="Potwierdzone" value={counts.potwierdzone} icon={<CheckCircle2 />} tone="green" />
        <StatCard label="Oczekuje" value={counts.oczekuje} icon={<Clock />} tone="orange" />
        <StatCard label="Odmowa" value={counts.odmowa} icon={<XCircle />} tone="red" />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-1 shadow-sm flex flex-col lg:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Szukaj gościa..."
            className="w-full bg-transparent pl-9 pr-4 py-3 text-sm outline-none text-stone-700 placeholder:text-stone-400"
          />
        </div>
        <div className="h-8 w-px bg-stone-200 hidden lg:block"></div>
        <div className="flex w-full lg:w-auto p-1 bg-stone-50 rounded-2xl overflow-x-auto">
           <button onClick={() => setStatusFilter("wszyscy")} className={tabClass(statusFilter === "wszyscy", "bg-white border-stone-200 text-stone-900")}>Wszyscy</button>
           <button onClick={() => setStatusFilter("potwierdzone")} className={tabClass(statusFilter === "potwierdzone", "bg-green-50 border-green-200 text-green-700")}>Potwierdzone</button>
           <button onClick={() => setStatusFilter("oczekuje")} className={tabClass(statusFilter === "oczekuje", "bg-amber-50 border-amber-200 text-amber-700")}>Oczekuje</button>
           <button onClick={() => setStatusFilter("odmowa")} className={tabClass(statusFilter === "odmowa", "bg-rose-50 border-rose-200 text-rose-700")}>Odmowa</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden hidden md:block">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50/50 text-stone-500">
            <tr>
              <th className="py-3 px-6 font-medium">Imię i nazwisko</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Szczegóły</th>
              <th className="py-3 px-4 font-medium">Stolik</th>
              <th className="py-3 px-4 font-medium">Kontakt</th>
              <th className="py-3 px-4 font-medium text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pageItems.map((g) => (
              <tr key={g.id} className="group hover:bg-stone-50/50 transition-colors">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar name={g.name} />
                    <div>
                      <div className="font-medium text-stone-900">{g.name}</div>
                      <div className="text-xs text-stone-500 capitalize">{g.side}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                   <button onClick={() => cycleStatus(g)} className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-transform active:scale-95 ${statusStyles[g.status]}`}>
                      {statusLabels[g.status]}
                   </button>
                </td>
                <td className="py-3 px-4">
                   <div className="flex flex-col gap-1">
                      {g.plusOne && (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded w-fit">
                           <UserPlus className="h-3 w-3" /> Osoba tow.
                        </span>
                      )}
                      {g.diet && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit" title={g.diet}>
                           <Utensils className="h-3 w-3" /> {g.diet.length > 15 ? g.diet.slice(0,12)+"..." : g.diet}
                        </span>
                      )}
                      {!g.plusOne && !g.diet && <span className="text-stone-400 text-xs">—</span>}
                   </div>
                </td>
                <td className="py-3 px-4">
                   <div className="relative w-16">
                      <select 
                        value={g.table ?? ""} 
                        onChange={(e) => updateTable(g, e.target.value ? Number(e.target.value) : null)}
                        className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-lg py-1 pl-2 pr-4 text-xs font-medium focus:ring-1 focus:ring-accent-500 outline-none"
                      >
                         <option value="">—</option>
                         {Array.from({ length: 15 }).map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                      </select>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"><MapPin className="h-3 w-3" /></div>
                   </div>
                </td>
                <td className="py-3 px-4">
                   {(g.email || g.phone) ? (
                     <div className="flex flex-col gap-0.5 text-xs text-stone-500">
                        {g.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {g.email}</div>}
                        {g.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {g.phone}</div>}
                     </div>
                   ) : <span className="text-stone-400 text-xs">—</span>}
                </td>
                <td className="py-3 px-4 text-right">
                   <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing(g); setModalOpen(true); }} className="p-2 text-stone-400 hover:text-accent-600 hover:bg-accent-50 rounded-xl"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteGuest(g)} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><Trash2 className="h-4 w-4" /></button>
                   </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
               <tr><td colSpan={6} className="py-12 text-center text-stone-500">Brak gości spełniających kryteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
         {pageItems.map((g) => (
            <div key={g.id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
               <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                     <Avatar name={g.name} />
                     <div>
                        <div className="font-semibold text-stone-900">{g.name}</div>
                        <div className="text-xs text-stone-500 capitalize">{g.side}</div>
                     </div>
                  </div>
                  <button onClick={() => cycleStatus(g)} className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${statusStyles[g.status]}`}>
                      {statusLabels[g.status]}
                   </button>
               </div>

               <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-stone-50 p-2 rounded-xl flex flex-col justify-center">
                     <span className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Opcje</span>
                     <div className="flex flex-wrap gap-1">
                        {g.plusOne && <UserPlus className="h-4 w-4 text-stone-600" />}
                        {g.diet && <Utensils className="h-4 w-4 text-amber-600" />}
                        {!g.plusOne && !g.diet && <span className="text-xs text-stone-400">-</span>}
                     </div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl">
                     <span className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Stolik</span>
                     <select 
                        value={g.table ?? ""} 
                        onChange={(e) => updateTable(g, e.target.value ? Number(e.target.value) : null)}
                        className="w-full bg-transparent text-sm font-bold text-stone-800 outline-none"
                      >
                         <option value="">Brak</option>
                         {Array.from({ length: 15 }).map((_, i) => <option key={i} value={i+1}>Stół {i+1}</option>)}
                      </select>
                  </div>
               </div>

               {(g.email || g.phone) && (
                  <div className="mb-3 pt-3 border-t border-stone-100 flex flex-col gap-1 text-xs text-stone-500">
                     {g.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {g.email}</div>}
                     {g.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {g.phone}</div>}
                  </div>
               )}

               <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
                  <button onClick={() => { setEditing(g); setModalOpen(true); }} className="text-xs font-medium px-3 py-1.5 bg-stone-100 rounded-lg text-stone-600">Edytuj</button>
                  <button onClick={() => deleteGuest(g)} className="text-xs font-medium px-3 py-1.5 bg-rose-50 rounded-lg text-rose-600">Usuń</button>
               </div>
            </div>
         ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
           <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="px-3 py-1 rounded-lg border border-stone-200 disabled:opacity-50 bg-white text-stone-600">Poprzednia</button>
           <span className="px-3 py-1 text-sm text-stone-500 flex items-center">Strona {page} z {totalPages}</span>
           <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1 rounded-lg border border-stone-200 disabled:opacity-50 bg-white text-stone-600">Następna</button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="text-lg font-bold text-stone-800">
                {editing ? "Edytuj gościa" : "Dodaj gościa"}
              </div>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600"><XCircle className="h-6 w-6" /></button>
            </div>
            <GuestEditor 
               initialValue={editing} 
               onSave={saveGuest} 
               onCancel={() => setModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "neutral"|"green"|"orange"|"red" }) {
  const styles = {
    neutral: "bg-white text-stone-600 border-stone-200",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`rounded-3xl border p-5 flex items-center gap-4 ${styles[tone]}`}>
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

function Avatar({ name }: { name: string }) {
   const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
   const colors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700", "bg-indigo-100 text-indigo-700", "bg-teal-100 text-teal-700"];
   const colorClass = colors[name.length % colors.length];

   return (
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${colorClass}`}>
         {initials}
      </div>
   );
}

function GuestEditor({ initialValue, onSave, onCancel }: { initialValue: Guest | null, onSave: (g: Guest) => void, onCancel: () => void }) {
   const [form, setForm] = useState<Partial<Guest>>(initialValue || {
      id: `g${Date.now()}`,
      name: "",
      status: "oczekuje",
      side: "panna młoda",
      plusOne: false,
      diet: undefined,
      table: null,
      email: "",
      phone: "",
      notes: ""
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name?.trim()) return;
      onSave(form as Guest);
   };

   return (
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
         <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Imię i nazwisko *</label>
                  <input 
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-800 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none"
                     value={form.name}
                     onChange={e => setForm({...form, name: e.target.value})}
                     autoFocus
                  />
               </div>
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Status RSVP</label>
                  <select 
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 bg-white text-stone-800 outline-none"
                     value={form.status}
                     onChange={e => setForm({...form, status: e.target.value as GuestStatus})}
                  >
                     <option value="potwierdzone">Potwierdzone</option>
                     <option value="oczekuje">Oczekuje</option>
                     <option value="odmowa">Odmowa</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Strona</label>
                  <select 
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 bg-white text-stone-800 outline-none"
                     value={form.side}
                     onChange={e => setForm({...form, side: e.target.value as Guest['side']})}
                  >
                     <option value="panna młoda">Panna Młoda</option>
                     <option value="pan młody">Pan Młody</option>
                     <option value="wspólni">Wspólni</option>
                  </select>
               </div>
               <div className="bg-stone-50 p-3 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => setForm({...form, plusOne: !form.plusOne})}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center bg-white ${form.plusOne ? "border-accent-500 text-accent-500" : "border-stone-300"}`}>
                     {form.plusOne && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-sm font-medium text-stone-700">Osoba towarzysząca (+1)</span>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Stolik (opcjonalnie)</label>
                  <input 
                     type="number"
                     min={1}
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-800 outline-none"
                     value={form.table || ""}
                     onChange={e => setForm({...form, table: e.target.value ? Number(e.target.value) : null})}
                     placeholder="Nr"
                  />
               </div>
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Email</label>
                  <input 
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-800 outline-none"
                     value={form.email || ""}
                     onChange={e => setForm({...form, email: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Telefon</label>
                  <input 
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-800 outline-none"
                     value={form.phone || ""}
                     onChange={e => setForm({...form, phone: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Dieta / Alergie</label>
                  <input 
                     className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-800 outline-none"
                     value={form.diet || ""}
                     onChange={e => setForm({...form, diet: e.target.value as Guest['diet']})}
                     placeholder="np. Wegetarianin"
                  />
               </div>
            </div>
         </div>

         <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Notatki</label>
            <textarea 
               className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-stone-800 outline-none h-20 resize-none"
               value={form.notes || ""}
               onChange={e => setForm({...form, notes: e.target.value})}
            />
         </div>

         <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors">Anuluj</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 transition-all transform active:scale-95">Zapisz</button>
         </div>
      </form>
   );
}
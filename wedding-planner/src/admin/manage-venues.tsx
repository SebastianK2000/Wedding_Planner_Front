import { useState } from "react";
import { Plus, Search, Pencil, Trash2, MapPin } from "lucide-react";
import { VENUES } from "@/data/venues";
import { Button } from "@/components/ui/button";

export default function ManageVenues() {
  const [venues, setVenues] = useState(VENUES);
  const [q, setQ] = useState("");

  const filtered = venues.filter(v => 
    v.name.toLowerCase().includes(q.toLowerCase()) || 
    v.city.toLowerCase().includes(q.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if(confirm("Czy na pewno usunąć tę salę?")) {
      setVenues(prev => prev.filter(v => v.id !== id));
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Sale weselne</h1>
          <p className="text-stone-500">Zarządzaj bazą obiektów dostępnych w aplikacji.</p>
        </div>
        <Button className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg shadow-stone-900/20">
           <Plus className="mr-2 h-4 w-4" /> Dodaj nową salę
        </Button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Szukaj sali po nazwie lub mieście..." 
            value={q}
            onChange={e => setQ(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/80 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Obiekt</th>
                <th className="px-6 py-4">Miasto</th>
                <th className="px-6 py-4">Pojemność</th>
                <th className="px-6 py-4">Cena / os.</th>
                <th className="px-6 py-4">Ocena</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((venue) => (
                <tr key={venue.id} className="group hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={venue.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-200" />
                      <div>
                         <div className="font-medium text-stone-900">{venue.name}</div>
                         <div className="text-xs text-stone-500 truncate max-w-[150px]">{venue.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                     <div className="flex items-center gap-1"><MapPin size={14}/> {venue.city}</div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{venue.capacity} os.</td>
                  <td className="px-6 py-4 font-medium text-stone-900">{venue.pricePerPerson} zł</td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-100">
                        ★ {venue.rating}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                           <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(venue.id)} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
           <div className="p-12 text-center text-stone-500">Nie znaleziono obiektów.</div>
        )}
      </div>
    </div>
  );
}
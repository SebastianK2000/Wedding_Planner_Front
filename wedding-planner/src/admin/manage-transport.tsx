import { useState } from "react";
import { Plus, Search, Pencil, Trash2, MapPin, Car, Bus, Users } from "lucide-react";
import { TRANSPORT } from "@/data/transport";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ManageTransport() {
  const [items, setItems] = useState(TRANSPORT);
  const [q, setQ] = useState("");

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(q.toLowerCase()) || 
    i.city.toLowerCase().includes(q.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if(confirm("Czy na pewno usunąć ten pojazd?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  }

  function numberFmt(n: number) {
    return new Intl.NumberFormat("pl-PL").format(n);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Transport</h1>
          <p className="text-stone-500">Zarządzaj ofertą transportową (Auta, Busy).</p>
        </div>
        <Button className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg shadow-stone-900/20">
           <Plus className="mr-2 h-4 w-4" /> Dodaj pojazd
        </Button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Szukaj pojazdu..." 
            value={q}
            onChange={e => setQ(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/80 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Pojazd</th>
                <th className="px-6 py-4">Typ</th>
                <th className="px-6 py-4">Miasto</th>
                <th className="px-6 py-4">Pojemność</th>
                <th className="px-6 py-4">Cena od</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => {
                 const Icon = item.type === "Bus" ? Bus : Car;
                 return (
                  <tr key={item.id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-200" />
                        <div className="font-medium text-stone-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className="text-stone-600 border-stone-200 font-normal">
                          <Icon className="mr-1.5 h-3 w-3" /> {item.type}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                       <div className="flex items-center gap-1"><MapPin size={14}/> {item.city}</div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                       <div className="flex items-center gap-1"><Users size={14}/> {item.capacity || 4}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-900">{numberFmt(item.priceFrom)} zł</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                             <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                 )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
           <div className="p-12 text-center text-stone-500">Brak pojazdów.</div>
        )}
      </div>
    </div>
  );
}
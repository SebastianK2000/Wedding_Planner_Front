import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, MapPin, Music, Mic2, Headphones, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "../lib/api";

interface ApiMusicianType {
  id: number;
  name: string;
}

interface ApiMusician {
  id: number;
  typeid: number;
  name: string;
  city: string;
  pricefrom: string | number;
  description: string;
  imageurl: string;
}

interface MusicItem {
  id: number;
  name: string;
  type: string;
  typeId: number;
  city: string;
  priceFrom: number;
  desc: string;
  img: string;
}

const DEFAULT_FORM = {
  name: "",
  typeId: 0,
  city: "",
  priceFrom: 0,
  desc: "",
  img: ""
};

export default function ManageMusic() {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [types, setTypes] = useState<ApiMusicianType[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [musicRes, typesRes] = await Promise.all([
        api.get("/music/"),
        api.get("/musician-types/")
      ]);

      const fetchedTypes: ApiMusicianType[] = typesRes.data;
      setTypes(fetchedTypes);

      const mappedItems: MusicItem[] = musicRes.data.map((m: ApiMusician) => {
        const typeObj = fetchedTypes.find(t => t.id === m.typeid);
        return {
          id: m.id,
          name: m.name,
          type: typeObj ? typeObj.name : "Inny",
          typeId: m.typeid,
          city: m.city || "",
          priceFrom: Number(m.pricefrom),
          desc: m.description || "",
          img: m.imageurl || ""
        };
      });

      setItems(mappedItems);
    } catch (err) {
      console.error("Błąd pobierania muzyki:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
        ...DEFAULT_FORM,
        typeId: types.length > 0 ? types[0].id : 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: MusicItem) => {
    setEditingId(item.id);
    setFormData({
        name: item.name,
        typeId: item.typeId,
        city: item.city,
        priceFrom: item.priceFrom,
        desc: item.desc,
        img: item.img
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
        typeid: formData.typeId,
        name: formData.name,
        city: formData.city,
        pricefrom: formData.priceFrom,
        description: formData.desc,
        imageurl: formData.img
    };

    try {
        if (editingId) {
            await api.put(`/music/${editingId}/`, payload);
            
            const updatedType = types.find(t => t.id === formData.typeId);
            setItems(prev => prev.map(i => i.id === editingId ? { 
                ...i, 
                ...formData, 
                type: updatedType ? updatedType.name : "Inny" 
            } : i));
            
            alert("Zaktualizowano wykonawcę.");
        } else {
            const res = await api.post("/music/", payload);
            const updatedType = types.find(t => t.id === formData.typeId);
            const newItem: MusicItem = {
                id: res.data.id,
                name: formData.name,
                type: updatedType ? updatedType.name : "Inny",
                typeId: formData.typeId,
                city: formData.city,
                priceFrom: formData.priceFrom,
                desc: formData.desc,
                img: formData.img
            };
            setItems(prev => [newItem, ...prev]);
            alert("Dodano wykonawcę.");
        }
        setIsModalOpen(false);
    } catch (error) {
        console.error("Błąd zapisu:", error);
        alert("Wystąpił błąd podczas zapisu.");
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Czy na pewno usunąć tego wykonawcę?")) return;

    const prevItems = [...items];
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      await api.delete(`/music/${id}/`);
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć wykonawcy.");
      setItems(prevItems);
    }
  };

  function numberFmt(n: number) {
    return new Intl.NumberFormat("pl-PL").format(n);
  }

  const getIcon = (typeName: string) => {
      const lower = typeName.toLowerCase();
      if (lower.includes("dj")) return Headphones;
      if (lower.includes("zespół") || lower.includes("band")) return Music;
      return Mic2;
  };

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(q.toLowerCase()) || 
    i.city.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-stone-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p>Wczytuję listę wykonawców...</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Muzyka</h1>
          <p className="text-stone-500">Zarządzaj zespołami i DJ-ami.</p>
        </div>
        <Button onClick={handleAdd} className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg shadow-stone-900/20">
           <Plus className="mr-2 h-4 w-4" /> Dodaj artystę
        </Button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Szukaj artysty..." 
            value={q}
            onChange={e => setQ(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/80 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Artysta</th>
                <th className="px-6 py-4">Typ</th>
                <th className="px-6 py-4">Lokalizacja</th>
                <th className="px-6 py-4">Cena od</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => {
                 const Icon = getIcon(item.type);
                 return (
                  <tr key={item.id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                            src={item.img || "https://placehold.co/100x100?text=Muzyka"} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-stone-200"
                            onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=N/A")}
                        />
                        <div>
                          <div className="font-medium text-stone-900">{item.name}</div>
                          <div className="text-xs text-stone-500 truncate max-w-[200px]">{item.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-200 gap-1 font-normal">
                          <Icon className="h-3 w-3" /> {item.type}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                       <div className="flex items-center gap-1"><MapPin size={14}/> {item.city}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-900">{numberFmt(item.priceFrom)} zł</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
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
           <div className="p-12 text-center text-stone-500 flex flex-col items-center gap-2">
              <Music className="h-8 w-8 text-stone-300" />
              <p>Nie znaleziono wyników.</p>
           </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Mic2 size={20} className="text-stone-400"/>
                        {editingId ? "Edytuj wykonawcę" : "Dodaj wykonawcę"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Typ wykonawcy</label>
                            <div className="relative">
                                <select 
                                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 appearance-none"
                                    value={formData.typeId}
                                    onChange={(e) => setFormData({...formData, typeId: Number(e.target.value)})}
                                >
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nazwa artysty</label>
                            <Input 
                                required
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="np. DJ Marco"
                                className="bg-stone-50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Miasto</label>
                            <Input 
                                value={formData.city} 
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                placeholder="np. Warszawa"
                                className="bg-stone-50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Cena od (PLN)</label>
                            <Input 
                                type="number"
                                min="0"
                                value={formData.priceFrom} 
                                onChange={e => setFormData({...formData, priceFrom: Number(e.target.value)})}
                                className="bg-stone-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Opis</label>
                        <Textarea 
                            value={formData.desc} 
                            onChange={e => setFormData({...formData, desc: e.target.value})}
                            placeholder="Repertuar, styl muzyczny..."
                            className="bg-stone-50 min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Link do zdjęcia</label>
                        <Input 
                            value={formData.img} 
                            onChange={e => setFormData({...formData, img: e.target.value})}
                            placeholder="https://..."
                            className="bg-stone-50"
                        />
                    </div>

                    <div className="pt-4 flex gap-3 justify-end border-t border-stone-100 mt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Anuluj
                        </Button>
                        <Button type="submit" disabled={saving} className="bg-stone-900 hover:bg-stone-800 text-white min-w-[100px]">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Zapisz"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}
import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, MapPin, Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "../lib/api";

interface ApiPhotographerStyle {
  id: number;
  stylename: string;
  description: string;
}

interface ApiPhotographer {
  id: number;
  styleid: number;
  name: string;
  city: string;
  pricefrom: string | number;
  description: string;
  imageurl: string;
}

interface PhotographerItem {
  id: number;
  name: string;
  style: string;
  styleId: number;
  city: string;
  priceFrom: number;
  desc: string;
  img: string;
}

const DEFAULT_FORM = {
  name: "",
  styleId: 0,
  city: "",
  priceFrom: 0,
  desc: "",
  img: ""
};

export default function ManagePhotographers() {
  const [items, setItems] = useState<PhotographerItem[]>([]);
  const [styles, setStyles] = useState<ApiPhotographerStyle[]>([]);
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
      const [photoRes, stylesRes] = await Promise.all([
        api.get("/photographers/"),
        api.get("/photographer-styles/")
      ]);

      const fetchedStyles: ApiPhotographerStyle[] = stylesRes.data;
      setStyles(fetchedStyles);

      const mappedItems: PhotographerItem[] = photoRes.data.map((p: ApiPhotographer) => {
        const styleObj = fetchedStyles.find(s => s.id === p.styleid);
        return {
          id: p.id,
          name: p.name,
          style: styleObj ? styleObj.stylename : "Inny",
          styleId: p.styleid,
          city: p.city || "",
          priceFrom: Number(p.pricefrom),
          desc: p.description || "",
          img: p.imageurl || ""
        };
      });

      setItems(mappedItems);
    } catch (err) {
      console.error("Błąd pobierania fotografów:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
        ...DEFAULT_FORM,
        styleId: styles.length > 0 ? styles[0].id : 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: PhotographerItem) => {
    setEditingId(item.id);
    setFormData({
        name: item.name,
        styleId: item.styleId,
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
        styleid: formData.styleId,
        name: formData.name,
        city: formData.city,
        pricefrom: formData.priceFrom,
        description: formData.desc,
        imageurl: formData.img
    };

    try {
        if (editingId) {
            await api.put(`/photographers/${editingId}/`, payload);
            
            const updatedStyle = styles.find(s => s.id === formData.styleId);
            setItems(prev => prev.map(i => i.id === editingId ? { 
                ...i, 
                ...formData, 
                style: updatedStyle ? updatedStyle.stylename : "Inny" 
            } : i));
            
            alert("Zaktualizowano fotografa.");
        } else {
            const res = await api.post("/photographers/", payload);
            const updatedStyle = styles.find(s => s.id === formData.styleId);
            const newItem: PhotographerItem = {
                id: res.data.id,
                name: formData.name,
                style: updatedStyle ? updatedStyle.stylename : "Inny",
                styleId: formData.styleId,
                city: formData.city,
                priceFrom: formData.priceFrom,
                desc: formData.desc,
                img: formData.img
            };
            setItems(prev => [newItem, ...prev]);
            alert("Dodano fotografa.");
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
    if(!confirm("Czy na pewno usunąć tego fotografa?")) return;

    const prevItems = [...items];
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      await api.delete(`/photographers/${id}/`);
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć fotografa.");
      setItems(prevItems);
    }
  };

  function numberFmt(n: number) {
    return new Intl.NumberFormat("pl-PL").format(n);
  }

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(q.toLowerCase()) || 
    i.city.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-stone-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p>Wczytuję listę fotografów...</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Fotografowie</h1>
          <p className="text-stone-500">Edytuj profile i oferty fotograficzne.</p>
        </div>
        <Button onClick={handleAdd} className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg shadow-stone-900/20">
           <Plus className="mr-2 h-4 w-4" /> Dodaj fotografa
        </Button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Wpisz nazwę studia..." 
            value={q}
            onChange={e => setQ(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/80 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Nazwa</th>
                <th className="px-6 py-4">Styl</th>
                <th className="px-6 py-4">Lokalizacja</th>
                <th className="px-6 py-4">Pakiet od</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="group hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.img || "https://placehold.co/100x100?text=Foto"} 
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
                  <td className="px-6 py-4 text-stone-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
                        {item.style}
                      </span>
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
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
           <div className="p-12 text-center text-stone-500 flex flex-col items-center gap-2">
              <Camera className="h-8 w-8 text-stone-300" />
              <p>Brak fotografów w bazie.</p>
           </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Camera size={20} className="text-stone-400"/>
                        {editingId ? "Edytuj fotografa" : "Dodaj fotografa"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Styl fotografii</label>
                            <div className="relative">
                                <select 
                                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 appearance-none"
                                    value={formData.styleId}
                                    onChange={(e) => setFormData({...formData, styleId: Number(e.target.value)})}
                                >
                                    {styles.map(s => (
                                        <option key={s.id} value={s.id}>{s.stylename}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nazwa Studia / Imię</label>
                            <Input 
                                required
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="np. Adam Nowak Photo"
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
                            placeholder="Krótki opis, styl pracy..."
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
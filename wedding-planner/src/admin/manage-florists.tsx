import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, MapPin, Flower2, Store, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "../lib/api";

interface ApiFlorist {
  id: number;
  companyname: string;
  title: string;
  city: string;
  pricefrom: string | number;
  description: string;
  imageurl: string;
}

interface FloristItem {
  id: number;
  title: string;
  companyName: string;
  city: string;
  priceFrom: number;
  desc: string;
  image: string;
}

const DEFAULT_FORM = {
  companyName: "",
  title: "",
  city: "",
  priceFrom: 0,
  desc: "",
  image: ""
};

export default function ManageFlorists() {
  const [items, setItems] = useState<FloristItem[]>([]);
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
      const res = await api.get("/florists/");
      
      const mappedItems: FloristItem[] = res.data.map((f: ApiFlorist) => ({
        id: f.id,
        title: f.title || "",
        companyName: f.companyname,
        city: f.city || "",
        priceFrom: Number(f.pricefrom),
        desc: f.description || "",
        image: f.imageurl || ""
      }));

      setItems(mappedItems);
    } catch (err) {
      console.error("Błąd pobierania florystów:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FloristItem) => {
    setEditingId(item.id);
    setFormData({
        companyName: item.companyName,
        title: item.title,
        city: item.city,
        priceFrom: item.priceFrom,
        desc: item.desc,
        image: item.image
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
        companyname: formData.companyName,
        title: formData.title,
        city: formData.city,
        pricefrom: formData.priceFrom,
        description: formData.desc,
        imageurl: formData.image
    };

    try {
        if (editingId) {
            await api.put(`/florists/${editingId}/`, payload);
            setItems(prev => prev.map(i => i.id === editingId ? { ...formData, id: editingId } : i));
            alert("Zaktualizowano ofertę.");
        } else {
            const res = await api.post("/florists/", payload);
            const newItem: FloristItem = {
                ...formData,
                id: res.data.id
            };
            setItems(prev => [newItem, ...prev]);
            alert("Dodano nową ofertę.");
        }
        setIsModalOpen(false);
    } catch (error) {
        console.error("Błąd zapisu:", error);
        alert("Wystąpił błąd podczas zapisywania.");
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Czy na pewno usunąć tę ofertę?")) return;

    const previousItems = [...items];
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      await api.delete(`/florists/${id}/`);
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć oferty.");
      setItems(previousItems);
    }
  };

  function numberFmt(n: number) {
    return new Intl.NumberFormat("pl-PL").format(n);
  }

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(q.toLowerCase()) || 
    i.companyName.toLowerCase().includes(q.toLowerCase()) ||
    i.city.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-stone-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p>Wczytuję katalog florystów...</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Floryści</h1>
          <p className="text-stone-500">Katalog dekoracji i usług florystycznych.</p>
        </div>
        <Button onClick={handleAdd} className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg shadow-stone-900/20">
           <Plus className="mr-2 h-4 w-4" /> Dodaj ofertę
        </Button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Szukaj po nazwie, firmie..." 
            value={q}
            onChange={e => setQ(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/80 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Oferta</th>
                <th className="px-6 py-4">Firma</th>
                <th className="px-6 py-4">Miasto</th>
                <th className="px-6 py-4">Cena od</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="group hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || "https://placehold.co/100x100?text=Brak"} 
                        alt={item.title} 
                        className="w-10 h-10 rounded-lg object-cover bg-stone-200"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=N/A")}
                      />
                      <div>
                        <div className="font-medium text-stone-900">{item.title}</div>
                        <div className="text-xs text-stone-500 truncate max-w-[200px]">{item.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                      <div className="flex items-center gap-2"><Store size={14} className="text-stone-400"/> {item.companyName}</div>
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
              <Flower2 className="h-8 w-8 text-stone-300" />
              <p>Brak ofert florystycznych.</p>
           </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Flower2 size={20} className="text-stone-400"/>
                        {editingId ? "Edytuj ofertę" : "Dodaj ofertę"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nazwa firmy</label>
                            <Input 
                                required
                                value={formData.companyName} 
                                onChange={e => setFormData({...formData, companyName: e.target.value})}
                                placeholder="np. Kwiaty & My"
                                className="bg-stone-50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Tytuł oferty</label>
                            <Input 
                                required
                                value={formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="np. Bukiet ślubny"
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
                                placeholder="np. Kraków"
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
                            placeholder="Opis usług..."
                            className="bg-stone-50 min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Link do zdjęcia</label>
                        <Input 
                            value={formData.image} 
                            onChange={e => setFormData({...formData, image: e.target.value})}
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
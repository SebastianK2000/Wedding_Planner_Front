import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, MapPin, Loader2, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "../lib/api";

interface ApiVenue {
  id: number;
  name: string;
  city: string;
  capacity: number;
  priceperperson: string | number;
  description: string;
  imageurl: string;
  rating: string | number;
}

interface VenueView {
  id: number;
  name: string;
  city: string;
  capacity: number;
  pricePerPerson: number;
  description: string;
  image: string;
  rating: number;
}

const DEFAULT_FORM = {
  name: "",
  city: "",
  capacity: 0,
  pricePerPerson: 0,
  description: "",
  image: "",
  rating: 5.0
};

export default function ManageVenues() {
  const [venues, setVenues] = useState<VenueView[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await api.get("/venues/");
      const mapped: VenueView[] = res.data.map((v: ApiVenue) => ({
        id: v.id,
        name: v.name,
        city: v.city,
        capacity: v.capacity,
        pricePerPerson: Number(v.priceperperson),
        description: v.description || "",
        image: v.imageurl || "",
        rating: Number(v.rating) || 0
      }));
      setVenues(mapped);
    } catch (err) {
      console.error("Błąd pobierania sal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = (venue: VenueView) => {
    setEditingId(venue.id);
    setFormData({
        name: venue.name,
        city: venue.city,
        capacity: venue.capacity,
        pricePerPerson: venue.pricePerPerson,
        description: venue.description,
        image: venue.image,
        rating: venue.rating
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
        name: formData.name,
        city: formData.city,
        capacity: formData.capacity,
        priceperperson: formData.pricePerPerson,
        description: formData.description,
        imageurl: formData.image,
        rating: formData.rating
    };

    try {
        if (editingId) {
            await api.put(`/venues/${editingId}/`, payload);
            setVenues(prev => prev.map(v => v.id === editingId ? { ...v, ...formData, id: editingId } : v));
            alert("Zaktualizowano dane sali.");
        } else {
            const res = await api.post("/venues/", payload);
            const newVenue: VenueView = {
                ...formData,
                id: res.data.id,
            };
            setVenues(prev => [newVenue, ...prev]);
            alert("Dodano nową salę.");
        }
        setIsModalOpen(false);
    } catch (error) {
        console.error("Błąd zapisu:", error);
        alert("Wystąpił błąd podczas zapisywania danych.");
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Czy na pewno usunąć tę salę?")) return;

    const previousVenues = [...venues];
    setVenues(prev => prev.filter(v => v.id !== id));

    try {
      await api.delete(`/venues/${id}/`);
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć sali.");
      setVenues(previousVenues);
    }
  };

  const filtered = venues.filter(v => 
    v.name.toLowerCase().includes(q.toLowerCase()) || 
    v.city.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-stone-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p>Wczytuję listę sal...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Sale weselne</h1>
          <p className="text-stone-500">Zarządzaj bazą obiektów dostępnych w aplikacji.</p>
        </div>
        <Button onClick={handleAdd} className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg shadow-stone-900/20">
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
                      <img 
                        src={venue.image || "https://placehold.co/100x100?text=Brak"} 
                        alt={venue.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-stone-200"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=N/A")} 
                      />
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
                         <button 
                            onClick={() => handleEdit(venue)}
                            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                         >
                            <Pencil size={16} />
                         </button>
                         <button 
                            onClick={() => handleDelete(venue.id)} 
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                         >
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Building2 size={20} className="text-stone-400"/>
                        {editingId ? "Edytuj salę" : "Dodaj nową salę"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nazwa obiektu</label>
                        <Input 
                            required
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="np. Pałac Weselny"
                            className="bg-stone-50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Miasto</label>
                            <Input 
                                required
                                value={formData.city} 
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                placeholder="np. Kraków"
                                className="bg-stone-50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Pojemność (os.)</label>
                            <Input 
                                type="number"
                                min="0"
                                value={formData.capacity} 
                                onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                                className="bg-stone-50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Cena za osobę (PLN)</label>
                            <Input 
                                type="number"
                                min="0"
                                value={formData.pricePerPerson} 
                                onChange={e => setFormData({...formData, pricePerPerson: Number(e.target.value)})}
                                className="bg-stone-50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Ocena (0-5)</label>
                            <Input 
                                type="number"
                                min="0" max="5" step="0.1"
                                value={formData.rating} 
                                onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                                className="bg-stone-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Opis</label>
                        <Textarea 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Krótki opis sali, atuty..."
                            className="bg-stone-50 min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Link do zdjęcia (URL)</label>
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
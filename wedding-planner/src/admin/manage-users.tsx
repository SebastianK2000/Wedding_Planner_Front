import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, Loader2, X, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "../lib/api";

interface UserView {
  id: number;
  email: string;
  fullname: string;
  role: string;
  weddingdate?: string;
}

const DEFAULT_FORM = {
  email: "",
  fullname: "",
  role: "User",
  weddingdate: ""
};

export default function ManageUsers() {
  const [users, setUsers] = useState<UserView[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Błąd pobierania użytkowników:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserView) => {
    setEditingId(user.id);
    setFormData({
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        weddingdate: user.weddingdate || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
        if (editingId) {
            await api.put(`/users/${editingId}/`, formData);
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...formData, id: editingId } : u));
            alert("Zaktualizowano użytkownika.");
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
    if(!confirm("Czy na pewno usunąć tego użytkownika? To operacja nieodwracalna.")) return;

    const previous = [...users];
    setUsers(prev => prev.filter(u => u.id !== id));

    try {
      await api.delete(`/users/${id}/`);
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć użytkownika.");
      setUsers(previous);
    }
  };

  const filtered = users.filter(u => 
    u.fullname?.toLowerCase().includes(q.toLowerCase()) || 
    u.email?.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-stone-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p>Wczytuję listę użytkowników...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Użytkownicy</h1>
          <p className="text-stone-500">Zarządzaj kontami i uprawnieniami w systemie.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Szukaj po nazwisku lub emailu..." 
            value={q}
            onChange={e => setQ(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50/80 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Użytkownik</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rola</th>
                <th className="px-6 py-4">Data ślubu</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold">
                        {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={20}/>}
                      </div>
                      <div className="font-medium text-stone-900">{user.fullname || "Bez nazwy"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{user.email}</td>
                  <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {user.role === 'Admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                      {user.weddingdate ? user.weddingdate : <span className="text-stone-300 italic">-</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                         >
                            <Pencil size={16} />
                         </button>
                         <button 
                            onClick={() => handleDelete(user.id)} 
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
           <div className="p-12 text-center text-stone-500">Nie znaleziono użytkowników.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-stone-900">Edytuj użytkownika</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Imię i nazwisko</label>
                        <Input 
                            value={formData.fullname} 
                            onChange={e => setFormData({...formData, fullname: e.target.value})}
                            className="bg-stone-50"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Email</label>
                        <Input 
                            value={formData.email} 
                            disabled
                            className="bg-stone-100 text-stone-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Rola</label>
                            <Select 
                                value={formData.role} 
                                onValueChange={(val) => setFormData({...formData, role: val})}
                            >
                                <SelectTrigger className="bg-stone-50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Data ślubu</label>
                            <Input 
                                type="date"
                                value={formData.weddingdate} 
                                onChange={e => setFormData({...formData, weddingdate: e.target.value})}
                                className="bg-stone-50"
                            />
                        </div>
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
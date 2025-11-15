import { useState } from "react";
import { Search, Mail, Shield, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const USERS = [
  { id: "u1", name: "Anna Kowalska", email: "anna@example.com", role: "User", status: "Active", joined: "2024-01-15" },
  { id: "u2", name: "Jan Nowak", email: "jan@example.com", role: "User", status: "Active", joined: "2024-02-10" },
  { id: "u3", name: "Admin Admin", email: "admin@wedding.app", role: "Admin", status: "Active", joined: "2023-11-01" },
  { id: "u4", name: "Piotr Zieliński", email: "piotr@test.pl", role: "User", status: "Blocked", joined: "2024-03-05" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(USERS);
  const [q, setQ] = useState("");

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(q.toLowerCase()) || 
    u.email.toLowerCase().includes(q.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u));
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Użytkownicy</h1>
          <p className="text-stone-500">Lista zarejestrowanych kont.</p>
        </div>
        <Button className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg">
           Eksportuj CSV
        </Button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3">
         <Search className="text-stone-400 h-5 w-5" />
         <input 
            className="flex-1 bg-transparent outline-none text-sm" 
            placeholder="Szukaj użytkownika po nazwisku lub e-mailu..." 
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
                <th className="px-6 py-4">Rola</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Dołączył</th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((u) => (
                <tr key={u.id} className="group hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                        <div className="font-medium text-stone-900">{u.name}</div>
                        <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {u.email}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {u.role === "Admin" ? (
                         <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 gap-1 shadow-none">
                            <Shield size={12} /> Admin
                         </Badge>
                     ) : (
                         <span className="text-stone-600">Użytkownik</span>
                     )}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "Active" ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-rose-500"}`} />
                        {u.status === "Active" ? "Aktywny" : "Zablokowany"}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{u.joined}</td>
                  <td className="px-6 py-4 text-right">
                     {u.role !== "Admin" && (
                         <button 
                            onClick={() => toggleStatus(u.id)} 
                            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title={u.status === "Active" ? "Zablokuj" : "Odblokuj"}
                        >
                            {u.status === "Active" ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                         </button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
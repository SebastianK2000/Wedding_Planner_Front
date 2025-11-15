import { Users, DollarSign, CalendarCheck, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Pulpit nawigacyjny</h1>
        <p className="text-stone-500">Przegląd statystyk Twojej aplikacji.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Użytkownicy" value="1,240" change="+12%" icon={<Users />} />
        <StatTile label="Przychód (Msc)" value="45,200 zł" change="+5%" icon={<DollarSign />} />
        <StatTile label="Rezerwacje" value="342" change="+18%" icon={<CalendarCheck />} />
        <StatTile label="Aktywni teraz" value="54" change="" icon={<TrendingUp />} />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="font-bold text-stone-800">Ostatnie rezerwacje</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-stone-50 text-stone-500 font-medium">
               <tr>
                 <th className="px-6 py-3">Użytkownik</th>
                 <th className="px-6 py-3">Usługa</th>
                 <th className="px-6 py-3">Data</th>
                 <th className="px-6 py-3">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-stone-100">
               {[1,2,3,4,5].map((i) => (
                 <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                   <td className="px-6 py-3 font-medium">Anna Kowalska</td>
                   <td className="px-6 py-3">Sala: Dwór Pod Dębami</td>
                   <td className="px-6 py-3 text-stone-500">24.08.2025</td>
                   <td className="px-6 py-3">
                     <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        Nowa
                     </span>
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

function StatTile({ label, value, change, icon }: { label: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start justify-between">
       <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <h3 className="text-2xl font-bold text-stone-900 mt-1">{value}</h3>
          {change && <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-2 inline-block">{change}</span>}
       </div>
       <div className="p-3 bg-stone-50 text-stone-400 rounded-2xl">
          {icon}
       </div>
    </div>
  )
}
import { useEffect, useState } from "react";
import { Users, Mail, Database, TrendingUp, Loader2, MessageSquare } from "lucide-react";
import api from "../lib/api";

interface ApiMessage {
  id: number;
  sendername: string;
  topic: string;
  sentat: string;
  isread: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    messagesCount: 0,
    newsletterCount: 0,
    servicesCount: 0
  });
  const [recentMessages, setRecentMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, msgsRes, newsRes, venuesRes, musicRes, photoRes] = await Promise.allSettled([
          api.get("/users/"),
          api.get("/contact-messages/"),
          api.get("/newsletter/"),
          api.get("/venues/"),
          api.get("/music/"),
          api.get("/photographers/")
        ]);

        const users = usersRes.status === "fulfilled" ? usersRes.value.data.length : 0;
        const messages = msgsRes.status === "fulfilled" ? msgsRes.value.data : [];
        const newsletter = newsRes.status === "fulfilled" ? newsRes.value.data.length : 0;
        
        const venues = venuesRes.status === "fulfilled" ? venuesRes.value.data.length : 0;
        const music = musicRes.status === "fulfilled" ? musicRes.value.data.length : 0;
        const photo = photoRes.status === "fulfilled" ? photoRes.value.data.length : 0;

        setStats({
          usersCount: users,
          messagesCount: messages.length,
          newsletterCount: newsletter,
          servicesCount: venues + music + photo
        });

        const sortedMsgs = messages.sort((a: ApiMessage, b: ApiMessage) => 
            new Date(b.sentat).getTime() - new Date(a.sentat).getTime()
        ).slice(0, 5);
        
        setRecentMessages(sortedMsgs);

      } catch (error) {
        console.error("Błąd ładowania dashboardu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-stone-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            <p>Ładowanie statystyk...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Pulpit nawigacyjny</h1>
        <p className="text-stone-500">Przegląd statystyk Twojej aplikacji.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile 
            label="Użytkownicy" 
            value={String(stats.usersCount)} 
            change="Razem" 
            icon={<Users />} 
        />
        <StatTile 
            label="Wiadomości" 
            value={String(stats.messagesCount)} 
            change="W skrzynce" 
            icon={<Mail />} 
        />
        <StatTile 
            label="Newsletter" 
            value={String(stats.newsletterCount)} 
            change="Subskrypcje" 
            icon={<TrendingUp />} 
        />
        <StatTile 
            label="Baza Usług" 
            value={String(stats.servicesCount)} 
            change="Oferty" 
            icon={<Database />} 
        />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
            <h3 className="font-bold text-stone-800">Ostatnie wiadomości kontaktowe</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-stone-50 text-stone-500 font-medium">
               <tr>
                 <th className="px-6 py-3">Nadawca</th>
                 <th className="px-6 py-3">Temat</th>
                 <th className="px-6 py-3">Data</th>
                 <th className="px-6 py-3">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-stone-100">
               {recentMessages.length > 0 ? (
                   recentMessages.map((msg) => (
                     <tr key={msg.id} className="hover:bg-stone-50/50 transition-colors">
                       <td className="px-6 py-3 font-medium text-stone-900">{msg.sendername}</td>
                       <td className="px-6 py-3 text-stone-600">{msg.topic}</td>
                       <td className="px-6 py-3 text-stone-500">
                           {new Date(msg.sentat).toLocaleDateString("pl-PL")}
                       </td>
                       <td className="px-6 py-3">
                         <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                             msg.isread 
                             ? "bg-stone-100 text-stone-600 border-stone-200" 
                             : "bg-green-50 text-green-700 border-green-100"
                         }`}>
                           {msg.isread ? "Przeczytane" : "Nowe"}
                         </span>
                       </td>
                     </tr>
                   ))
               ) : (
                   <tr>
                       <td colSpan={4} className="px-6 py-8 text-center text-stone-500">
                           <div className="flex flex-col items-center gap-2">
                               <MessageSquare className="h-6 w-6 text-stone-300" />
                               Brak nowych wiadomości.
                           </div>
                       </td>
                   </tr>
               )}
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
          {change && <span className="text-xs font-medium text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded mt-2 inline-block border border-stone-100">{change}</span>}
       </div>
       <div className="p-3 bg-stone-50 text-stone-400 rounded-2xl">
          {icon}
       </div>
    </div>
  )
}
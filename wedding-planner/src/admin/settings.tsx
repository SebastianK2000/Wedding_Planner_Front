import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Bell, Lock, Save } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        alert("Ustawienia zapisane (mock)");
    }, 800);
  }

  const tabs = [
      { id: "profile", label: "Profil i Firma", icon: <User size={18} /> },
      { id: "notifications", label: "Powiadomienia", icon: <Bell size={18} /> },
      { id: "security", label: "Bezpieczeństwo", icon: <Lock size={18} /> },
  ] as const;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Ustawienia</h1>
        <p className="text-stone-500">Konfiguracja panelu administratora.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
          
          <div className="md:col-span-3 space-y-1">
             {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id 
                        ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200" 
                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                 >
                    {tab.icon} {tab.label}
                 </button>
             ))}
          </div>

          <div className="md:col-span-9">
             <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
                
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-stone-900">Profil Administratora</h3>
                            <p className="text-sm text-stone-500">Zmień dane widoczne w systemie.</p>
                        </div>
                        <div className="grid gap-4 max-w-md">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Imię i nazwisko</label>
                                <Input defaultValue="Sebastian Kościółek" className="bg-stone-50" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Adres e-mail</label>
                                <Input defaultValue="admin@weddingplanner.app" className="bg-stone-50" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Nazwa aplikacji</label>
                                <Input defaultValue="Wedding Planner" className="bg-stone-50" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-bold text-stone-900">Powiadomienia</h3>
                            <p className="text-sm text-stone-500">Wybierz, o czym chcesz być informowany.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-stone-100 bg-stone-50">
                                <Checkbox id="n1" defaultChecked />
                                <div>
                                    <label htmlFor="n1" className="text-sm font-medium text-stone-900 block">Nowe rejestracje użytkowników</label>
                                    <span className="text-xs text-stone-500">Powiadomienie mailowe, gdy ktoś założy nowe konto.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-stone-100 bg-stone-50">
                                <Checkbox id="n2" defaultChecked />
                                <div>
                                    <label htmlFor="n2" className="text-sm font-medium text-stone-900 block">Zgłoszenia błędów</label>
                                    <span className="text-xs text-stone-500">Gdy użytkownik wyśle formularz kontaktowy z typem "Błąd".</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-stone-100 bg-stone-50">
                                <Checkbox id="n3" />
                                <div>
                                    <label htmlFor="n3" className="text-sm font-medium text-stone-900 block">Raporty tygodniowe</label>
                                    <span className="text-xs text-stone-500">Podsumowanie statystyk w każdy poniedziałek.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-stone-900">Bezpieczeństwo</h3>
                            <p className="text-sm text-stone-500">Zarządzaj hasłem i dostępem.</p>
                        </div>
                        <div className="grid gap-4 max-w-md">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Obecne hasło</label>
                                <Input type="password" placeholder="••••••••" className="bg-stone-50" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Nowe hasło</label>
                                <Input type="password" placeholder="••••••••" className="bg-stone-50" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Powtórz nowe hasło</label>
                                <Input type="password" placeholder="••••••••" className="bg-stone-50" />
                            </div>
                        </div>
                        <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 mt-4">
                            Wyloguj ze wszystkich sesji
                        </Button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
                    <Button onClick={handleSave} disabled={loading} className="bg-stone-900 text-white hover:bg-stone-800 rounded-xl px-6">
                        {loading ? "Zapisywanie..." : <><Save className="mr-2 h-4 w-4"/> Zapisz zmiany</>}
                    </Button>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
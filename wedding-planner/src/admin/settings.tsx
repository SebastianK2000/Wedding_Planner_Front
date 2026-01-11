import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Lock, Save, Loader2, Building } from "lucide-react";
import api from "../lib/api";

interface CompanyData {
  id?: number;
  email: string;
  phone: string;
  address: string;
  workinghours: string;
  workmode: string;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"company" | "notifications" | "security">("company");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [companyForm, setCompanyForm] = useState<CompanyData>({
    email: "",
    phone: "",
    address: "",
    workinghours: "",
    workmode: ""
  });

  useEffect(() => {
    api.get("/company-info/")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCompanyForm(res.data[0]);
        }
      })
      .catch(err => console.error("Błąd pobierania ustawień:", err))
      .finally(() => setFetching(false));
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      if (activeTab === "company") {
        if (companyForm.id) {
           await api.put(`/company-info/${companyForm.id}/`, companyForm);
        } else {
           const res = await api.post("/company-info/", companyForm);
           setCompanyForm(prev => ({ ...prev, id: res.data.id }));
        }
        alert("Dane firmowe zostały zaktualizowane.");
      } else {
        await new Promise(r => setTimeout(r, 800));
        alert("Ustawienia zapisane (symulacja dla tej sekcji).");
      }
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas zapisu.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof CompanyData, value: string) => {
    setCompanyForm(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
      { id: "company", label: "Dane Firmowe", icon: <Building size={18} /> },
      { id: "notifications", label: "Powiadomienia", icon: <Bell size={18} /> },
      { id: "security", label: "Bezpieczeństwo", icon: <Lock size={18} /> },
  ] as const;

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-500 gap-2">
         <Loader2 className="animate-spin" /> Wczytuję ustawienia...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Ustawienia</h1>
        <p className="text-stone-500">Konfiguracja panelu administratora i danych globalnych.</p>
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
                
                {activeTab === "company" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-stone-900">Dane Kontaktowe Firmy</h3>
                            <p className="text-sm text-stone-500">Te dane będą widoczne w stopce i na stronie kontaktu.</p>
                        </div>
                        <div className="grid gap-4 max-w-md">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Adres e-mail (kontaktowy)</label>
                                <Input 
                                    value={companyForm.email} 
                                    onChange={e => updateField('email', e.target.value)} 
                                    placeholder="kontakt@twojafirma.pl"
                                    className="bg-stone-50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Telefon</label>
                                <Input 
                                    value={companyForm.phone} 
                                    onChange={e => updateField('phone', e.target.value)} 
                                    placeholder="+48 000 000 000"
                                    className="bg-stone-50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Adres fizyczny</label>
                                <Input 
                                    value={companyForm.address} 
                                    onChange={e => updateField('address', e.target.value)} 
                                    placeholder="ul. Ślubna 1, Kraków"
                                    className="bg-stone-50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Godziny pracy</label>
                                <Input 
                                    value={companyForm.workinghours} 
                                    onChange={e => updateField('workinghours', e.target.value)} 
                                    placeholder="Pn-Pt 9:00 - 17:00"
                                    className="bg-stone-50" 
                                />
                            </div>
                             <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Tryb pracy (info dodatkowe)</label>
                                <Input 
                                    value={companyForm.workmode} 
                                    onChange={e => updateField('workmode', e.target.value)} 
                                    placeholder="np. Pracujemy zdalnie"
                                    className="bg-stone-50" 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-bold text-stone-900">Powiadomienia</h3>
                            <p className="text-sm text-stone-500">Wybierz, o czym chcesz być informowany (symulacja).</p>
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
                        </div>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-stone-900">Bezpieczeństwo</h3>
                            <p className="text-sm text-stone-500">Zarządzaj hasłem (funkcja niedostępna w API).</p>
                        </div>
                        <div className="grid gap-4 max-w-md opacity-50 pointer-events-none">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Obecne hasło</label>
                                <Input type="password" placeholder="••••••••" className="bg-stone-50" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-stone-700">Nowe hasło</label>
                                <Input type="password" placeholder="••••••••" className="bg-stone-50" />
                            </div>
                        </div>
                        <p className="text-xs text-amber-600 font-medium">
                            Zmiana hasła jest obecnie możliwa tylko przez panel administratora Django (/admin).
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
                    <Button onClick={handleSave} disabled={loading} className="bg-stone-900 text-white hover:bg-stone-800 rounded-xl px-6">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Zapisywanie...</> : <><Save className="mr-2 h-4 w-4"/> Zapisz zmiany</>}
                    </Button>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { 
  Target, 
  CalendarDays, 
  Wallet, 
  MessageSquare, 
  Clock, 
  ShieldAlert, 
  Mail, 
  Palette, 
  CheckSquare, 
  ArrowRight 
} from "lucide-react";

export default function Guide() {
  const baseCard = "bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 transition-all hover:shadow-md";

  const btnPrimary =
    "inline-flex items-center gap-2 justify-center rounded-2xl px-5 py-2.5 text-sm font-bold " +
    "bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 transition-all transform active:scale-95";
  
  const btnGhost =
    "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium " +
    "border border-brand-200 bg-brand-50 text-stone-700 hover:bg-brand-100 transition-colors";

  const menuItems = [
    { id: "strategia", label: "1. Strategia i cele", icon: <Target size={16} /> },
    { id: "harmonogram", label: "2. Harmonogram", icon: <CalendarDays size={16} /> },
    { id: "budzet", label: "3. Budżet i koszty", icon: <Wallet size={16} /> },
    { id: "dostawcy", label: "4. Pytania do dostawców", icon: <MessageSquare size={16} /> },
    { id: "dzien-slubu", label: "5. Dzień ślubu", icon: <Clock size={16} /> },
    { id: "plan-b", label: "6. Plan awaryjny", icon: <ShieldAlert size={16} /> },
    { id: "komunikacja", label: "7. Komunikacja i RSVP", icon: <Mail size={16} /> },
    { id: "stylistyka", label: "8. Stylistyka", icon: <Palette size={16} /> },
    { id: "checklisty", label: "9. Checklisty", icon: <CheckSquare size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
      
      <aside className="col-span-12 md:col-span-3 hidden md:block">
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sticky top-24 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider px-3 mb-3">Spis treści</h2>
          <nav className="space-y-1">
            {menuItems.map(({ id, label, icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-brand-50 hover:text-accent-600 transition-colors"
              >
                <span className="text-stone-400">{icon}</span>
                {label}
              </a>
            ))}
          </nav>
          
          <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
            <Link to="/zadania" className="flex items-center justify-center w-full rounded-xl bg-accent-50 text-accent-700 px-4 py-3 text-sm font-bold hover:bg-accent-100 transition-colors">
              Moje Zadania <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link to="/budzet" className="flex items-center justify-center w-full rounded-xl border border-stone-200 text-stone-600 px-4 py-3 text-sm font-medium hover:bg-stone-50 transition-colors">
              Mój Budżet
            </Link>
          </div>
        </div>
      </aside>

      <main className="col-span-12 md:col-span-9 space-y-8">
        
        <section className="bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-100 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Planowanie wesela – <span className="text-accent-600">krok po kroku</span>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-3xl">
            Spójna strategia, realny budżet i jasne role to klucz do sukcesu. 
            Poniżej znajdziesz kompletny przewodnik, harmonogramy oraz gotowe listy kontrolne, 
            które pomogą Ci zapanować nad każdym detalem.
          </p>
        </section>

        <section id="strategia" className={baseCard}>
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-accent-100 text-accent-600 rounded-xl"><Target size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">1. Strategia i cele</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-stone-50 p-5 border border-stone-100">
              <p className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-accent-500"></span> Priorytety
              </p>
              <ul className="space-y-2 text-sm text-stone-600 pl-4 list-disc marker:text-stone-300">
                <li><strong>Klimat:</strong> rustykalny / glamour / boho / modern</li>
                <li><strong>Skala:</strong> kameralne przyjęcie vs wielkie wesele</li>
                <li><strong>Budżet:</strong> sztywne ramy vs elastyczność</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-stone-50 p-5 border border-stone-100">
              <p className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-accent-500"></span> Podział ról
              </p>
              <ul className="space-y-2 text-sm text-stone-600 pl-4 list-disc marker:text-stone-300">
                <li>Kto podejmuje ostateczne decyzje?</li>
                <li>Kto płaci za poszczególne elementy?</li>
                <li>Jeden główny koordynator w dniu ślubu (np. świadek)</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="harmonogram" className={baseCard}>
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><CalendarDays size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">2. Harmonogram (Oś czasu)</h3>
          </div>

          <div className="space-y-6 relative pl-4">
            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-stone-100" />
            {[
              {
                title: "12–9 miesięcy przed",
                color: "bg-blue-500",
                items: [
                  "Określenie budżetu i wstępnej listy gości.",
                  <>Rezerwacja <Link className="text-accent-600 hover:underline font-medium" to="/sala-weselna">sali weselnej</Link> (data, zaliczka).</>,
                  <>Wybór <Link className="text-accent-600 hover:underline font-medium" to="/fotograf">fotografa</Link> i zespołu/DJ.</>,
                  "Stworzenie moodboardu inspiracji.",
                ],
              },
              {
                title: "9–6 miesięcy przed",
                color: "bg-indigo-500",
                items: [
                  "Wybór florysty i dekoracji, wstępne menu.",
                  "Rezerwacja transportu dla gości.",
                  "Sesja narzeczeńska (opcjonalnie).",
                  "Wysłanie Save-the-date.",
                ],
              },
              {
                title: "6–3 miesiące przed",
                color: "bg-purple-500",
                items: [
                  "Degustacja menu i wybór tortu.",
                  "Plan atrakcji: pierwszy taniec, podziękowania.",
                  "Ustalenia techniczne z obsługą (sprzęt, noclegi).",
                ],
              },
              {
                title: "3–1 miesiąc przed",
                color: "bg-fuchsia-500",
                items: [
                  "Rozsadzenie gości przy stołach.",
                  "Potwierdzenie ostatecznej liczby osób (RSVP).",
                  "Przygotowanie Planu B (pogoda/awarie).",
                ],
              },
              {
                title: "Ostatnie 30 dni",
                color: "bg-rose-500",
                items: [
                  "Potwierdzenie godzin z podwykonawcami.",
                  "Spakowanie niezbędnika (obrączki, dokumenty).",
                  "Przekazanie listy kontaktów świadkom.",
                ],
              },
            ].map(({ title, color, items }, idx) => (
              <div key={idx} className="relative flex gap-4 items-start group">
                <div className={`mt-1.5 w-3 h-3 rounded-full ring-4 ring-white z-10 ${color}`} />
                <div className="flex-1 pb-2">
                   <h4 className="font-bold text-stone-800 mb-2">{title}</h4>
                   <ul className="list-disc pl-5 text-sm text-stone-600 space-y-1 marker:text-stone-300">
                      {items.map((it, i) => <li key={i}>{it}</li>)}
                   </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-stone-100">
            <Link to="/harmonogram" className={btnPrimary}>Przejdź do interaktywnego Harmonogramu</Link>
          </div>
        </section>

        <section id="budzet" className={baseCard}>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-green-100 text-green-600 rounded-xl"><Wallet size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">3. Budżet i koszty</h3>
          </div>
          <p className="text-stone-600 mb-6">
            Zawsze zakładaj <strong>bufor bezpieczeństwa (10–15%)</strong> na nieprzewidziane wydatki. 
            Pamiętaj o "ukrytych" kosztach: napiwki, korkowe, poprawki krawieckie.
          </p>
          
          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-stone-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Kategoria</th>
                  <th className="py-3 px-4">Orientacyjny koszt</th>
                  <th className="py-3 px-4">Na co zwrócić uwagę?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr><td className="py-3 px-4 font-medium">Talerzyk (Menu)</td><td className="py-3 px-4 text-stone-500">250–450 zł / os.</td><td className="py-3 px-4">Czy napoje/alkohol są w cenie?</td></tr>
                <tr><td className="py-3 px-4 font-medium">DJ / Zespół</td><td className="py-3 px-4 text-stone-500">4–9 tys. zł</td><td className="py-3 px-4">Nagłośnienie, oświetlenie, ZAiKS.</td></tr>
                <tr><td className="py-3 px-4 font-medium">Foto + Video</td><td className="py-3 px-4 text-stone-500">6–12 tys. zł</td><td className="py-3 px-4">Liczba godzin, dron, teledysk.</td></tr>
                <tr><td className="py-3 px-4 font-medium">Dekoracje</td><td className="py-3 px-4 text-stone-500">3–10 tys. zł</td><td className="py-3 px-4">Żywe kwiaty są najdroższe.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link to="/budzet" className={btnGhost}>Otwórz kalkulator Budżetu</Link>
          </div>
        </section>

        <section id="dostawcy" className={baseCard}>
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl"><MessageSquare size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">4. O co pytać dostawców?</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Sala weselna", "Co zawiera cena? Do której godziny trwa zabawa? Czy jest agregat prądotwórczy? Jakie są opłaty za korkowe/tortowe?"],
              ["Muzyka", "Ile trwają bloki muzyczne a ile przerwy? Czy zapewniacie własne oświetlenie? Jakie macie wymagania techniczne?"],
              ["Fotograf", "Jaki jest czas oczekiwania na zdjęcia? Czy macie zapasowy sprzęt? Co w przypadku choroby w dniu ślubu?"],
              ["Transport", "Czy kierowca zna trasę? Czy busy mają klimatyzację? Jak wygląda kwestia nadgodzin?"],
            ].map(([head, text], i) => (
              <div key={i} className="rounded-2xl bg-stone-50 p-5 border border-stone-100 hover:border-stone-200 transition-colors">
                <h4 className="font-bold text-stone-800 mb-2">{head}</h4>
                <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="dzien-slubu" className={baseCard}>
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-xl"><Clock size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">5. Ramowy plan dnia</h3>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4">
             <div className="p-4 rounded-2xl border border-stone-200 text-center">
                <div className="text-2xl font-bold text-accent-500 mb-1">09:00</div>
                <div className="text-sm font-medium text-stone-700">Przygotowania</div>
                <div className="text-xs text-stone-500 mt-1">Fryzura, makijaż, śniadanie</div>
             </div>
             <div className="p-4 rounded-2xl border border-stone-200 text-center">
                <div className="text-2xl font-bold text-accent-500 mb-1">13:00</div>
                <div className="text-sm font-medium text-stone-700">First Look</div>
                <div className="text-xs text-stone-500 mt-1">Błogosławieństwo, zdjęcia</div>
             </div>
             <div className="p-4 rounded-2xl border border-stone-200 text-center bg-brand-50">
                <div className="text-2xl font-bold text-accent-600 mb-1">15:00</div>
                <div className="text-sm font-medium text-stone-800">Ceremonia</div>
                <div className="text-xs text-stone-600 mt-1">To ta chwila! ❤️</div>
             </div>
             <div className="p-4 rounded-2xl border border-stone-200 text-center">
                <div className="text-2xl font-bold text-accent-500 mb-1">17:00</div>
                <div className="text-sm font-medium text-stone-700">Przyjazd na salę</div>
                <div className="text-xs text-stone-500 mt-1">Toast, życzenia, obiad</div>
             </div>
             <div className="p-4 rounded-2xl border border-stone-200 text-center">
                <div className="text-2xl font-bold text-accent-500 mb-1">19:00</div>
                <div className="text-sm font-medium text-stone-700">Pierwszy taniec</div>
                <div className="text-xs text-stone-500 mt-1">Start zabawy</div>
             </div>
             <div className="p-4 rounded-2xl border border-stone-200 text-center">
                <div className="text-2xl font-bold text-accent-500 mb-1">22:00</div>
                <div className="text-sm font-medium text-stone-700">Tort & Oczepiny</div>
                <div className="text-xs text-stone-500 mt-1">Atrakcje wieczoru</div>
             </div>
          </div>
        </section>

        <section id="plan-b" className={baseCard}>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl"><ShieldAlert size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">6. Plan awaryjny (B)</h3>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
             <h4 className="font-bold text-rose-800 mb-2">Co może pójść nie tak?</h4>
             <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5 text-sm text-rose-900/80">
                <li><strong>Pogoda:</strong> Przygotujcie parasole (nawet ładne, do zdjęć) i namiot w razie pleneru.</li>
                <li><strong>Zdrowie:</strong> Apteczka z lekami przeciwbólowymi, plastry na odciski.</li>
                <li><strong>Awaria prądu:</strong> Upewnij się, że sala/zespół ma agregat.</li>
                <li><strong>Strój:</strong> Zapasowa koszula dla Pana Młodego, wygodne buty dla Panny Młodej.</li>
             </ul>
          </div>
        </section>

        <section id="checklisty" className={baseCard}>
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl"><CheckSquare size={24} /></div>
             <h3 className="text-xl font-bold text-stone-900">8. Niezbędnik w dniu ślubu (Go-bag)</h3>
          </div>
          
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
             <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Dowody osobiste</div>
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Obrączki</div>
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Gotówka (koperty)</div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Powerbank + kabel</div>
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Bibułki matujące</div>
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Lakier do włosów</div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Igła i nitka</div>
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Agrafki</div>
                   <div className="flex items-center gap-2 text-sm text-stone-700"><span className="w-4 h-4 rounded border bg-white flex items-center justify-center text-accent-500">✓</span> Woda i batonik</div>
                </div>
             </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
             <Link to="/zadania" className={btnPrimary}>
                Przejdź do moich Zadań
             </Link>
             <Link to="/goscie" className={btnGhost}>
                Zarządzaj Listą Gości
             </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
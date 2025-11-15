import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Check, ThumbsUp, ThumbsDown, Search, ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

type FaqItem = {
  id: string;
  cat: FaqCategory;
  q: string;
  a: string;
};

type FaqCategory =
  | "Ogólne"
  | "Rezerwacje"
  | "Budżet i płatności"
  | "Goście / RSVP"
  | "Transport"
  | "Prywatność i techniczne";

const CATS: FaqCategory[] = [
  "Ogólne",
  "Rezerwacje",
  "Budżet i płatności",
  "Goście / RSVP",
  "Transport",
  "Prywatność i techniczne",
];

const FAQ: FaqItem[] = [
  {
    id: "f1",
    cat: "Ogólne",
    q: "Czym jest Wedding Planner i dla kogo jest przeznaczony?",
    a: "To aplikacja do planowania wesela — w jednym miejscu ogarniasz salę, muzykę, fotografa, florystę, transport, gości, budżet i zadania. Sprawdzi się zarówno przy małych przyjęciach, jak i dużych weselach z wieloma dostawcami.",
  },
  {
    id: "f2",
    cat: "Ogólne",
    q: "Czy muszę tworzyć konto, aby korzystać?",
    a: "Na start nie — część danych zapisujemy lokalnie w Twojej przeglądarce (localStorage). Gdy dodamy logowanie, będziesz mógł/mogła przenieść dane na konto jednym kliknięciem.",
  },
  {
    id: "f3",
    cat: "Ogólne",
    q: "Czy mogę współdzielić plan z narzeczonym/ą lub rodziną?",
    a: "Tak, nasz plan zakłada tryb współpracy. W obecnej wersji możesz ręcznie eksportować CSV (Budżet, Goście) i udostępniać. W wersji z kontem umożliwimy współdzielenie w czasie rzeczywistym.",
  },
  {
    id: "f4",
    cat: "Rezerwacje",
    q: "Jak dodać ofertę fotografa/florysty/muzyki do planu?",
    a: "Wejdź w odpowiednią kartę (Fotograf/Florysta/Muzyka) i kliknij „Dodaj”. Pozycja zapisze się w planie (lokalnie). W podglądzie oferty masz też „Idź do oferty” oraz modal ze szczegółami.",
  },
  {
    id: "f5",
    cat: "Rezerwacje",
    q: "Czy mogę zapisywać terminy?",
    a: "Tak — w ofertach przewidzieliśmy pola terminów, a dodatkowo w Zadaniach możesz ustawiać konkretne daty i priorytety. Planuj etapy rezerwacji i oznaczaj statusy.",
  },
  {
    id: "f6",
    cat: "Budżet i płatności",
    q: "Jak działa moduł budżetu?",
    a: "Dodajesz pozycje z kategorią, planowaną oraz rzeczywistą kwotą, notatkami i statusem opłacenia. Masz sumy (Plan/Rzeczywiste/Pozostało), filtry, eksport CSV i zapisywanie w przeglądarce.",
  },
  {
    id: "f7",
    cat: "Budżet i płatności",
    q: "Czy aplikacja obsługuje płatności online?",
    a: "Nie — aplikacja nie przetwarza płatności. Budżet to planer wydatków; realne opłaty wykonujesz bezpośrednio u dostawców.",
  },
  {
    id: "f8",
    cat: "Goście / RSVP",
    q: "Jak zarządzać RSVP i stolikami?",
    a: "W Gościach masz 60 przykładowych rekordów, filtry statusów (Potwierdzone/Oczekuje/Odmowa), szybkie zmiany statusu, przypisania do stolików i eksport CSV.",
  },
  {
    id: "f9",
    cat: "Goście / RSVP",
    q: "Czy mogę dodać informacje o diecie i +1?",
    a: "Tak. Rekord gościa zawiera dietę, pole +1 oraz notatki (np. alergie, preferencje).",
  },
  {
    id: "f10",
    cat: "Transport",
    q: "Jak zaplanować logistykę dojazdu i busy?",
    a: "W Transporcie masz planer pojemności (sugeruje miks busów dla liczby gości), katalog przewoźników oraz podstronę oferty z prostym formularzem rezerwacji (mock).",
  },
  {
    id: "f11",
    cat: "Transport",
    q: "Czy rezerwacja transportu w aplikacji jest wiążąca?",
    a: "Nie — formularz ma charakter roboczy. Finalną rezerwację ustalasz z przewoźnikiem (telefon, e-mail, umowa).",
  },
  {
    id: "f12",
    cat: "Prywatność i techniczne",
    q: "Gdzie przechowywane są moje dane?",
    a: "Lokalnie w przeglądarce (localStorage). To oznacza, że pozostają na Twoim urządzeniu i nie są wysyłane na serwer. Pamiętaj: czyszczenie danych przeglądarki usunie zapis.",
  },
  {
    id: "f13",
    cat: "Prywatność i techniczne",
    q: "Czy mogę wyeksportować dane?",
    a: "Tak — sekcje Budżet/Goście/Transport mają eksport CSV. Dzięki temu łatwo przeniesiesz informacje do arkuszy czy podzielisz się z rodziną.",
  },
  {
    id: "f14",
    cat: "Ogólne",
    q: "Jak zgłosić błąd lub propozycję funkcji?",
    a: "Napisz do nas przez zakładkę Kontakt lub wyślij e-mail: kontakt@weddingplanner.app. Każdy feedback jest mile widziany!",
  },
  {
    id: "f15",
    cat: "Rezerwacje",
    q: "Czy mogę dodawać własnych dostawców?",
    a: "Tak — w każdej karcie możesz tworzyć własne wpisy (np. notatki, zadania, budżet). W kolejnych wersjach dodamy katalogi użytkownika.",
  },
  {
    id: "f16",
    cat: "Budżet i płatności",
    q: "Jak oznaczyć zaliczkę i rozliczenie końcowe?",
    a: "W Budżecie wykorzystaj status „opłacone” oraz notatki z datą i formą płatności. Możesz też rozbić pozycję na zaliczkę i resztę (duplikuj + edytuj).",
  },
  {
    id: "f17",
    cat: "Prywatność i techniczne",
    q: "Czy aplikacja działa offline?",
    a: "Tak — po wczytaniu strony możesz pracować bez połączenia. Dane zapisują się lokalnie i zsynchronizują, gdy dodamy logowanie.",
  },
];

const VOTES_KEY = "wp_faq_votes";

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<FaqCategory | "Wszystkie">("Wszystkie");
  const [open, setOpen] = useState<string | null>(FAQ[0].id);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>(() => {
    try {
      const raw = localStorage.getItem(VOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  }, [votes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ.filter((i) => {
      const okCat = cat === "Wszystkie" ? true : i.cat === cat;
      const okQ =
        q.length === 0 ||
        i.q.toLowerCase().includes(q) ||
        i.a.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [query, cat]);

  const jsonLd = useMemo(() => {
    const items = filtered.slice(0, 30).map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: i.a,
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items,
    };
  }, [filtered]);

  const chip = "px-4 py-2 rounded-full border text-sm font-medium border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all whitespace-nowrap";
  const chipActive = "px-4 py-2 rounded-full border text-sm font-medium border-stone-800 bg-stone-800 text-white shadow-md transition-all whitespace-nowrap";

  return (
    <div className="min-h-screen bg-stone-50/50 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-6 py-8">
           <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full text-rose-600 mb-2">
              <HelpCircle className="h-8 w-8" />
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
             Jak możemy Ci pomóc?
           </h1>
           <p className="text-stone-500 max-w-lg mx-auto">
             Przeszukaj naszą bazę wiedzy, aby znaleźć odpowiedzi na pytania dotyczące planowania wesela.
           </p>

           <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Wpisz pytanie (np. budżet, goście)..."
                className="w-full h-14 rounded-2xl border border-stone-200 pl-12 pr-4 shadow-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all bg-white"
              />
           </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setCat("Wszystkie")} className={cat === "Wszystkie" ? chipActive : chip}>
              Wszystkie
            </button>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cat === c ? chipActive : chip}>
                {c}
              </button>
            ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-200">
               <div className="mx-auto h-12 w-12 text-stone-300 mb-3"><Search className="h-full w-full"/></div>
               <h3 className="text-lg font-semibold text-stone-900">Brak wyników</h3>
               <p className="text-stone-500">Spróbuj wpisać inne słowa kluczowe lub zmień kategorię.</p>
            </div>
          ) : (
             <div className="grid gap-4">
                {filtered.map((item) => {
                  const isOpen = open === item.id;
                  const voted = votes[item.id];
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`group rounded-3xl border bg-white transition-all duration-300 ${isOpen ? "border-rose-200 shadow-lg shadow-rose-100 ring-1 ring-rose-100" : "border-stone-200 hover:border-stone-300"}`}
                    >
                      <button
                        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none"
                        aria-expanded={isOpen}
                        onClick={() => setOpen((o) => (o === item.id ? null : item.id))}
                      >
                        <div>
                          <div className={`text-base md:text-lg font-semibold transition-colors ${isOpen ? "text-rose-900" : "text-stone-800 group-hover:text-stone-900"}`}>
                            {item.q}
                          </div>
                          <div className="text-xs font-medium text-stone-400 mt-1 uppercase tracking-wide">{item.cat}</div>
                        </div>
                        <span className={`shrink-0 mt-1 transition-transform duration-300 ${isOpen ? "rotate-180 text-rose-500" : "text-stone-400"}`}>
                          <ChevronDown size={24} />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          <p className="text-stone-600 leading-relaxed text-lg">
                            {item.a}
                          </p>

                          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-stone-50 p-4 border border-stone-100">
                            <span className="text-sm font-medium text-stone-600">Czy ta odpowiedź była pomocna?</span>
                            <div className="flex gap-2">
                              <button
                                className={
                                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all " +
                                  (voted === "up"
                                    ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100")
                                }
                                onClick={() => setVotes((v) => ({ ...v, [item.id]: v[item.id] === "up" ? undefined! : "up" }))}
                              >
                                <ThumbsUp size={16} className={voted === "up" ? "fill-current" : ""} /> Tak
                              </button>
                              <button
                                className={
                                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all " +
                                  (voted === "down"
                                    ? "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100")
                                }
                                onClick={() => setVotes((v) => ({ ...v, [item.id]: v[item.id] === "down" ? undefined! : "down" }))}
                              >
                                <ThumbsDown size={16} className={voted === "down" ? "fill-current" : ""} /> Nie
                              </button>
                              {voted && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-stone-500 animate-in fade-in">
                                  <Check size={14} className="text-green-500" /> Dziękujemy!
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          )}
        </div>

        <div className="mt-12 rounded-3xl bg-stone-900 p-8 md:p-12 text-center text-white shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nadal masz pytania?</h2>
            <p className="text-stone-300 max-w-md mx-auto mb-8">
              Jeśli nie znalazłeś odpowiedzi powyżej, skontaktuj się z nami bezpośrednio.
            </p>
            <NavLink 
              to="/kontakt" 
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-stone-900 px-8 py-4 font-bold hover:bg-stone-100 transition-transform hover:scale-105 active:scale-95"
            >
              Napisz do nas
            </NavLink>
        </div>

      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Check, ThumbsUp, ThumbsDown, Search, ChevronDown, HelpCircle, MessageCircle, Loader2 } from "lucide-react";
import api from "../lib/api";

type FaqCategoryItem = {
  id: number;
  name: string;
};

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  categoryid?: number;
};

type FaqViewItem = {
  id: string; 
  catName: string;
  q: string;
  a: string;
};

const VOTES_KEY = "wp_faq_votes";

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("Wszystkie");
  const [open, setOpen] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<FaqCategoryItem[]>([]);
  const [questions, setQuestions] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, itemsRes] = await Promise.all([
          api.get("/faq-categories/"),
          api.get("/faq-items/")
        ]);

        console.log("Kategorie FAQ:", catsRes.data);
        console.log("Pytania FAQ:", itemsRes.data);

        setCategories(catsRes.data);
        setQuestions(itemsRes.data);
        
      } catch (error) {
        console.error("Błąd pobierania FAQ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const faqList: FaqViewItem[] = useMemo(() => {
    return questions.map(q => {
      const cat = categories.find(c => c.id === q.categoryid);
      return {
        id: String(q.id),
        catName: cat ? cat.name : "Inne",
        q: q.question,
        a: q.answer
      };
    });
  }, [questions, categories]);

  const categoryNames = useMemo(() => ["Wszystkie", ...categories.map(c => c.name)], [categories]);

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
    const qLower = query.trim().toLowerCase();
    return faqList.filter((i) => {
      const okCat = activeCat === "Wszystkie" ? true : i.catName === activeCat;
      const okQ =
        qLower.length === 0 ||
        i.q.toLowerCase().includes(qLower) ||
        i.a.toLowerCase().includes(qLower);
      return okCat && okQ;
    });
  }, [query, activeCat, faqList]);

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

  if (loading) {
      return (
        <div className="min-h-screen bg-stone-50/50 flex flex-col items-center justify-center p-8">
            <Loader2 className="h-10 w-10 animate-spin text-rose-500 mb-4" />
            <p className="text-stone-500 font-medium">Ładowanie bazy wiedzy...</p>
        </div>
      )
  }

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
            {categoryNames.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={activeCat === c ? chipActive : chip}>
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
                          <div className="text-xs font-medium text-stone-400 mt-1 uppercase tracking-wide">{item.catName}</div>
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
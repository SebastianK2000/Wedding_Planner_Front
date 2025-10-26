import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Check, ThumbsUp, ThumbsDown, Search } from "lucide-react";

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

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2";
  const btnSecondary =
    baseBtn + " border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";
  const chip =
    "px-3 py-2 rounded-xl border text-sm border-stone-200 text-stone-700 hover:bg-stone-50";
  const chipActive =
    "px-3 py-2 rounded-xl text-sm border-brand-300 bg-brand-100 text-stone-900 shadow-inner";

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">FAQ</h1>
          <p className="text-stone-600">Najczęstsze pytania o Wedding Planner.</p>
        </div>
        <NavLink to="/kontakt" className={btnSecondary}>
          Nie znalazłeś odpowiedzi? Napisz do nas
        </NavLink>
      </div>

      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="grid md:grid-cols-[1fr,auto] gap-3">
          <label className="relative block">
            <span className="sr-only">Szukaj</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wpisz pytanie lub słowo kluczowe…"
              className="w-full rounded-xl border border-stone-300 px-9 py-2 bg-white"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCat("Wszystkie")}
              className={cat === "Wszystkie" ? chipActive : chip}
            >
              Wszystkie
            </button>
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cat === c ? chipActive : chip}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-stone-200/60 divide-y">
        {filtered.map((item) => {
          const isOpen = open === item.id;
          const voted = votes[item.id];
          return (
            <section key={item.id}>
              <button
                className="w-full text-left px-4 py-4 md:py-5 flex items-start justify-between gap-4 hover:bg-stone-50"
                aria-expanded={isOpen}
                onClick={() => setOpen((o) => (o === item.id ? null : item.id))}
              >
                <div>
                  <div className="text-sm font-semibold">{item.q}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{item.cat}</div>
                </div>
                <span
                  className={
                    "shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border " +
                    (isOpen ? "bg-brand-100 border-brand-300" : "border-stone-300")
                  }
                  aria-hidden
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 md:pb-5">
                  <p className="text-stone-700">{item.a}</p>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-stone-500">Czy to było pomocne?</span>
                    <button
                      className={
                        "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 " +
                        (voted === "up"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50")
                      }
                      onClick={() =>
                        setVotes((v) => ({ ...v, [item.id]: v[item.id] === "up" ? undefined! : "up" }))
                      }
                    >
                      <ThumbsUp size={14} /> Tak
                    </button>
                    <button
                      className={
                        "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 " +
                        (voted === "down"
                          ? "bg-rose-50 border-rose-200 text-rose-700"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50")
                      }
                      onClick={() =>
                        setVotes((v) => ({ ...v, [item.id]: v[item.id] === "down" ? undefined! : "down" }))
                      }
                    >
                      <ThumbsDown size={14} /> Nie
                    </button>
                    {voted && (
                      <span className="ml-1 inline-flex items-center gap-1 text-xs text-stone-500">
                        <Check size={14} /> Dziękujemy!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-6 text-center text-stone-500">
            Brak wyników. Spróbuj innego słowa lub wybierz inną kategorię.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div>
            <div className="text-sm font-semibold">Masz inne pytanie?</div>
            <div className="text-sm text-stone-600">
              Napisz do nas — odpowiadamy możliwie szybko.
            </div>
          </div>
          <NavLink to="/kontakt" className={btnSecondary}>
            Przejdź do kontaktu
          </NavLink>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, 
  BookOpen, 
  Cookie, 
  ArrowLeft, 
  Scale 
} from "lucide-react";

export default function LegalAll() {

  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const btnSecondary = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium border border-brand-200 bg-white text-stone-700 hover:bg-brand-50 transition-colors";

  const menuItems = [
    { id: "polityka-prywatnosci", label: "1. Polityka prywatności", icon: <Shield size={16} /> },
    { id: "regulamin", label: "2. Regulamin", icon: <BookOpen size={16} /> },
    { id: "cookies", label: "3. Cookies", icon: <Cookie size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
      
      <aside className="col-span-12 md:col-span-3">
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sticky top-24 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider px-3 mb-3 flex items-center gap-2">
             <Scale size={16} /> Informacje
          </h2>
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
          
          <div className="mt-6 pt-6 border-t border-stone-100">
            <Link to="/" className={`${btnSecondary} w-full justify-center`}>
              <ArrowLeft size={16} className="mr-2" /> Wróć do strony głównej
            </Link>
          </div>
        </div>
      </aside>

      <main className="col-span-12 md:col-span-9 space-y-8">
        
        <section className="bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-100 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Informacje prawne
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-3xl">
            Zwięzła i czytelna wersja: prywatność, regulamin oraz cookies w jednym miejscu.
            Wszystko, co musisz wiedzieć o działaniu aplikacji.
          </p>
        </section>

        <Section id="polityka-prywatnosci" title="Polityka prywatności" icon={<Shield size={24} className="text-blue-600" />} iconBg="bg-blue-100">
          <ThreeCols
            items={[
              {
                title: "Co zbieramy",
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Dane planu (to, co wpisujesz w aplikacji).</li>
                    <li>Dane kontaktowe (jeśli podasz w formularzu).</li>
                    <li>Ustawienia aplikacji (lokalnie).</li>
                  </ul>
                ),
              },
              {
                title: "Po co",
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Realizacja funkcji planera wesel.</li>
                    <li>Kontakt zwrotny na Twoją prośbę.</li>
                  </ul>
                ),
              },
              {
                title: "Gdzie trzymamy",
                content: (
                  <p>
                    W wersji demo <strong>na Twoim urządzeniu</strong> (localStorage). Czyszczenie danych
                    przeglądarki usuwa zapis.
                  </p>
                ),
              },
            ]}
          />

          <Card title="Podstawy prawne (RODO)">
            <ul className="list-disc pl-5 space-y-1">
              <li>Funkcje aplikacji – art. 6 ust. 1 lit. b.</li>
              <li>Kontakt/newsletter (opcjonalnie) – art. 6 ust. 1 lit. a.</li>
              <li>Bezpieczeństwo/obsługa błędów – art. 6 ust. 1 lit. f.</li>
            </ul>
          </Card>

          <Card title="Twoje prawa">
            <p className="text-sm">
              Dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, wycofanie zgody. W demo część zrealizujesz
              samodzielnie (np. usunięcie danych przez wyczyszczenie localStorage).
            </p>
          </Card>

          <Card title="Administrator i kontakt">
            <p className="text-sm">
              <strong>Wedding Planner (projekt edukacyjny)</strong><br />
              e-mail: <a className="underline font-medium text-accent-600 hover:text-accent-700" href="mailto:kontakt@weddingplanner.app">kontakt@weddingplanner.app</a>
            </p>
          </Card>
        </Section>

        <Section id="regulamin" title="Regulamin" icon={<BookOpen size={24} className="text-green-600" />} iconBg="bg-green-100">
          <Card title="1. Postanowienia ogólne">
            <ul className="list-disc pl-5 space-y-1">
              <li>„Aplikacja” – serwis planowania wesela (wersja demonstracyjna).</li>
              <li>Korzystanie z Aplikacji jest dobrowolne i bezpłatne.</li>
              <li>Wersja demo nie świadczy usług płatniczych ani nie pośredniczy w rezerwacjach.</li>
            </ul>
          </Card>

          <Card title="2. Zakres funkcjonalny">
            <ul className="list-disc pl-5 space-y-1">
              <li>Moduły: sala, muzyka, fotograf, florysta, transport, goście, budżet, zadania itd.</li>
              <li>Zapisy lokalne w przeglądarce, eksport CSV, podglądy ofert (mock).</li>
            </ul>
          </Card>

          <Card title="3. Odpowiedzialność">
            <ul className="list-disc pl-5 space-y-1">
              <li>Dane ofert i rezerwacji mają charakter poglądowy (mock).</li>
              <li>Administrator nie odpowiada za decyzje podjęte na podstawie danych demo.</li>
              <li>Użytkownik odpowiada za wprowadzone treści oraz kopie zapasowe danych lokalnych.</li>
            </ul>
          </Card>

          <Card title="4. Prawa autorskie">
            <p className="text-sm">
              Materiały w Aplikacji (UI, teksty, grafiki) są chronione. Nie kopiuj bez zgody właściciela.
            </p>
          </Card>

          <Card title="5. Kontakt i reklamacje">
            <p className="text-sm">
              Zgłoszenia techniczne i uwagi:{" "}
              <a className="underline font-medium text-accent-600 hover:text-accent-700" href="mailto:kontakt@weddingplanner.app">
                kontakt@weddingplanner.app
              </a>
              . Postaramy się odpowiedzieć w 24–48h roboczych.
            </p>
          </Card>
        </Section>

        <Section id="cookies" title="Cookies" icon={<Cookie size={24} className="text-amber-600" />} iconBg="bg-amber-100">
          <Card title="Co to są cookies?">
            <p className="text-sm">
              Małe pliki zapisywane w Twojej przeglądarce, pozwalające zapamiętać ustawienia i utrzymać wygodę pracy.
            </p>
          </Card>

          <Card title="Jakie cookies stosujemy">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Niezbędne</strong> – dla działania interfejsu i zapisów lokalnych.</li>
              <li>Brak analitycznych i marketingowych w wersji demo.</li>
            </ul>
          </Card>

          <Card title="Zarządzanie cookies">
            <p className="text-sm">
              Możesz usuwać/ograniczać cookies w ustawieniach przeglądarki. Pamiętaj, że może to wpłynąć na działanie Aplikacji.
            </p>
          </Card>
        </Section>

      </main>
    </div>
  );
}

function Section({ id, title, children, icon, iconBg }: { id: string; title: string; children: React.ReactNode; icon: React.ReactNode; iconBg: string }) {
  return (
    <section id={id} className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
         <div className={`p-2.5 ${iconBg} rounded-xl`}>{icon}</div>
         <h2 className="text-xl font-bold text-stone-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-5">
      <h3 className="font-bold text-stone-800 mb-3">{title}</h3>
      <div className="text-sm text-stone-600 space-y-2">{children}</div>
    </div>
  );
}

function ThreeCols({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((it, i) => (
        <Card key={i} title={it.title}>{it.content}</Card>
      ))}
    </div>
  );
}
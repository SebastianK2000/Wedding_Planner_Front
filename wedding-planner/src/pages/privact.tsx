import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function LegalAll() {

  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Informacje prawne</h1>
          <p className="text-stone-600">
            Zwięzła i czytelna wersja: prywatność, regulamin oraz cookies w jednym miejscu.
          </p>
        </div>
      </div>

        <nav className="rounded-2xl border border-stone-200/60 p-4 bg-gradient-to-b from-white to-stone-50 shadow">
        <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 border border-brand-200 text-stone-700">
            §
            </span>
            <div className="text-xs uppercase tracking-wide text-stone-500">Spis treści</div>
            <div className="ml-3 h-px flex-1 bg-stone-200" />
        </div>

        <ul className="mt-3 grid sm:grid-cols-3 gap-2">
            <li>
            <a
                href="#polityka-prywatnosci"
                className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2 hover:bg-stone-100 hover:border-stone-300 transition"
            >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white text-xs font-semibold">1</span>
                <span className="text-sm font-medium text-stone-800">Polityka prywatności</span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition">→</span>
            </a>
            </li>
            <li>
            <a
                href="#regulamin"
                className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2 hover:bg-stone-100 hover:border-stone-300 transition"
            >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white text-xs font-semibold">2</span>
                <span className="text-sm font-medium text-stone-800">Regulamin</span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition">→</span>
            </a>
            </li>
            <li>
            <a
                href="#cookies"
                className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2 hover:bg-stone-100 hover:border-stone-300 transition"
            >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white text-xs font-semibold">3</span>
                <span className="text-sm font-medium text-stone-800">Cookies</span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition">→</span>
            </a>
            </li>
        </ul>
        </nav>

    {/* Polityka prywatności */}
      <Section id="polityka-prywatnosci" title="Polityka prywatności">
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
            e-mail: <a className="underline text-stone-900" href="mailto:kontakt@weddingplanner.app">kontakt@weddingplanner.app</a>
          </p>
        </Card>
      </Section>

      {/* Regulamin */}
      <Section id="regulamin" title="Regulamin">
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
            <a className="underline text-stone-900" href="mailto:kontakt@weddingplanner.app">
              kontakt@weddingplanner.app
            </a>
            . Postaramy się odpowiedzieć w 24–48h roboczych.
          </p>
        </Card>
      </Section>

      {/* Cookies */}
      <Section id="cookies" title="Cookies">
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

      <div className="flex items-center justify-between gap-2">
        <Link to="/" className="px-4 py-2 rounded-2xl text-sm border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200">
          Wróć do strony głównej
        </Link>

      </div>
    </div>
  );
}


function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <a href={`#${id}`} className="text-xs text-stone-500 hover:underline">#</a>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white p-4 shadow-sm">
      <div className="font-medium text-stone-900">{title}</div>
      <div className="mt-2 text-stone-700">{children}</div>
    </div>
  );
}

function ThreeCols({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {items.map((it, i) => (
        <Card key={i} title={it.title}>{it.content}</Card>
      ))}
    </div>
  );
}

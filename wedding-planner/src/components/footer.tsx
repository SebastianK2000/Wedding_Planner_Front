import { NavLink } from "react-router-dom";
import {
  Facebook, Instagram, Mail, Phone, MapPin,
  Github
} from "lucide-react";

const primary = [
  { to: "/", label: "Home" },
  { to: "/sala-weselna", label: "Sala weselna" },
  { to: "/muzyka", label: "Muzyka" },
  { to: "/fotograf", label: "Fotograf" },
  { to: "/florysta", label: "Florysta" },
  { to: "/przewodnik", label: "Przewodnik" },
  { to: "/transport", label: "Transport" },
];

const modules = [
  { to: "/goscie", label: "Goście" },
  { to: "/budzet", label: "Budżet" },
  { to: "/zadania", label: "Zadania" },
  { to: "/harmonogram", label: "Harmonogram" },
];

const resources = [
  { to: "/faq", label: "FAQ" },
  { to: "/kontakt", label: "Kontakt" },
];

function Logo() {
  return (
    <NavLink to="/" className="inline-block">
      <div className="text-2xl font-semibold leading-5 text-white">
        <span className="block">Wedding</span>
        <span className="block -mt-1">Planner</span>
      </div>
    </NavLink>
  );
}

export default function Footer() {
  // zwykły mock newslettera (LS), aby UX był przyjemny
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Podaj poprawny adres e-mail.");
      return;
    }
    try {
      const LS_KEY = "wp_newsletter";
      const raw = localStorage.getItem(LS_KEY);
      const prev: string[] = raw ? JSON.parse(raw) : [];
      if (!prev.includes(email)) {
        localStorage.setItem(LS_KEY, JSON.stringify([email, ...prev]));
      }
      e.currentTarget.reset();
      alert("Dziękujemy! Dodano do newslettera (mock).");
    } catch {
      alert("Ups, nie udało się zapisać.");
    }
  }

  return (
    <footer className="mt-12 bg-stone-900 text-stone-300">
      {/* top wave / delikatne odcięcie */}
      <div className="h-1 w-full bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + opis */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-stone-400">
              Planer ślubny w jednym miejscu: sala, muzyka, fotograf, florysta,
              transport, goście, budżet i zadania. Minimalny hałas – maksimum porządku.
            </p>

            <div className="flex items-center gap-3 text-stone-400">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#!"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#!"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Szybkie linki */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Nawigacja</h4>
            <ul className="space-y-2">
              {primary.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className="text-sm text-stone-400 hover:text-white"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Moduły */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Moduły</h4>
            <ul className="space-y-2">
              {modules.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className="text-sm text-stone-400 hover:text-white"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold text-white mt-6 mb-3">
              Zasoby
            </h4>
            <ul className="space-y-2">
              {resources.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className="text-sm text-stone-400 hover:text-white"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + kontakt */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Newsletter
            </h4>
            <p className="text-sm text-stone-400 mb-2">
              Zero spamu. Raz na jakiś czas praktyczne checklisty i inspiracje.
            </p>
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                name="email"
                type="email"
                placeholder="Twój e-mail"
                className="flex-1 rounded-xl border border-stone-700 bg-stone-800/70 px-3 py-2 text-sm placeholder:text-stone-500 focus:border-stone-500 focus:outline-none"
              />
              <button
                className="rounded-2xl bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
                type="submit"
              >
                Zapisz
              </button>
            </form>

            <div className="mt-6 space-y-2 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <Mail size={16} /> kontakt@weddingplanner.app
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> +48 600 000 000
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> Kraków / Warszawa (zdalnie)
              </div>
            </div>
          </div>
        </div>

        {/* dół */}
        <div className="mt-10 border-t border-stone-800 pt-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="text-xs text-stone-500">
            © {new Date().getFullYear()} Wedding Planner. Wszystkie prawa zastrzeżone.
            <br />
            Stworzone przez Sebastian Kościółek.
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <NavLink to="/polityka-prywatnosci" className="text-stone-400 hover:text-white">
              Polityka prywatności
            </NavLink>
            <NavLink to="/polityka-prywatnosci" className="text-stone-400 hover:text-white">
              Regulamin
            </NavLink>
            <NavLink to="/polityka-prywatnosci" className="text-stone-400 hover:text-white">
              Cookies
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

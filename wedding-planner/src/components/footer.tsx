import { NavLink } from "react-router-dom";
import {
  Facebook, Instagram, Mail, Phone, MapPin,
  Github, Heart, ArrowRight
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
    <NavLink to="/" className="inline-flex items-center gap-2 group">
      <div className="p-1.5 bg-stone-800 rounded-lg group-hover:bg-accent-600 transition-colors">
         <Heart size={20} className="text-white fill-white" />
      </div>
      <div className="text-xl font-bold leading-none text-white">
        <span className="block">Wedding</span>
        <span className="block text-stone-400 text-sm font-medium group-hover:text-stone-300 transition-colors">Planner</span>
      </div>
    </NavLink>
  );
}

export default function Footer() {
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
    <footer className="mt-20 bg-stone-950 text-stone-400 border-t border-stone-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          
          <div className="lg:col-span-4 space-y-6">
            <Logo />
            <p className="text-sm leading-relaxed max-w-sm text-stone-500">
              Twój osobisty asystent w planowaniu wesela. 
              Wszystko w jednym miejscu: od budżetu po listę gości. 
              Minimalny hałas – maksimum porządku.
            </p>

            <div className="flex items-center gap-3">
              <SocialLink href="https://github.com/" icon={<Github size={18} />} label="GitHub" />
              <SocialLink href="#!" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="#!" icon={<Instagram size={18} />} label="Instagram" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Nawigacja</h4>
            <ul className="space-y-3 text-sm">
              {primary.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className="hover:text-accent-500 transition-colors">
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Narzędzia</h4>
            <ul className="space-y-3 text-sm">
              {modules.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className="hover:text-accent-500 transition-colors">
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">Pomoc</h4>
            <ul className="space-y-3 text-sm">
              {resources.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className="hover:text-accent-500 transition-colors">
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Zostań na bieżąco
            </h4>
            <p className="text-sm text-stone-500 mb-4">
              Zero spamu. Raz na miesiąc praktyczne porady i inspiracje ślubne.
            </p>
            <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                 <input
                    name="email"
                    type="email"
                    placeholder="Twój e-mail"
                    className="w-full rounded-xl border border-stone-800 bg-stone-900 py-2.5 pl-9 pr-4 text-sm text-stone-200 placeholder:text-stone-600 focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-600 transition-all"
                 />
              </div>
              <button
                className="rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-500 transition-colors shadow-lg shadow-accent-900/20 flex items-center justify-center gap-2"
                type="submit"
              >
                Zapisz <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-stone-900 space-y-3 text-sm text-stone-500">
              <div className="flex items-center gap-3 hover:text-stone-300 transition-colors">
                <Mail size={16} className="text-accent-600" /> 
                <span>kontakt@weddingplanner.app</span>
              </div>
              <div className="flex items-center gap-3 hover:text-stone-300 transition-colors">
                <Phone size={16} className="text-accent-600" /> 
                <span>+48 600 000 000</span>
              </div>
              <div className="flex items-center gap-3 hover:text-stone-300 transition-colors">
                <MapPin size={16} className="text-accent-600" /> 
                <span>Kraków / Warszawa (zdalnie)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-stone-900 pt-8 flex flex-col md:flex-row gap-6 items-center justify-between text-xs text-stone-600">
          <div>
            © {new Date().getFullYear()} Wedding Planner. Wszelkie prawa zastrzeżone.
            <span className="hidden md:inline"> • </span>
            <br className="md:hidden" />
            Stworzone z ❤️ przez Sebastian Kościółek.
          </div>

          <div className="flex gap-6">
            <NavLink to="/polityka-prywatnosci" className="hover:text-stone-300 transition-colors">
              Polityka prywatności
            </NavLink>
            <NavLink to="/polityka-prywatnosci" className="hover:text-stone-300 transition-colors">
              Regulamin
            </NavLink>
            <NavLink to="/polityka-prywatnosci" className="hover:text-stone-300 transition-colors">
              Cookies
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
   return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-stone-500 hover:bg-stone-800 hover:text-white hover:scale-110 transition-all duration-300 border border-stone-800"
        aria-label={label}
        title={label}
      >
        {icon}
      </a>
   )
}
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User, LogIn, UserPlus } from "lucide-react";

const primary = [
  { to: "/", label: "Home" },
  { to: "/sala-weselna", label: "Sala weselna" },
  { to: "/muzyka", label: "Muzyka" },
  { to: "/fotograf", label: "Fotograf" },
  { to: "/florysta", label: "Florysta" },
  { to: "/transport", label: "Transport" },
];

const secondary = [
  { to: "/goscie", label: "Goście" },
  { to: "/budzet", label: "Budżet" },
  { to: "/zadania", label: "Zadania" },
  { to: "/harmonogram", label: "Harmonogram" },
  { to: "/przewodnik", label: "Przewodnik" },
];

const CART_KEYS = ["wp_cart_photographers", "wp_cart_florists", "wp_cart_music"];

function usePlanCount() {
  const [count, setCount] = useState(0);
  function readCount() {
    let n = 0;
    for (const k of CART_KEYS) {
      try {
        const raw = localStorage.getItem(k);
        n += raw ? JSON.parse(raw).length : 0;
      } catch {console.log("Błąd");}
    }
    setCount(n);
  }
  useEffect(() => {
    readCount();
    const onUpdate = () => readCount();
    window.addEventListener("wp:cart:update", onUpdate);
    return () => window.removeEventListener("wp:cart:update", onUpdate);
  }, []);
  return count;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const planCount = usePlanCount();
  const nav = useNavigate();

  const isLoggedIn = false;

  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setUserMenu(false);
    }
    if (userMenu) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [userMenu]);

  const navLinkCls = (isActive: boolean) =>
    [
      "px-3 py-2 rounded-xl text-sm transition",
      isActive
        ? "text-stone-900 bg-stone-100"
        : "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
    ].join(" ");

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          
          <NavLink to="/" className="text-xl font-semibold leading-5 text-stone-900 flex-shrink-0">
            <span className="block">Wedding</span>
            <span className="block -mt-1">Planner</span>
          </NavLink>

          <nav className="hidden md:flex gap-2 items-center flex-shrink min-w-0">
            {primary.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => navLinkCls(isActive)}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center flex-shrink-0">
            {secondary.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => navLinkCls(isActive)}>
                {l.label}
              </NavLink>
            ))}

            <button className="relative px-4 py-2 rounded-2xl text-sm bg-stone-900 text-white hover:opacity-90 flex-shrink-0">
              Zapisz
              {planCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-accent-500 text-white text-xs grid place-items-center px-1">
                  {planCount}
                </span>
              )}
            </button>

            <div className="relative flex-shrink-0" ref={menuRef}>
              <div
                onClick={() => setUserMenu(v => !v)}
                className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-stone-300 bg-transparent hover:bg-stone-100 text-stone-700 cursor-pointer"
                title={isLoggedIn ? "Konto" : "Zaloguj / Zarejestruj"}
                
                role="button"
                tabIndex={0}
                aria-haspopup="menu"
                aria-expanded={userMenu}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setUserMenu(v => !v);
                  }
                }}
              >
                <User size={18} />
            </div>

              <div
                className={`absolute right-0 mt-2 w-52 rounded-2xl border border-stone-200 bg-white shadow-lg overflow-hidden ${
                  userMenu ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"
                } transition`}
                role="menu"
              >
                {!isLoggedIn ? (
                  <div className="py-1">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-stone-50"
                      onClick={() => { setUserMenu(false); nav("/login"); }}
                      role="menuitem"
                    >
                      <LogIn size={16} /> Zaloguj się
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-stone-50"
                      onClick={() => { setUserMenu(false); nav("/rejestracja"); }}
                      role="menuitem"
                    >
                      <UserPlus size={16} /> Rejestracja
                    </button>
                  </div>
                ) : (
                  <div className="py-1">
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-stone-300 text-stone-700 hover:bg-stone-100 flex-shrink-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Otwórz menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg className={`h-5 w-5 ${open ? "hidden" : "block"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`h-5 w-5 ${open ? "block" : "hidden"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`md:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white border-l border-stone-200 shadow-xl transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-stone-200/70 flex items-center justify-between">
            <div className="text-lg font-semibold">Menu</div>
            <button
              className="rounded-xl p-2 border border-stone-300 text-stone-700"
              onClick={() => setOpen(false)}
              aria-label="Zamknij menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white">
                <User size={18} className="text-stone-700" />
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-2xl border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
                  onClick={() => { setOpen(false); nav("/login"); }}
                >
                  Zaloguj
                </button>
                <button
                  className="rounded-2xl bg-accent-500 text-white px-3 py-1.5 text-sm hover:bg-accent-600"
                  onClick={() => { setOpen(false); nav("/rejestracja"); }}
                >
                  Rejestracja
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Nawigacja</div>
              <div className="flex flex-col gap-1">
                {primary.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      [
                        "px-3 py-2 rounded-xl text-sm",
                        isActive ? "bg-stone-100 text-stone-900" : "text-stone-700 hover:bg-stone-50",
                      ].join(" ")
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Moduły</div>
              <div className="flex flex-col gap-1">
                {secondary.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      [
                        "px-3 py-2 rounded-xl text-sm",
                        isActive ? "bg-stone-100 text-stone-900" : "text-stone-700 hover:bg-stone-50",
                      ].join(" ")
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <button className="relative w-full px-4 py-2 rounded-2xl text-sm bg-stone-900 text-white hover:opacity-90">
              Zapisz
              {planCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-accent-500 text-white text-xs grid place-items-center px-1">
                  {planCount}
                </span>
              )}
            </button>

            <div className="text-xs text-stone-500">
              <p>
                Kolorystyka:{" "}
                <span className="inline-block align-middle w-3 h-3 rounded" style={{ background: "#ECE2D0" }} /> / akcent{" "}
                <span className="inline-block align-middle w-3 h-3 rounded" style={{ background: "#CFA37A" }} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
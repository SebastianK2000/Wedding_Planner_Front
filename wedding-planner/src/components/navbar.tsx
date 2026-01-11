import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User, LogIn, UserPlus, LogOut, ShoppingBag, X, Menu } from "lucide-react";
import api from "../lib/api";
import Cart from "../pages/cart";

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

const CART_KEYS = ["wp_cart_photographers", "wp_cart_florists", "wp_cart_music", "wp_cart_venues", "wp_cart_transport"];

function usePlanCount(isLoggedIn: boolean) {
  const [count, setCount] = useState(0);

  const readLocalCount = () => {
    let n = 0;
    for (const k of CART_KEYS) {
      try {
        const raw = localStorage.getItem(k);
        n += raw ? JSON.parse(raw).length : 0;
      } catch { /* ignore */ }
    }
    setCount(n);
  }

  const fetchApiCount = async () => {
      try {
          const res = await api.get("/user-favorites/");
          setCount(res.data.length);
      } catch (e) {
          console.error("Błąd pobierania ulubionych", e);
      }
  }

  const update = () => {
      if (isLoggedIn) fetchApiCount();
      else readLocalCount();
  };

  useEffect(() => {
    update();
    window.addEventListener("wp:cart:update", update);
    return () => window.removeEventListener("wp:cart:update", update);
  }, [isLoggedIn]);

  return count;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const location = useLocation();
  const nav = useNavigate();

  const [user, setUser] = useState<{ fullname: string; email: string } | null>(null);
  
  useEffect(() => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
          try {
              setUser(JSON.parse(userStr));
          } catch (e) {
              localStorage.removeItem("user");
          }
      }
  }, []);

  const isLoggedIn = !!user;
  const planCount = usePlanCount(isLoggedIn);

  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
    setIsCartOpen(false);
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

  const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
      setUserMenu(false);
      nav("/login");
      window.location.reload();
  };

  const navLinkCls = (isActive: boolean) =>
    [
      "px-3 py-2 rounded-xl text-sm transition",
      isActive
        ? "text-stone-900 bg-stone-100"
        : "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
    ].join(" ");

  return (
    <>
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

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors ml-1"
                aria-label="Otwórz koszyk"
              >
                <ShoppingBag size={20} />
                {planCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white transform translate-x-1 -translate-y-1 animate-in zoom-in duration-300">
                    {planCount}
                  </span>
                )}
              </button>

              <div className="relative flex-shrink-0" ref={menuRef}>
                <div
                  onClick={() => setUserMenu(v => !v)}
                  className={`inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors cursor-pointer ${isLoggedIn ? 'bg-accent-100 border-accent-200 text-accent-700' : 'bg-transparent border-stone-300 hover:bg-stone-100 text-stone-700'}`}
                  title={isLoggedIn ? user?.fullname : "Zaloguj / Zarejestruj"}
                  role="button"
                  tabIndex={0}
                >
                  <User size={18} />
                </div>

                <div
                  className={`absolute right-0 mt-2 w-52 rounded-2xl border border-stone-200 bg-white shadow-lg overflow-hidden ${
                    userMenu ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"
                  } transition`}
                >
                  {!isLoggedIn ? (
                    <div className="py-1">
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-stone-50"
                        onClick={() => { setUserMenu(false); nav("/login"); }}
                      >
                        <LogIn size={16} /> Zaloguj się
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-stone-50"
                        onClick={() => { setUserMenu(false); nav("/rejestracja"); }}
                      >
                        <UserPlus size={16} /> Rejestracja
                      </button>
                    </div>
                  ) : (
                    <div className="py-1">
                      <div className="px-3 py-2 border-b border-stone-100">
                          <p className="text-sm font-semibold text-stone-800 truncate">{user?.fullname}</p>
                          <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} /> Wyloguj się
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-stone-300 text-stone-700 hover:bg-stone-100 flex-shrink-0"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={`md:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
          <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
          <div className={`absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white border-l border-stone-200 shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
             
             <div className="p-4 border-b border-stone-200/70 flex items-center justify-between">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2 text-stone-500"><X size={20}/></button>
             </div>

             <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
                
                <div className="flex items-center gap-3">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${isLoggedIn ? 'bg-accent-100 border-accent-200 text-accent-700' : 'bg-white border-stone-300 text-stone-700'}`}>
                    <User size={18} />
                  </div>
                  <div className="flex gap-2 w-full">
                    {!isLoggedIn ? (
                        <>
                            <button
                            className="rounded-2xl border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50 flex-1"
                            onClick={() => { setOpen(false); nav("/login"); }}
                            >
                            Zaloguj
                            </button>
                            <button
                            className="rounded-2xl bg-accent-500 text-white px-3 py-1.5 text-sm hover:bg-accent-600 flex-1"
                            onClick={() => { setOpen(false); nav("/rejestracja"); }}
                            >
                            Rejestracja
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col w-full">
                            <span className="text-sm font-medium text-stone-900">{user?.fullname}</span>
                            <button 
                                onClick={handleLogout}
                                className="text-xs text-rose-600 font-medium text-left mt-1 hover:underline"
                            >
                                Wyloguj się
                            </button>
                        </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Nawigacja</div>
                  <div className="flex flex-col gap-1">
                    {primary.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-xl text-sm ${isActive ? "bg-stone-100 text-stone-900" : "text-stone-700 hover:bg-stone-50"}`
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
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-xl text-sm ${isActive ? "bg-stone-100 text-stone-900" : "text-stone-700 hover:bg-stone-50"}`
                        }
                      >
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
                
                <button 
                    onClick={() => { setOpen(false); setIsCartOpen(true); }}
                    className="relative w-full px-4 py-3 rounded-2xl text-sm bg-stone-900 text-white hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Twój Koszyk ({planCount})
                </button>

                <div className="text-xs text-stone-500 pt-4">
                  <p>Wedding Planner App &copy; {new Date().getFullYear()}</p>
                </div>
             </div>
          </div>
        </div>
      </header>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
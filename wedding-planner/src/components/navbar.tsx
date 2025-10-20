import { NavLink } from "react-router-dom";

const primary = [
  { to: "/", label: "Home" },
  { to: "/sala-weselna", label: "Sala weselna" },
  { to: "/muzyka", label: "Muzyka" },
  { to: "/fotograf", label: "Fotograf" },
  { to: "/florysta", label: "Florysta" },
  { to: "/przewodnik", label: "Przewodnik" },
  { to: "/transport", label: "Transport" },
];

const secondary = [
  { to: "/goscie", label: "Goście" },
  { to: "/budzet", label: "Budżet" },
  { to: "/zadania", label: "Zadania" },
  { to: "/harmonogram", label: "Harmonogram" },
];

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-6">
          <NavLink to="/" className="text-xl font-semibold leading-5 text-stone-900">
            <span className="block">Wedding</span>
            <span className="block -mt-1">Planner</span>
          </NavLink>

          <nav className="hidden md:flex gap-2 items-center">
            {primary.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  [
                    "px-3 py-2 rounded-xl text-sm transition",
                    isActive
                      ? "text-stone-900 bg-stone-100"
                      : "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            {secondary.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  [
                    "px-3 py-2 rounded-xl text-sm transition",
                    isActive
                      ? "text-stone-900 bg-stone-100"
                      : "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button className="px-4 py-2 rounded-2xl text-sm bg-stone-900 text-white hover:opacity-90">Zapisz</button>
          </div>
        </div>
      </div>
    </header>
  );
}

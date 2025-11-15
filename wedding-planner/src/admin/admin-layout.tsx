import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Music, 
  Camera, 
  Flower2, 
  Car, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "Pulpit", icon: <LayoutDashboard size={20} />, end: true },
  { to: "/admin/sale", label: "Sale weselne", icon: <Building2 size={20} /> },
  { to: "/admin/muzyka", label: "Muzyka", icon: <Music size={20} /> },
  { to: "/admin/foto", label: "Fotografowie", icon: <Camera size={20} /> },
  { to: "/admin/florysci", label: "Floryści", icon: <Flower2 size={20} /> },
  { to: "/admin/transport", label: "Transport", icon: <Car size={20} /> },
  { to: "/admin/uzytkownicy", label: "Użytkownicy", icon: <Users size={20} /> },
  { to: "/admin/ustawienia", label: "Ustawienia", icon: <Settings size={20} /> },
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-800">
      
      <aside className="hidden lg:flex w-64 flex-col border-r border-stone-200 bg-white fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-stone-100">
           <span className="text-xl font-bold text-stone-900">WP Intranet</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Wyloguj się
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 z-40">
         <span className="font-bold text-lg">WP Intranet</span>
         <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-600">
            {isOpen ? <X /> : <Menu />}
         </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)}>
           <aside className="w-64 h-full bg-white p-4 pt-20" onClick={e => e.stopPropagation()}>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                        isActive ? "bg-stone-900 text-white" : "text-stone-600"
                      }`
                    }
                  >
                    {item.icon} {item.label}
                  </NavLink>
                ))}
              </nav>
           </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0">
         <div className="max-w-7xl mx-auto p-6 md:p-8">
            <Outlet />
         </div>
      </main>
    </div>
  );
}
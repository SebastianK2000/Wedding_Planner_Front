import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthLayout from "./auth_layout";

export default function Register() {
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const strength = useMemo(() => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  }, [pwd]);

  const inputClass = 
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pl-11 text-sm text-stone-900 placeholder:text-stone-400 " +
    "focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all";
  
  const labelClass = "block text-xs font-medium text-stone-700 mb-1.5 ml-1";

  const strengthColor = () => {
    if (strength <= 1) return "bg-rose-500";
    if (strength === 2) return "bg-amber-500";
    if (strength === 3) return "bg-lime-500";
    return "bg-green-500";
  };

  const strengthLabel = () => {
    if (strength <= 1) return "Słabe";
    if (strength === 2) return "Średnie";
    if (strength === 3) return "Dobre";
    return "Silne";
  };

  return (
    <AuthLayout title="Załóż konto" subtitle="Zapisuj postępy i wracaj do planu z dowolnego urządzenia.">
      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        <div>
          <label className={labelClass}>Imię i nazwisko</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-accent-500 transition-colors">
              <User size={18} />
            </div>
            <input 
              className={inputClass} 
              placeholder="np. Anna Kowalska" 
              required 
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Adres e-mail</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-accent-500 transition-colors">
              <Mail size={18} />
            </div>
            <input 
              className={inputClass} 
              type="email" 
              autoComplete="email" 
              placeholder="np. anna@example.com" 
              required 
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Hasło</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-accent-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              className={`${inputClass} pr-10`}
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoComplete="new-password"
              placeholder="Minimum 8 znaków"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 transition-colors"
              onClick={() => setShow(s => !s)}
              aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="mt-2">
             <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((level) => (
                   <div 
                      key={level} 
                      className={`h-full rounded-full flex-1 transition-colors duration-300 ${strength >= level ? strengthColor() : "bg-stone-100"}`} 
                   />
                ))}
             </div>
             <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-stone-400">Siła hasła</span>
                <span className={`text-xs font-medium ${strength >= 3 ? "text-green-600" : "text-stone-500"}`}>
                   {pwd.length > 0 ? strengthLabel() : ""}
                </span>
             </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Powtórz hasło</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-accent-500 transition-colors">
              <CheckCircle2 size={18} className={pwd && confirmPwd && pwd === confirmPwd ? "text-green-500" : ""} />
            </div>
            <input
              className={`${inputClass} pr-10`}
              type={show ? "text" : "password"}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              autoComplete="new-password"
              placeholder="Powtórz hasło"
              required
            />
          </div>
        </div>

        <label className="flex items-start gap-3 group cursor-pointer">
          <div className="relative flex items-center mt-0.5">
             <input 
                type="checkbox" 
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-stone-300 shadow-sm checked:bg-accent-500 checked:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all" 
                required 
             />
             <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
          </div>
          <span className="text-sm text-stone-600 leading-tight group-hover:text-stone-800 transition-colors">
            Akceptuję <a href="#" className="text-accent-600 hover:underline">Regulamin</a> oraz <a href="#" className="text-accent-600 hover:underline">Politykę Prywatności</a>.
          </span>
        </label>

        <button 
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-lg shadow-accent-500/30 transition-all transform active:scale-[0.98]"
          type="submit"
        >
          Załóż konto
          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-6 text-center text-sm text-stone-600">
          Masz już konto?{" "}
          <NavLink className="font-bold text-stone-900 hover:text-accent-600 hover:underline transition-colors" to="/login">
            Zaloguj się
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
}

function Check({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) {
   return (
      <svg 
         width={size} 
         height={size} 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="currentColor" 
         strokeWidth={strokeWidth || 2} 
         strokeLinecap="round" 
         strokeLinejoin="round" 
         className={className}
      >
         <polyline points="20 6 9 17 4 12" />
      </svg>
   );
}
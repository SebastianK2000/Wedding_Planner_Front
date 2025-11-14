import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "./auth_layout";

export default function Login() {
  const [show, setShow] = useState(false);

  const inputClass = 
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pl-11 text-sm text-stone-900 placeholder:text-stone-400 " +
    "focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all";
  
  const labelClass = "block text-xs font-medium text-stone-700 mb-1.5 ml-1";

  return (
    <AuthLayout title="Witaj ponownie!" subtitle="Zaloguj się, aby kontynuować planowanie swojego wymarzonego dnia.">
      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        <div>
          <label className={labelClass}>Adres e-mail</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-accent-500 transition-colors">
              <Mail size={18} />
            </div>
            <input 
              className={inputClass} 
              type="email" 
              required 
              placeholder="np. anna@example.com" 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-xs font-medium text-stone-700">Hasło</label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-accent-500 transition-colors">
              <Lock size={18} />
            </div>
            <input 
              className={`${inputClass} pr-10`} 
              type={show ? "text" : "password"} 
              required 
              placeholder="••••••••" 
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 transition-colors"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-stone-600 cursor-pointer hover:text-stone-800 transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-stone-300 text-accent-600 focus:ring-accent-500" 
              defaultChecked 
            />
            Zapamiętaj mnie
          </label>
          <NavLink to="/przypomnij-haslo" className="font-medium text-accent-600 hover:text-accent-700 hover:underline">
            Zapomniałeś hasła?
          </NavLink>
        </div>

        <button 
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-lg shadow-accent-500/30 transition-all transform active:scale-[0.98]"
          type="submit"
        >
          Zaloguj się
          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-stone-400">lub kontynuuj przez</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton icon={<GoogleIcon />} label="Google" />
          <SocialButton icon={<FacebookIcon />} label="Facebook" />
        </div>

        <div className="mt-6 text-center text-sm text-stone-600">
          Nie masz jeszcze konta?{" "}
          <NavLink className="font-bold text-stone-900 hover:text-accent-600 hover:underline transition-colors" to="/rejestracja">
            Zarejestruj się
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all focus:outline-none focus:ring-2 focus:ring-stone-200"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.87v1.12h5.374l-.755 3.667H13.91v7.98H9.101Z" />
    </svg>
  );
}
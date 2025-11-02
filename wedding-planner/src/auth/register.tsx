import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
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

  const input = "w-full rounded-xl border border-stone-300 px-3 py-2 bg-white";
  const label = "block text-xs text-stone-500 mb-1";
  const btn = "w-full rounded-2xl bg-accent-500 text-white py-2 text-sm font-medium hover:bg-accent-600";

  return (
    <AuthLayout title="Utwórz konto" subtitle="Zapisuj postępy i wracaj do planu z dowolnego urządzenia.">
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        
        <div>
          <label className={label}>Imię i nazwisko</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input className={`${input} pl-9`} placeholder="np. Anna Kowalska" required />
          </div>
        </div>

        <div>
          <label className={label}>E-mail</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input className={`${input} pl-9`} type="email" autoComplete="email" placeholder="np. anna@example.com" required />
          </div>
        </div>

        <div>
          <label className={label}>Hasło</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              className={`${input} pl-9 pr-10`}
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 p-1"
              onClick={() => setShow(s => !s)}
              aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="mt-1 h-1.5 rounded-full bg-stone-200 overflow-hidden">
            <div
              className={[
                "h-full rounded-full transition-all",
                strength <= 1 ? "bg-rose-400 w-1/4" :
                strength === 2 ? "bg-amber-400 w-2/4" :
                strength === 3 ? "bg-lime-500 w-3/4" :
                "bg-green-600 w-full"
              ].join(" ")}
            />
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {strength <= 1 ? "Słabe" : strength === 2 ? "Średnie" : strength === 3 ? "Dobre" : "Bardzo dobre"}
          </div>
        </div>

        <div>
          <label className={label}>Powtórz hasło</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              className={`${input} pl-9 pr-10`}
              type={show ? "text" : "password"}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 p-1"
              onClick={() => setShow(s => !s)}
              aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 accent-accent-500" required />
          <span>
            Akceptuję zasady przetwarzania danych i Regulamin.
          </span>
        </label>

        <button className={btn} type="submit">Załóż konto</button>

        <div className="text-sm text-stone-600 text-center">
          Masz już konto?{" "}
          <NavLink className="text-stone-900 underline" to="/login">Zaloguj się</NavLink>
        </div>
      </form>
    </AuthLayout>
  );
}
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock} from "lucide-react";
import AuthLayout from "./auth_layout";

export default function Login() {
  const [show, setShow] = useState(false);

  const input = "w-full rounded-xl border border-stone-300 px-3 py-2 bg-white";
  const label = "block text-xs text-stone-500 mb-1";
  const btn  = "w-full rounded-2xl bg-accent-500 text-white py-2 text-sm font-medium hover:bg-accent-600";

  return (
    <AuthLayout title="Zaloguj się" subtitle="Wróć do planowania tam, gdzie skończyłeś/aś.">
      <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
        <div>
          <label className={label}>E-mail</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input className={`${input} pl-9`} type="email" required placeholder="np. anna@example.com" />
          </div>
        </div>

        <div>
          <label className={label}>Hasło</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />            
            <input className={`${input} pl-9 pr-10`} type={show ? "text" : "password"} required placeholder="password" />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 p-1"
                onClick={() => setShow(s => !s)}
                aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
              >
              {show ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-accent-500" defaultChecked />
          Zapamiętaj mnie
        </label>

        <button className={btn} type="submit">Zaloguj się</button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-stone-500">albo</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          <button type="button" className="rounded-2xl border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50">Zaloguj przez Google</button>
          <button type="button" className="rounded-2xl border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50">Zaloguj przez Facebook</button>
        </div>

        <div className="text-sm text-stone-600 text-center">
          Nie masz konta?{" "}
          <NavLink className="text-stone-900 underline" to="/rejestracja">Utwórz konto</NavLink>
        </div>
      </form>
    </AuthLayout>
  );
}

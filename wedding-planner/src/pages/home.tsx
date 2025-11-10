import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Leaf, Music, Sparkles, Users, Wallet, Camera, Building2, Shield } from "lucide-react";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
              <Sparkles className="h-4 w-4" /> Nowość: inteligentny harmonogram
            </div>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Zaplanuj <span className="text-accent-600">wymarzone wesele</span>
            </h1>
            <p className="mt-4 text-stone-600 max-w-prose">
              Wszystko w jednym miejscu: sala weselna, muzyka, fotograf, florysta, transport, zadania i budżet.
              Oszczędzaj czas dzięki gotowym listom i sprytnym podpowiedziom.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2">
                Rozpocznij za darmo <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/30 focus-visible:ring-offset-2">
                Zobacz demo
              </button>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <li className="flex items-center gap-2 rounded-xl bg-brand-100 p-3">
                <Users className="h-4 w-4" /> Lista gości
              </li>
              <li className="flex items-center gap-2 rounded-xl bg-brand-100 p-3">
                <Wallet className="h-4 w-4" /> Budżet i koszty
              </li>
              <li className="flex items-center gap-2 rounded-xl bg-brand-100 p-3">
                <CalendarDays className="h-4 w-4" /> Harmonogram
              </li>
              <li className="flex items-center gap-2 rounded-xl bg-brand-100 p-3">
                <Building2 className="h-4 w-4" /> Dostawcy
              </li>
              <li className="flex items-center gap-2 rounded-xl bg-brand-100 p-3">
                <CheckCircle2 className="h-4 w-4" /> Zadania
              </li>
              <li className="flex items-center gap-2 rounded-xl bg-brand-100 p-3">
                <Shield className="h-4 w-4" /> Umowy i płatności
              </li>
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center md:max-w-md">
              {[
                { k: "+120k", v: "zad. zrealizowanych" },
                { k: "96%", v: "oszczędzony czas" },
                { k: "4.9/5", v: "ocena par" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-stone-200 bg-white p-3">
                  <div className="text-lg font-semibold">{s.k}</div>
                  <div className="text-xs text-stone-500">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow"
          >
            <div className="mb-3 text-sm text-stone-500">Przykładowe karty</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-brand-100 p-4">
                <div className="text-xs text-stone-500">Kategoria</div>
                <div className="mt-1 font-medium">Sala weselna</div>
                <ul className="mt-3 space-y-1 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Zaliczka 30% • 12.12</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Umowa podpisana</li>
                </ul>
              </div>
              <div className="rounded-xl bg-brand-100 p-4">
                <div className="text-xs text-stone-500">Kategoria</div>
                <div className="mt-1 font-medium">Muzyka</div>
                <ul className="mt-3 space-y-1 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><Music className="h-4 w-4" /> Zespół: Midnight</li>
                  <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Próba • 05.07</li>
                </ul>
              </div>
              <div className="rounded-xl bg-brand-100 p-4">
                <div className="text-xs text-stone-500">Kategoria</div>
                <div className="mt-1 font-medium">Fotograf</div>
                <ul className="mt-3 space-y-1 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><Camera className="h-4 w-4" /> Pakiet Premium</li>
                  <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Sesja narzeczeńska</li>
                </ul>
              </div>
              <div className="rounded-xl bg-brand-100 p-4">
                <div className="text-xs text-stone-500">Kategoria</div>
                <div className="mt-1 font-medium">Florysta</div>
                <ul className="mt-3 space-y-1 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Dekoracje stołów</li>
                  <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Odbiór • 20.08</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid items-center gap-6 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-3">
          <p className="text-center text-sm text-stone-600 md:text-left">
            Zaufany przez setki par i sprawdzonych dostawców
          </p>
          <div className="col-span-2 grid grid-cols-2 gap-4 text-center text-xs text-stone-500 md:grid-cols-4">
            <div className="rounded-lg border border-stone-100 p-3">Salon Miód & Róża</div>
            <div className="rounded-lg border border-stone-100 p-3">Hotel Nad Rzeką</div>
            <div className="rounded-lg border border-stone-100 p-3">Studio Lumiere</div>
            <div className="rounded-lg border border-stone-100 p-3">DJ Lightwave</div>
          </div>
        </div>
      </div>
    </section>
  );
}

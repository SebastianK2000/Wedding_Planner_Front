"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  Users,
  Wallet,
  Building2,
  Heart
} from "lucide-react";
import api from "../lib/api";

interface ApiHomeSection {
  id: number;
  sectionkey: string;
  title: string;
  subtitle: string;
  buttontext: string;
  imageurl: string;
}

const PLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(n);

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  const [heroContent, setHeroContent] = useState<ApiHomeSection | null>(null);

  const [userData, setUserData] = useState<{ name: string; date: string } | null>(null);
  const [budgetStats, setBudgetStats] = useState({ spent: 15000, total: 45000, hasData: false });
  const [taskStatus, setTaskStatus] = useState({ salaDone: false, hasData: false });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
           const userObj = JSON.parse(userStr);
           setUserData({
              name: userObj.fullname || "Anna & Tomasz",
              date: "2025-08-24"
           });
        }

        const [homeSectionsRes, budgetRes, tasksRes] = await Promise.allSettled([
           api.get("/home-sections/"),
           api.get("/budget/"),
           api.get("/tasks/")
        ]);

        if (homeSectionsRes.status === "fulfilled") {
            const sections: ApiHomeSection[] = homeSectionsRes.value.data;
            const hero = sections.find(s => s.sectionkey === 'hero') || sections[0];
            if (hero) setHeroContent(hero);
        }

        if (budgetRes.status === "fulfilled") {
           const items = budgetRes.value.data;
           if (items.length > 0) {
              const planned = items.reduce((acc: number, item: any) => acc + Number(item.plannedamount), 0);
              const actual = items.reduce((acc: number, item: any) => acc + Number(item.actualamount), 0);
              setBudgetStats({ spent: actual, total: planned || 1, hasData: true });
           }
        }

        if (tasksRes.status === "fulfilled") {
           const tasks = tasksRes.value.data;
           if (tasks.length > 0) {
              const salaTask = tasks.find((t: any) => t.title.toLowerCase().includes("sala") || t.title.toLowerCase().includes("lokal"));
              const isDone = salaTask ? salaTask.status === "done" : false;
              setTaskStatus({ salaDone: isDone, hasData: true });
           }
        }

      } catch (e) {
        console.log("Jesteś w trybie gościa lub błąd API:", e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const floatingAnimation = { y: [0, -10, 0] };
  const floatingTransition = {
    duration: 4,
    repeat: Infinity,
  };

  const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
    } catch {
        return dateStr;
    }
  };

  const defaultTitle = <>Twój ślub. <br /><span className="relative whitespace-nowrap text-accent-600">Bez stresu.</span></>;
  const defaultSubtitle = "Zapomnij o chaosie w notatnikach. Opanuj listę gości, budżet i harmonogram w jednej, pięknej aplikacji stworzonej dla nowoczesnych par.";
  const defaultButton = "Zaplanuj wesele";
  const defaultImage = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white min-h-[90vh] flex flex-col justify-center">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-accent-400/5 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-[30rem] w-[30rem] translate-x-1/2 rounded-full bg-brand-300/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-white px-3 py-1 text-xs font-medium text-accent-700 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-accent-500" />
              Nowość: Asystent AI do budżetu
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-900 md:text-6xl"
            >
              {heroContent ? (
                  heroContent.title
              ) : (
                  <>
                    Twój ślub. <br />
                    <span className="relative whitespace-nowrap text-accent-600">
                        Bez stresu.
                        <svg
                        className="absolute -bottom-2 left-0 -z-10 h-3 w-full text-accent-200"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                        >
                        <path
                            d="M0 5 Q 50 10 100 5"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                        />
                        </svg>
                    </span>
                  </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-stone-600"
            >
              {heroContent ? heroContent.subtitle : defaultSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative max-w-xs flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Heart className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="date"
                  defaultValue={userData?.date || "2025-08-24"}
                  className="block w-full rounded-2xl border-stone-200 bg-white py-3 pl-10 pr-4 text-stone-900 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                  placeholder="Data ślubu"
                />
              </div>
              <Link to="/harmonogram" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent-500/30 transition hover:-translate-y-0.5 hover:bg-accent-700">
                {heroContent ? heroContent.buttontext : defaultButton} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 border-t border-stone-100 pt-8"
            >
              <p className="text-sm font-medium text-stone-500">
                Wszystko, czego potrzebujesz:
              </p>
              <div className="mt-4 flex flex-wrap gap-6 text-stone-700">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-5 w-5 text-accent-500" /> Lista gości
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wallet className="h-5 w-5 text-accent-500" /> Budżet
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-5 w-5 text-accent-500" /> Sala i Menu
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-stone-200 shadow-2xl ring-1 ring-stone-900/10">
              <img
                src={heroContent?.imageurl || defaultImage}
                alt="Wedding couple"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="font-serif text-3xl">
                    {userData ? userData.name : "Anna & Tomasz"}
                </p>
                <p className="mt-1 flex items-center gap-2 text-stone-200">
                  <CalendarDays className="h-4 w-4" /> 
                  {userData ? formatDate(userData.date) : "24 Sierpnia 2025"}
                </p>
              </div>
            </div>

            <motion.div
              animate={floatingAnimation}
              transition={floatingTransition}
              className="absolute -left-4 top-12 z-10 w-64 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-md md:-left-12"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${taskStatus.salaDone ? "bg-green-100 text-green-600" : "bg-stone-100 text-stone-400"}`}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    Rezerwacja sali
                  </p>
                  <p className="text-xs text-stone-500">
                    {taskStatus.hasData 
                        ? (taskStatus.salaDone ? "Zadanie ukończone!" : "Do zrobienia") 
                        : "Zaliczka opłacona"
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ ...floatingTransition, delay: 0.5 }}
              className="absolute -right-4 bottom-24 z-10 w-64 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-md md:-right-12"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-2 text-rose-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">Budżet</p>
                  <div className="mt-1 h-1.5 w-32 rounded-full bg-stone-100 overflow-hidden">
                    <div 
                        className="h-1.5 rounded-full bg-rose-500 transition-all duration-1000" 
                        style={{ width: `${Math.min((budgetStats.spent / budgetStats.total) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Wydano {PLN(budgetStats.spent)} z {PLN(budgetStats.total)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
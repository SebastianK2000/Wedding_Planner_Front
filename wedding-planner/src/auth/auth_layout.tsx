export default function AuthLayout({ children, title, subtitle }: {
  children: React.ReactNode; title: string; subtitle?: string;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] grid md:grid-cols-2 gap-6">
      <div className="max-w-md w-full mx-auto self-center bg-white rounded-2xl shadow border border-stone-200/60 p-6">
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-stone-600 text-sm mt-1">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </div>

      <div className="hidden md:block rounded-2xl border border-stone-200/60 bg-brand-100 p-6 relative overflow-hidden">
        <div className="max-w-sm">
          <h2 className="text-lg font-semibold text-stone-800">Wedding Planner</h2>
          <p className="text-stone-600 mt-1 text-sm">
            Zapisuj postępy, zapraszaj bliskich, porządkuj budżet i oferty — wszystko w jednym miejscu.
          </p>
        </div>
        <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-white/60" />
        <div className="absolute -right-28 bottom-10 h-48 w-48 rounded-full bg-white/40" />
      </div>
    </div>
  );
}

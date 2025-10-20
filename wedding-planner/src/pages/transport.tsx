export default function Transport() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transport</h2>
      <p className="text-muted">Busy dla gości, samochód ślubny, logistyka dojazdu.</p>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-muted mb-1">Liczba gości</label>
            <input className="w-full rounded-xl border border-brand-200 px-3 py-2" placeholder="np. 80" />
          </div>
          <div>
            <label className="block text-muted mb-1">Miasto</label>
            <input className="w-full rounded-xl border border-brand-200 px-3 py-2" placeholder="np. Kraków" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 rounded-2xl border">Zapytaj przewoźników</button>
          <button className="px-4 py-2 rounded-2xl bg-accent-500 text-white">Dodaj do planu</button>
        </div>
      </div>
    </div>
  );
}

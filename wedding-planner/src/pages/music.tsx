export default function Music() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Muzyka</h2>
      <p className="text-muted">Dodaj zespoły/DJ-ów, porównaj ceny, zapisz ulubionych.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow p-4">
            <div className="h-32 bg-brand-100 rounded-xl mb-3" />
            <div className="font-medium">DJ Sunshine #{i}</div>
            <div className="text-sm text-muted">od 3500 zł • Kraków</div>
            <button className="mt-3 px-4 py-2 rounded-2xl border">Szczegóły</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Budget() {
  const items = [
    { name: "Sala weselna", planned: 30000, actual: 0 },
    { name: "Muzyka", planned: 6000, actual: 0 },
    { name: "Fotograf", planned: 5000, actual: 0 },
  ];
  const total = items.reduce((s, i) => s + i.planned, 0);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Budżet</h2>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-muted mb-2">Plan: {new Intl.NumberFormat("pl-PL").format(total)} zł</div>
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.name} className="flex items-center justify-between p-3 rounded-xl bg-brand-100">
              <span>{i.name}</span>
              <span className="font-medium">{new Intl.NumberFormat("pl-PL").format(i.planned)} zł</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
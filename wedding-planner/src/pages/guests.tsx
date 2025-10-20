export default function Guests() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Goście</h2>
      <p className="text-muted">Lista gości, RSVP i stoliki (mock).</p>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {[
            {name: "Anna Nowak", status: "potwierdzone"},
            {name: "Jan Kowalski", status: "oczekuje"},
            {name: "Kasia Malinowska", status: "potwierdzone"},
          ].map((g) => (
            <div key={g.name} className="p-3 rounded-xl bg-brand-100 flex items-center justify-between">
              <span>{g.name}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white">{g.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
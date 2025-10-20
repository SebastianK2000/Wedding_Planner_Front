export default function Florist() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Florysta</h2>
      <p className="text-muted">Dekoracje, bukiety, ścianka i dodatki.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow p-4">
            <div className="h-32 bg-brand-100 rounded-xl mb-3" />
            <div className="font-medium">Kwiaty i Styl #{i}</div>
            <div className="text-sm text-muted">motyw rustykalny</div>
          </div>
        ))}
      </div>
    </div>
  );
}

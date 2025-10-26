export default function Home() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Zaplanuj wymarzone wesele</h1>
        <p className="mt-4 text-muted max-w-prose">
          Wszystko w jednym miejscu: sala weselna, muzyka, fotograf, florysta, transport, zadania i budżet.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <li className="bg-brand-100 p-4 rounded-xl">Lista gości</li>
          <li className="bg-brand-100 p-4 rounded-xl">Budżet i koszty</li>
          <li className="bg-brand-100 p-4 rounded-xl">Harmonogram</li>
          <li className="bg-brand-100 p-4 rounded-xl">Dostawcy</li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="text-sm text-muted mb-3">Przykładowe karty</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-100 p-4 rounded-xl">Sala weselna</div>
          <div className="bg-brand-100 p-4 rounded-xl">Muzyka</div>
          <div className="bg-brand-100 p-4 rounded-xl">Fotograf</div>
          <div className="bg-brand-100 p-4 rounded-xl">Florysta</div>
        </div>
      </div>
    </section>
  );
}

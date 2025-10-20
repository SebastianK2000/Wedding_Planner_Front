export default function Tasks() {
  const todos = [
    { label: "Rezerwacja sali", done: true },
    { label: "Wybrać fotografa", done: false },
    { label: "Ustalić menu", done: false },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Zadania</h2>
      <div className="bg-white rounded-2xl shadow p-4">
        <ul className="space-y-2">
          {todos.map((t) => (
            <li key={t.label} className="flex items-center gap-3 p-3 rounded-xl bg-brand-100">
              <input type="checkbox" defaultChecked={t.done} className="h-4 w-4" />
              <span>{t.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
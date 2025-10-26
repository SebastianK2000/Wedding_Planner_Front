export default function Timeline() {
  const items = [
    { when: "12 mies.", what: "Ustal budżet i listę gości" },
    { when: "9 mies.", what: "Zarezerwuj salę i fotografa" },
    { when: "6 mies.", what: "Muzyka i florysta" },
    { when: "3 mies.", what: "Zaproszenia i transport" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Harmonogram</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((i) => (
          <div key={i.when} className="bg-white rounded-2xl shadow p-4">
            <div className="text-muted text-sm">{i.when} przed</div>
            <div className="font-medium">{i.what}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
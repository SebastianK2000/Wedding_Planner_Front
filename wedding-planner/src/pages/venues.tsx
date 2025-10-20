import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const VENUES = [
  {
    id: "v1",
    name: "Dwór Pod Dębami",
    city: "Kraków",
    capacity: 180,
    pricePerPerson: 290,
    rating: 4.7,
    tags: ["rustykalna", "ogród", "noclegi"],
    image:
      "https://images.unsplash.com/photo-1521540216272-a50305cd4421?q=80&w=1200&auto=format&fit=crop",
    description:
      "Elegancki dwór z ogrodem i oranżerią. Możliwość ceremonii plenerowej, 45 miejsc noclegowych.",
  },
  {
    id: "v2",
    name: "Stara Stajnia Loft",
    city: "Warszawa",
    capacity: 120,
    pricePerPerson: 350,
    rating: 4.8,
    tags: ["loft", "industrial", "wegańskie menu"],
    image:
      "https://images.unsplash.com/photo-1523906630133-f6934a1ab1b9?q=80&w=1200&auto=format&fit=crop",
    description:
      "Industrialny klimat, cegła i stal, doskonałe na nowoczesne przyjęcia. Sala + antresola.",
  },
  {
    id: "v3",
    name: "Pałac nad Jeziorem",
    city: "Gdańsk",
    capacity: 220,
    pricePerPerson: 410,
    rating: 4.9,
    tags: ["pałac", "nad wodą", "ceremonia plenerowa"],
    image:
      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop",
    description:
      "Klasyczny pałac z widokiem na jezioro, pomost do first look i zdjęć plenerowych.",
  },
  {
    id: "v4",
    name: "Folwark Słoneczne Wzgórza",
    city: "Wrocław",
    capacity: 90,
    pricePerPerson: 240,
    rating: 4.5,
    tags: ["folwark", "rustic", "namiot"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    description:
      "Sielski folwark z opcją namiotu. Idealny dla mniejszych wesel, parkiet na świeżym powietrzu.",
  },
];

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "ocena" | "pojemnosc";

export default function Venues() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [minCap, setMinCap] = useState(0);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [sort, setSort] = useState<SortKey>("rekomendowane");

  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(VENUES.map(v => v.city)))], []);

  const filtered = useMemo(() => {
    let items = VENUES.filter(v =>
      (q ? v.name.toLowerCase().includes(q.toLowerCase()) || v.tags.some(t => t.includes(q.toLowerCase())) : true) &&
      (city === "Wszystkie" ? true : v.city === city) &&
      v.capacity >= minCap &&
      v.pricePerPerson >= priceMin &&
      v.pricePerPerson <= priceMax
    );

    switch (sort) {
      case "cena-rosn":
        items = items.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
        break;
      case "cena-malej":
        items = items.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
        break;
      case "ocena":
        items = items.sort((a, b) => b.rating - a.rating);
        break;
      case "pojemnosc":
        items = items.sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        items = items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [q, city, minCap, priceMin, priceMax, sort]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-3 bg-white rounded-2xl shadow p-4 h-fit sticky top-24">
        <h2 className="text-lg font-semibold mb-3">Filtry</h2>
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-muted mb-1">Szukaj</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="nazwa, tag..."
              className="w-full rounded-xl border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div>
            <label className="block text-muted mb-1">Miasto</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-brand-200 px-3 py-2"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-muted mb-1">Minimalna pojemność</label>
            <input
              type="number"
              min={0}
              value={minCap}
              onChange={(e) => setMinCap(Number(e.target.value))}
              className="w-full rounded-xl border border-brand-200 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-muted mb-1">Cena min (zł/os)</label>
              <input
                type="number"
                min={0}
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full rounded-xl border border-brand-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-muted mb-1">Cena max (zł/os)</label>
              <input
                type="number"
                min={0}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full rounded-xl border border-brand-200 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted mb-1">Sortowanie</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full rounded-xl border border-brand-200 px-3 py-2"
            >
              <option value="rekomendowane">Rekomendowane</option>
              <option value="cena-rosn">Cena: rosnąco</option>
              <option value="cena-malej">Cena: malejąco</option>
              <option value="ocena">Ocena</option>
              <option value="pojemnosc">Pojemność</option>
            </select>
          </div>
        </div>
      </aside>

      <section className="lg:col-span-9">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sale weselne</h2>
          <div className="text-sm text-muted">Znaleziono: {filtered.length}</div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <Card key={v.id} className="overflow-hidden rounded-2xl">
              <img src={v.image} alt={v.name} className="h-40 w-full object-cover" />
              <CardHeader>
                <CardTitle className="text-base">{v.name}</CardTitle>
                <div className="text-sm text-muted">{v.city} • do {v.capacity} osób</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Ocena</span>
                  <span className="font-medium">{v.rating.toFixed(1)} / 5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Cena / os.</span>
                  <span className="font-semibold">{numberFmt(v.pricePerPerson)} zł</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {v.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-brand-100">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-2xl flex-1">Podgląd</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{v.name}</DialogTitle>
                      </DialogHeader>
                      <img src={v.image} alt={v.name} className="h-56 w-full object-cover rounded-xl" />
                      <p className="text-sm text-muted">{v.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>Miasto: <strong>{v.city}</strong></div>
                        <div>Pojemność: <strong>{v.capacity}</strong></div>
                        <div>Ocena: <strong>{v.rating.toFixed(1)}</strong></div>
                        <div>Cena / os.: <strong>{numberFmt(v.pricePerPerson)} zł</strong></div>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Button className="bg-accent-500 hover:bg-accent-600 rounded-2xl">Dodaj do planu</Button>
                        <Button variant="outline" className="rounded-2xl">Zapytaj o termin</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button className="bg-accent-500 hover:bg-accent-600 rounded-2xl flex-1">Rezerwuj</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

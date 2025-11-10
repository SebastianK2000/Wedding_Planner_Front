import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, ChevronRight, Filter, Sparkles, Building2, Info, Heart, X } from "lucide-react";

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

const CART_KEY_VENUES = "wp_cart_venues";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "ocena" | "pojemnosc";

type BookingForm = {
  date: string;
  guests: number;
  notes: string;
};

export default function VenuesPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [capacity, setCapacity] = useState([0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [onlyTop, setOnlyTop] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wp_venues_shortlist");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const cities = useMemo(
    () => ["Wszystkie", ...Array.from(new Set(VENUES.map((v) => v.city)))],
    []
  );

  const filtered = useMemo(() => {
    let items = VENUES.filter((v) =>
      (q
        ? v.name.toLowerCase().includes(q.toLowerCase()) ||
          v.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
        : true) &&
      (city === "Wszystkie" ? true : v.city === city) &&
      v.capacity >= capacity[0] &&
      v.pricePerPerson >= priceRange[0] &&
      v.pricePerPerson <= priceRange[1] &&
      (!onlyTop || v.rating >= 4.7)
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
  }, [q, city, capacity, priceRange, onlyTop, sort]);

  useEffect(() => {
    localStorage.setItem("wp_venues_shortlist", JSON.stringify(shortlist));
  }, [shortlist]);

  const toggleShortlist = (id: string) => {
    setShortlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const openBooking = (id: string) => setSelected(id);
  const closeBooking = () => setSelected(null);

  const selectedVenue = useMemo(
    () => VENUES.find((v) => v.id === selected) || null,
    [selected]
  );

  const [booking, setBooking] = useState<BookingForm>({ date: "", guests: 100, notes: "" });
  useEffect(() => {
    if (!selectedVenue) return;
    setBooking((b) => ({ ...b, guests: Math.min(Math.max(60, b.guests), selectedVenue.capacity) }));
  }, [selectedVenue]);

  const estTotal = useMemo(() => {
    if (!selectedVenue) return 0;
    const g = Math.min(Math.max(1, booking.guests || 1), selectedVenue.capacity);
    return g * selectedVenue.pricePerPerson;
  }, [selectedVenue, booking.guests]);

  function addToPlan(v: typeof VENUES[number]) {
      try {
        type Venue = typeof VENUES[number];
        const raw = localStorage.getItem(CART_KEY_VENUES);
        const prev: Venue[] = raw ? (JSON.parse(raw) as Venue[]) : [];
        const exists = prev.some((p) => p.id === v.id);
        const next = exists ? prev : [...prev, v];
        localStorage.setItem(CART_KEY_VENUES, JSON.stringify(next));
      } catch (e) {
        console.debug("addToPlan error:", e);
      }
    }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
              <Sparkles className="h-4 w-4" /> Inteligentna rezerwacja sal
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Sale weselne</h1>
            <p className="mt-1 text-sm text-stone-600 max-w-prose">Porównuj oferty, sprawdzaj pojemność i koszty per osoba, twórz shortlistę i wyślij zapytanie o termin w 1 miejscu.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <div className="text-lg font-semibold">{VENUES.length}</div>
              <div className="text-xs text-stone-500">obiektów</div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <div className="text-lg font-semibold">{numberFmt(Math.min(...VENUES.map(v=>v.pricePerPerson)))} zł</div>
              <div className="text-xs text-stone-500">od ceny / os.</div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <div className="text-lg font-semibold">4.9</div>
              <div className="text-xs text-stone-500">max ocena</div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-3 shadow md:hidden">
        <div className="text-sm text-stone-600">Znaleziono: <strong>{filtered.length}</strong></div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-2xl"><Filter className="h-4 w-4 mr-2" />Filtry</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle>Filtry</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-stone-500">Szukaj</label>
                <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="nazwa, tag..." className="rounded-2xl" />
              </div>
              <div>
                <label className="mb-1 block text-stone-500">Miasto</label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Wybierz" /></SelectTrigger>
                  <SelectContent>
                    {cities.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-stone-500">Minimalna pojemność</label>
                <Slider defaultValue={capacity} value={capacity} min={0} max={300} step={10} onValueChange={setCapacity} />
                <div className="mt-1 text-xs text-stone-500">od <strong>{capacity[0]}</strong> osób</div>
              </div>
              <div>
                <label className="mb-2 block text-stone-500">Cena / os. (zł)</label>
                <Slider value={priceRange} min={0} max={600} step={10} onValueChange={(v)=>setPriceRange(v as [number, number])} />
                <div className="mt-1 text-xs text-stone-500">{numberFmt(priceRange[0])} – {numberFmt(priceRange[1])} zł</div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="onlyTop" checked={onlyTop} onCheckedChange={(v)=>setOnlyTop(Boolean(v))} />
                <label htmlFor="onlyTop">Tylko najlepiej oceniane (≥ 4.7)</label>
              </div>
              <div>
                <label className="mb-1 block text-stone-500">Sortowanie</label>
                <Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}>
                  <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rekomendowane">Rekomendowane</SelectItem>
                    <SelectItem value="cena-rosn">Cena: rosnąco</SelectItem>
                    <SelectItem value="cena-malej">Cena: malejąco</SelectItem>
                    <SelectItem value="ocena">Ocena</SelectItem>
                    <SelectItem value="pojemnosc">Pojemność</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="mt-6">
              <Button className="rounded-2xl w-full" onClick={()=>{}}>
                Zastosuj
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="sticky top-24 hidden h-fit rounded-2xl border border-stone-200 bg-white p-4 shadow lg:col-span-3 md:block">
          <h2 className="mb-3 text-lg font-semibold">Filtry</h2>
          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-stone-500">Szukaj</label>
              <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="nazwa, tag..." className="rounded-2xl" />
            </div>
            <div>
              <label className="mb-1 block text-stone-500">Miasto</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Wybierz" /></SelectTrigger>
                <SelectContent>
                  {cities.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-stone-500">Minimalna pojemność</label>
              <Slider value={capacity} min={0} max={300} step={10} onValueChange={setCapacity} />
              <div className="mt-1 text-xs text-stone-500">od <strong>{capacity[0]}</strong> osób</div>
            </div>
            <div>
              <label className="mb-2 block text-stone-500">Cena / os. (zł)</label>
              <Slider value={priceRange} min={0} max={600} step={10} onValueChange={(v)=>setPriceRange(v as [number, number])} />
              <div className="mt-1 text-xs text-stone-500">{numberFmt(priceRange[0])} – {numberFmt(priceRange[1])} zł</div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="onlyTop_d" checked={onlyTop} onCheckedChange={(v)=>setOnlyTop(Boolean(v))} />
              <label htmlFor="onlyTop_d">Tylko najlepiej oceniane (≥ 4.7)</label>
            </div>
            <div>
              <label className="mb-1 block text-stone-500">Sortowanie</label>
              <Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}>
                <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rekomendowane">Rekomendowane</SelectItem>
                  <SelectItem value="cena-rosn">Cena: rosnąco</SelectItem>
                  <SelectItem value="cena-malej">Cena: malejąco</SelectItem>
                  <SelectItem value="ocena">Ocena</SelectItem>
                  <SelectItem value="pojemnosc">Pojemność</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Shortlista</span>
              {shortlist.length > 0 && (
                <button className="text-xs text-stone-500 hover:underline" onClick={()=>setShortlist([])}>Wyczyść</button>
              )}
            </div>
            {shortlist.length === 0 ? (
              <p className="text-xs text-stone-500">Dodaj obiekty, klikając serduszko na karcie.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {shortlist.map((id)=>{
                  const v = VENUES.find(x=>x.id===id)!;
                  return (
                    <li key={id} className="flex items-center justify-between gap-2">
                      <span className="truncate">{v.name}</span>
                      <Button size="sm" variant="outline" className="h-7 rounded-lg">Zapytaj <ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <section className="lg:col-span-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dostępne obiekty</h2>
            <div className="text-sm text-stone-500">Znaleziono: {filtered.length}</div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-600">
              Brak wyników dla wybranych filtrów. Spróbuj zwiększyć zakres cen lub zmniejszyć minimalną pojemność.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v) => (
                <Card key={v.id} className="overflow-hidden rounded-2xl">
                  <div className="relative">
                    <img src={v.image} alt={v.name} className="h-40 w-full object-cover" />
                    <button
                      aria-label="Dodaj do shortlisty"
                      onClick={()=>toggleShortlist(v.id)}
                      className={`absolute right-3 top-3 inline-flex items-center justify-center rounded-full border bg-white p-2 shadow ${shortlist.includes(v.id) ? "border-rose-300" : "border-stone-200"}`}
                    >
                      {shortlist.includes(v.id) ? <Heart className="h-4 w-4 fill-rose-500 text-rose-500"/> : <Heart className="h-4 w-4"/>}
                    </button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{v.name}</CardTitle>
                    <div className="text-sm text-stone-500 flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {v.city} • do {v.capacity} osób</div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500 flex items-center gap-1"><Star className="h-4 w-4"/> Ocena</span>
                      <span className="font-medium">{v.rating.toFixed(1)} / 5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">Cena / os.</span>
                      <span className="font-semibold">{numberFmt(v.pricePerPerson)} zł</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {v.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="rounded-full bg-brand-100 text-stone-700">{t}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 rounded-2xl">Podgląd</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {v.name}</DialogTitle>
                          </DialogHeader>
                          <img src={v.image} alt={v.name} className="h-56 w-full rounded-xl object-cover" />
                          <p className="text-sm text-stone-600">{v.description}</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>Miasto: <strong>{v.city}</strong></div>
                            <div>Pojemność: <strong>{v.capacity}</strong></div>
                            <div>Ocena: <strong>{v.rating.toFixed(1)}</strong></div>
                            <div>Cena / os.: <strong>{numberFmt(v.pricePerPerson)} zł</strong></div>
                          </div>
                          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600 flex items-start gap-2"><Info className="mt-0.5 h-4 w-4"/> Pamiętaj o minimalnej liczbie gości wymaganej przez salę w soboty — zapytaj w wiadomości.</div>
                          <div className="pt-2 flex gap-2">
                            <Button className="rounded-2xl bg-accent-500 hover:bg-accent-600" onClick={()=>addToPlan(v)}>Dodaj do planu</Button>
                            <Button variant="outline" className="rounded-2xl" onClick={()=>openBooking(v.id)}>Zapytaj o termin</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button className="flex-1 rounded-2xl bg-accent-500 hover:bg-accent-600" onClick={()=>openBooking(v.id)}>Rezerwuj</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <Sheet open={!!selected} onOpenChange={(o)=> !o && closeBooking()}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Rezerwacja sali</SheetTitle>
          </SheetHeader>
          {!selectedVenue ? (
            <div className="py-6 text-sm text-stone-600">Wybierz obiekt, aby kontynuować.</div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <img src={selectedVenue.image} alt={selectedVenue.name} className="h-14 w-20 rounded-lg object-cover" />
                <div>
                  <div className="font-medium">{selectedVenue.name}</div>
                  <div className="text-xs text-stone-500 flex items-center gap-2"><MapPin className="h-3.5 w-3.5"/> {selectedVenue.city} • do {selectedVenue.capacity} osób</div>
                </div>
                <button className="ml-auto rounded-full border border-stone-200 p-1" onClick={closeBooking}><X className="h-4 w-4"/></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Data</label>
                  <Input type="date" value={booking.date} onChange={(e)=>setBooking(b=>({...b, date: e.target.value}))} className="rounded-2xl" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Liczba gości</label>
                  <Input type="number" min={1} max={selectedVenue.capacity} value={booking.guests} onChange={(e)=>setBooking(b=>({...b, guests: Number(e.target.value || 0)}))} className="rounded-2xl" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs text-stone-500">Notatki</label>
                  <textarea rows={3} value={booking.notes} onChange={(e)=>setBooking(b=>({...b, notes: e.target.value}))} className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm" placeholder="np. układ stołów w podkowę, strefa chill, menu wege 20%" />
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Szacowany koszt (menu × goście)</span>
                  <strong>{numberFmt(estTotal)} zł</strong>
                </div>
                <div className="mt-1 text-xs text-stone-500">Cena orientacyjna na podstawie ceny / os. — nie obejmuje napojów alkoholowych ani dekoracji.</div>
              </div>
            </div>
          )}

          <SheetFooter className="mt-6">
            <div className="flex w-full items-center justify-between gap-2">
              <Button variant="outline" className="rounded-2xl" onClick={closeBooking}>Anuluj</Button>
              <Button className="rounded-2xl bg-accent-500 hover:bg-accent-600">Wyślij zapytanie</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

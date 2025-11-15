import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Filter, Sparkles, Info, Heart, X, Users, Utensils, Calendar, ArrowLeft, Wifi, Car, Music, Coffee, Check } from "lucide-react";

const VENUES = [
  {
    id: "v1",
    name: "Dwór Pod Dębami",
    city: "Kraków",
    capacity: 180,
    pricePerPerson: 290,
    rating: 4.7,
    tags: ["rustykalna", "ogród", "noclegi"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    description: "Elegancki dwór z historią sięgającą XIX wieku. Otoczony stuletnim parkiem dębowym, oferuje niepowtarzalną atmosferę prywatności i luksusu. Do dyspozycji gości jest przepiękna, przeszklona oranżeria idealna na drink bar, a także stylowe wnętrza pałacowe. Obiekt posiada bazę noclegową dla 45 osób w apartamentach urządzonych w stylu epoki.",
    features: ["Noclegi dla gości", "Parking", "Ogród", "Klimatyzacja", "Menu wegańskie"]
  },
  {
    id: "v2",
    name: "Stara Stajnia Loft",
    city: "Warszawa",
    capacity: 120,
    pricePerPerson: 350,
    rating: 4.8,
    tags: ["loft", "industrial", "wegańskie menu"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Industrialny klimat w sercu miasta. Stara Stajnia to zrewitalizowany budynek z 1905 roku, gdzie surowa cegła łączy się z nowoczesnym designem i stalą. Wysokie na 6 metrów wnętrza zapewniają niesamowitą akustykę i przestrzeń. Sala posiada antresolę idealną na strefę chillout oraz bezpośrednie wyjście na prywatne patio.",
    features: ["Klimatyzacja", "Scena", "Barman", "Oświetlenie", "Projektor"]
  },
  {
    id: "v3",
    name: "Pałac nad Jeziorem",
    city: "Gdańsk",
    capacity: 220,
    pricePerPerson: 410,
    rating: 4.9,
    tags: ["pałac", "nad wodą", "plener"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Klasyczny pałac z widokiem na jezioro, własnym molo i lądowiskiem dla helikopterów. To miejsce dla par szukających absolutnego prestiżu. Ceremonia zaślubin może odbyć się na pomoście przy zachodzie słońca. Wnętrza zdobione kryształowymi żyrandolami i marmurem.",
    features: ["Widok na wodę", "Molo", "Noclegi luxury", "Fajerwerki", "Parking VIP"]
  },
   {
    id: "v4",
    name: "Folwark Słoneczne Wzgórza",
    city: "Wrocław",
    capacity: 90,
    pricePerPerson: 240,
    rating: 4.5,
    tags: ["folwark", "rustic", "namiot"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Sielski folwark z opcją namiotu. Idealny dla mniejszych wesel, parkiet na świeżym powietrzu.",
    features: ["Plener", "Ognisko", "Zwierzęta mile widziane"]
  },
  {
    id: "v5",
    name: "Oranżeria Magnolia",
    city: "Poznań",
    capacity: 150,
    pricePerPerson: 320,
    rating: 4.6,
    tags: ["oranżeria", "ogród", "boho"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Szklana oranżeria otoczona zielenią. Idealna na śluby boho, dodatkowa strefa chillout.",
    features: ["Przeszklony dach", "Ogród zimowy", "Klimatyzacja"]
  },
  {
    id: "v6",
    name: "Barn Forty Three",
    city: "Łódź",
    capacity: 130,
    pricePerPerson: 275,
    rating: 4.7,
    tags: ["stodoła", "rustykalna", "dancefloor"],
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
    description: "Nowoczesna stodoła z wysokim sufitem i widoczną więźbą, efektowne światła i duży parkiet.",
    features: ["Nagłośnienie", "Światła", "Duży parkiet"]
  },
   {
    id: "v7",
    name: "Villa Różana",
    city: "Sopot",
    capacity: 100,
    pricePerPerson: 360,
    rating: 4.8,
    tags: ["villa", "blisko morza", "noclegi"],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
    description: "Kamienica w kurortowym stylu, 10 minut spacerem od plaży, taras na aperitivo.",
    features: ["Blisko plaży", "Taras", "Pokoje"]
  },
  {
    id: "v8",
    name: "Nowa Fabryka Eventów",
    city: "Katowice",
    capacity: 200,
    pricePerPerson: 300,
    rating: 4.6,
    tags: ["industrial", "loft", "scena"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    description: "Postindustrialna przestrzeń z antresolą i sceną dla zespołu, możliwość dojazdu food trucków.",
    features: ["Food trucki", "Scena", "Wysokie wnętrza"]
  },
  {
    id: "v9",
    name: "Dworek Winny Zakątek",
    city: "Zielona Góra",
    capacity: 140,
    pricePerPerson: 285,
    rating: 4.7,
    tags: ["dworek", "winnica", "plener"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Dworek pośród winorośli z altaną ślubną i widokiem na wzgórza winnicy, regionalne menu.",
    features: ["Wino z winnicy", "Altana", "Kuchnia regionalna"]
  },
];

// const CART_KEY_VENUES = "wp_cart_venues";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "ocena" | "pojemnosc";

function VenueDetailsPage({ venue, onBack, onBook }: { venue: typeof VENUES[0], onBack: () => void, onBook: () => void }) {
  const [booking, setBooking] = useState({ date: "", guests: 100 });
  
  const estTotal = useMemo(() => {
    const g = Math.min(Math.max(1, booking.guests || 1), venue.capacity);
    return g * venue.pricePerPerson;
  }, [venue, booking.guests]);

  const getIcon = (feature: string) => {
    if(feature.includes("Wifi") || feature.includes("Internet")) return <Wifi className="h-5 w-5"/>;
    if(feature.includes("Parking") || feature.includes("Food")) return <Car className="h-5 w-5"/>;
    if(feature.includes("Scena") || feature.includes("Nagłośnienie")) return <Music className="h-5 w-5"/>;
    return <Check className="h-5 w-5"/>;
  }

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-50 border-b border-stone-100 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-stone-100 rounded-full pl-2 pr-4">
          <ArrowLeft className="h-5 w-5" /> Wróć do listy
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-full" onClick={()=>{/* Share logic */}}>Udostępnij</Button>
           <Button variant="outline" className="rounded-full" onClick={()=>{/* Like logic */}}><Heart className="h-4 w-4 mr-2" /> Zapisz</Button>
        </div>
      </div>

      <div className="relative h-[50vh] w-full md:h-[60vh]">
        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full max-w-7xl mx-auto">
          <Badge className="bg-rose-500 hover:bg-rose-600 mb-4 border-0">TOP Wybór</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{venue.name}</h1>
          <div className="flex items-center gap-4 text-lg font-medium opacity-90">
            <span className="flex items-center gap-1"><MapPin className="h-5 w-5" /> {venue.city}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> {venue.rating}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-10">
          <div className="flex gap-6 border-b border-stone-100 pb-8">
            <div className="space-y-1">
               <span className="text-sm text-stone-500">Pojemność</span>
               <div className="font-semibold text-lg flex items-center gap-2"><Users className="h-5 w-5 text-stone-400"/> do {venue.capacity} os.</div>
            </div>
            <div className="w-px bg-stone-200 h-12 self-center"/>
             <div className="space-y-1">
               <span className="text-sm text-stone-500">Cena talerzyka</span>
               <div className="font-semibold text-lg flex items-center gap-2"><Utensils className="h-5 w-5 text-stone-400"/> {venue.pricePerPerson} zł</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O miejscu</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{venue.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">Co oferuje to miejsce?</h2>
            <div className="grid grid-cols-2 gap-4">
              {venue.features?.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700">
                  {getIcon(f)} <span className="font-medium">{f}</span>
                </div>
              )) || <div className="text-stone-500">Brak danych o udogodnieniach</div>}
              {!venue.features && (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700"><Wifi className="h-5 w-5"/> Wi-Fi dla gości</div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700"><Car className="h-5 w-5"/> Darmowy parking</div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700"><Coffee className="h-5 w-5"/> Serwis kawowy</div>
                  </>
              )}
            </div>
          </div>

        </div>

        <div className="relative">
          <div className="sticky top-32 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/50">
            <div className="flex items-end justify-between mb-6">
               <div>
                 <span className="text-3xl font-bold text-stone-900">{venue.pricePerPerson} zł</span>
                 <span className="text-stone-500"> / osoba</span>
               </div>
               <div className="flex items-center gap-1 text-sm font-medium">
                 <Star className="h-4 w-4 fill-stone-900" /> {venue.rating}
               </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                 <div className="border-b border-stone-200 p-3 bg-stone-50">
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Data</label>
                   <input type="date" className="w-full bg-transparent text-sm outline-none cursor-pointer" value={booking.date} onChange={(e)=>setBooking({...booking, date: e.target.value})} />
                 </div>
                 <div className="p-3 bg-white">
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Goście</label>
                   <input type="number" min={10} max={venue.capacity} value={booking.guests} onChange={(e)=>setBooking({...booking, guests: Number(e.target.value)})} className="w-full bg-transparent text-sm outline-none" />
                 </div>
              </div>

              <Button onClick={onBook} size="lg" className="w-full h-14 text-lg rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200">
                Wyślij zapytanie
              </Button>
              <p className="text-center text-xs text-stone-400">Jeszcze nie płacisz. To tylko zapytanie.</p>
            </div>

            <div className="space-y-3 text-stone-600 text-sm border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span className="underline decoration-stone-300">Szacowany koszt menu</span>
                <span>{numberFmt(estTotal)} zł</span>
              </div>
              <div className="flex justify-between">
                <span className="underline decoration-stone-300">Obsługa serwisowa (10%)</span>
                <span>{numberFmt(estTotal * 0.1)} zł</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-100 mt-2">
                <span>Suma (estymacja)</span>
                <span>{numberFmt(estTotal * 1.1)} zł</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default function VenuesPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [capacity, setCapacity] = useState([0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [onlyTop] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);

    const [minPrice, maxPrice] = useMemo(() => {
       if (VENUES.length === 0) return [0, 20000];
       const prices = VENUES.map(m => m.pricePerPerson);
       return [Math.min(...prices), Math.max(...prices)];
    }, []);
  
    useEffect(() => { setPriceRange([minPrice, maxPrice]) }, [minPrice, maxPrice]);

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

  const toggleShortlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShortlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const openBooking = (id: string) => setSelected(id);
  const closeBooking = () => setSelected(null);

  const selectedVenue = useMemo(
    () => VENUES.find((v) => v.id === selected) || null,
    [selected]
  );

  const [booking, setBooking] = useState<{ date: string; guests: number; notes: string }>({ date: "", guests: 100, notes: "" });
  
  useEffect(() => {
    if (!selectedVenue) return;
    setBooking((b) => ({ ...b, guests: Math.min(Math.max(60, b.guests), selectedVenue.capacity) }));
  }, [selectedVenue]);

  const estTotal = useMemo(() => {
    if (!selectedVenue) return 0;
    const g = Math.min(Math.max(1, booking.guests || 1), selectedVenue.capacity);
    return g * selectedVenue.pricePerPerson;
  }, [selectedVenue, booking.guests]);
  
  const detailsVenue = useMemo(() => VENUES.find(v => v.id === viewDetailsId), [viewDetailsId]);

  if (viewDetailsId && detailsVenue) {
    return (
      <>
        <VenueDetailsPage 
          venue={detailsVenue} 
          onBack={() => setViewDetailsId(null)} 
          onBook={() => openBooking(detailsVenue.id)}
        />
        <Sheet open={!!selected} onOpenChange={(o)=> !o && closeBooking()}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 sm:rounded-l-[2rem] overflow-hidden flex flex-col z-[60]">
           {selectedVenue && (
               <>
               <div className="relative h-48 shrink-0">
                   <img src={selectedVenue.image} className="h-full w-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                   <div className="absolute bottom-4 left-6 right-6 text-white">
                       <h3 className="text-xl font-bold">{selectedVenue.name}</h3>
                       <p className="text-sm text-white/80 flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {selectedVenue.city}</p>
                   </div>
                   <button onClick={closeBooking} className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40"><X className="h-5 w-5"/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div>
                       <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-rose-500"/> Szczegóły zapytania</h4>
                       <div className="space-y-4">
                           <div className="space-y-1.5">
                               <label className="text-sm font-medium text-stone-700">Planowana data</label>
                               <Input type="date" className="h-12 rounded-xl bg-stone-50 border-stone-200" value={booking.date} onChange={(e)=>setBooking(b=>({...b, date: e.target.value}))} />
                           </div>
                           <div className="space-y-1.5">
                               <label className="text-sm font-medium text-stone-700">Liczba gości (max {selectedVenue.capacity})</label>
                               <div className="flex items-center gap-3">
                                   <Slider value={[booking.guests]} min={10} max={selectedVenue.capacity} step={1} onValueChange={([v])=>setBooking(b=>({...b, guests: v}))} className="flex-1" />
                                   <div className="w-16 h-12 flex items-center justify-center rounded-xl border border-stone-200 bg-white font-semibold">
                                       {booking.guests}
                                   </div>
                               </div>
                           </div>
                            <div className="space-y-1.5">
                               <label className="text-sm font-medium text-stone-700">Dodatkowe życzenia</label>
                               <textarea 
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-stone-900"
                                placeholder="Opisz swoje wymagania..."
                                value={booking.notes}
                                onChange={(e)=>setBooking(b=>({...b, notes: e.target.value}))}
                               />
                           </div>
                       </div>
                   </div>

                   <div className="rounded-2xl bg-stone-900 p-5 text-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-stone-400 text-sm">Estymacja kosztów</span>
                            <Info className="h-4 w-4 text-stone-500" />
                        </div>
                        <div className="text-3xl font-bold">{numberFmt(estTotal)} zł</div>
                        <div className="text-sm text-stone-500 mt-1">Cena talerzyka × liczba gości</div>
                   </div>
               </div>

               <SheetFooter className="p-6 pt-2 bg-white border-t border-stone-100">
                   <Button size="lg" className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 h-14 text-lg shadow-lg shadow-rose-900/20">Wyślij darmowe zapytanie</Button>
               </SheetFooter>
               </>
           )}
        </SheetContent>
      </Sheet>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              <Sparkles className="h-3.5 w-3.5" /> Sezon ślubny 2025
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              Znajdź wymarzoną salę
            </h1>
            <p className="max-w-xl text-stone-500">
              Przeglądaj wyselekcjonowane obiekty, sprawdzaj dostępność i rezerwuj terminy w jednym miejscu.
            </p>
          </div>

          <div className="flex gap-4">
             <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-black/5">
               <span className="text-2xl font-bold text-stone-900">{VENUES.length}</span>
               <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Obiektów</span>
             </div>
             <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-black/5">
               <span className="text-2xl font-bold text-stone-900">{numberFmt(Math.min(...VENUES.map(v=>v.pricePerPerson)))}</span>
               <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Od zł/os.</span>
             </div>
          </div>
        </header>

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm md:hidden">
          <span className="text-sm font-medium text-stone-600">Wyniki: {filtered.length}</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full border-stone-200"><Filter className="mr-2 h-4 w-4" /> Filtry</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem]">
               <SheetHeader className="mb-5 text-left">
                <SheetTitle className="text-xl">Filtrowanie</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 px-1">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Szukaj</label>
                    <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Np. stodoła, loft..." className="h-11 rounded-xl bg-stone-50" />
                  </div>
                  <Button className="w-full h-12 rounded-xl bg-stone-900 text-white hover:bg-stone-800">Pokaż wyniki</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                 <h2 className="font-semibold text-stone-900">Filtry</h2>
                 { (q || city !== "Wszystkie") && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600 hover:text-rose-700 hover:bg-transparent" onClick={()=>{setQ(""); setCity("Wszystkie")}}>Reset</Button>}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Nazwa lub styl</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. industrial" className="bg-stone-50 border-transparent focus:bg-white transition-all rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Lokalizacja</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="bg-stone-50 border-transparent focus:bg-white rounded-xl"><SelectValue placeholder="Wybierz" /></SelectTrigger>
                    <SelectContent>
                      {cities.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                     <span className="text-stone-600">Pojemność</span>
                     <span className="font-medium">{capacity[0]}+ osób</span>
                    </div>
                  <Slider value={capacity} min={0} max={300} step={10} onValueChange={setCapacity} className="py-2" />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                     <span className="text-stone-600">Budżet / os.</span>
                     <span className="font-medium">do {numberFmt(priceRange[1])} zł</span>
                    </div>
                      <Slider value={[priceRange[0]]} min={minPrice} max={maxPrice} step={100} onValueChange={([v]) => setPriceRange([v, priceRange[1]])} className="py-2" />
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Sortowanie</label>
                  <Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}>
                    <SelectTrigger className="bg-transparent border-stone-200 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rekomendowane">Rekomendowane</SelectItem>
                      <SelectItem value="cena-rosn">Cena: rosnąco</SelectItem>
                      <SelectItem value="cena-malej">Cena: malejąco</SelectItem>
                      <SelectItem value="ocena">Ocena: najwyższa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {shortlist.length > 0 && (
                <div className="mt-6 rounded-3xl bg-rose-50 p-6 text-rose-900">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <Heart className="h-4 w-4 fill-rose-600 text-rose-600" /> Ulubione ({shortlist.length})
                  </div>
                  <div className="space-y-2">
                    {shortlist.slice(0,3).map(id => {
                         const v = VENUES.find(x=>x.id===id);
                         if(!v) return null;
                         return (
                             <div key={id} className="flex items-center justify-between text-sm">
                                 <span className="truncate max-w-[140px]">{v.name}</span>
                                 <button onClick={()=>openBooking(id)} className="text-xs font-medium underline decoration-rose-300 underline-offset-2">Zapytaj</button>
                             </div>
                         )
                    })}
                    {shortlist.length > 3 && <div className="text-xs opacity-60 text-center pt-1">+ {shortlist.length - 3} więcej</div>}
                  </div>
                </div>
            )}
          </aside>

          <section className="lg:col-span-9">
             {filtered.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white text-center">
                <div className="rounded-full bg-stone-100 p-4"><Filter className="h-6 w-6 text-stone-400" /></div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">Brak wyników</h3>
                <p className="text-stone-500">Zmień kryteria wyszukiwania.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v) => (
                  
                  <Card key={v.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img 
                        src={v.image} 
                        alt={v.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={(e)=>toggleShortlist(e, v.id)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${shortlist.includes(v.id) ? "bg-rose-500 text-white" : "bg-white/30 text-white hover:bg-white/50"}`}
                        >
                          <Heart className={`h-5 w-5 ${shortlist.includes(v.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                         {v.rating >= 4.8 && <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm hover:bg-white px-2"><Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" /> {v.rating}</Badge>}
                      </div>
                      
                      <div className="absolute bottom-3 left-4 z-10 text-white">
                           <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Cena za osobę</p>
                           <p className="text-xl font-bold">{v.pricePerPerson} zł</p>
                       </div>
                    </div>

                    <CardContent className="flex-1 p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                             <h3 className="text-lg font-bold text-stone-900 leading-tight">{v.name}</h3>
                             <p className="mt-1 flex items-center text-sm text-stone-500">
                                <MapPin className="mr-1 h-3.5 w-3.5 text-stone-400" /> {v.city}
                             </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                         <Badge variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-200 font-normal">
                             <Users className="mr-1.5 h-3 w-3" /> do {v.capacity}
                         </Badge>
                         {v.tags.slice(0,2).map(t => (
                             <Badge key={t} variant="outline" className="text-stone-500 border-stone-200 font-normal">{t}</Badge>
                         ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 gap-3">
                        <Button onClick={() => setViewDetailsId(v.id)} variant="outline" className="flex-1 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900">Szczegóły</Button>
                        <Button onClick={()=>openBooking(v.id)} className="flex-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20">Rezerwuj</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o)=> !o && closeBooking()}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 sm:rounded-l-[2rem] overflow-hidden flex flex-col z-[60]">
           {selectedVenue && (
               <>
               <div className="relative h-48 shrink-0">
                   <img src={selectedVenue.image} className="h-full w-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                   <div className="absolute bottom-4 left-6 right-6 text-white">
                       <h3 className="text-xl font-bold">{selectedVenue.name}</h3>
                       <p className="text-sm text-white/80 flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {selectedVenue.city}</p>
                   </div>
                   <button onClick={closeBooking} className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40"><X className="h-5 w-5"/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div>
                       <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-rose-500"/> Szczegóły zapytania</h4>
                       <div className="space-y-4">
                           <div className="space-y-1.5">
                               <label className="text-sm font-medium text-stone-700">Planowana data</label>
                               <Input type="date" className="h-12 rounded-xl bg-stone-50 border-stone-200" value={booking.date} onChange={(e)=>setBooking(b=>({...b, date: e.target.value}))} />
                           </div>
                           <div className="space-y-1.5">
                               <label className="text-sm font-medium text-stone-700">Liczba gości (max {selectedVenue.capacity})</label>
                               <div className="flex items-center gap-3">
                                   <Slider value={[booking.guests]} min={10} max={selectedVenue.capacity} step={1} onValueChange={([v])=>setBooking(b=>({...b, guests: v}))} className="flex-1" />
                                   <div className="w-16 h-12 flex items-center justify-center rounded-xl border border-stone-200 bg-white font-semibold">
                                       {booking.guests}
                                   </div>
                               </div>
                           </div>
                            <div className="space-y-1.5">
                               <label className="text-sm font-medium text-stone-700">Dodatkowe życzenia</label>
                               <textarea 
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-stone-900"
                                placeholder="Opisz swoje wymagania..."
                                value={booking.notes}
                                onChange={(e)=>setBooking(b=>({...b, notes: e.target.value}))}
                               />
                           </div>
                       </div>
                   </div>

                   <div className="rounded-2xl bg-stone-900 p-5 text-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-stone-400 text-sm">Estymacja kosztów</span>
                            <Info className="h-4 w-4 text-stone-500" />
                        </div>
                        <div className="text-3xl font-bold">{numberFmt(estTotal)} zł</div>
                        <div className="text-sm text-stone-500 mt-1">Cena talerzyka × liczba gości</div>
                   </div>
               </div>

               <SheetFooter className="p-6 pt-2 bg-white border-t border-stone-100">
                   <Button size="lg" className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 h-14 text-lg shadow-lg shadow-rose-900/20">Wyślij darmowe zapytanie</Button>
               </SheetFooter>
               </>
           )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
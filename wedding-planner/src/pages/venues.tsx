/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Filter, Sparkles, Heart, Users, Utensils, ArrowLeft, Wifi, Car, Music, Coffee, Check, Loader2, ShoppingBag } from "lucide-react";
import api from "../lib/api";

export interface Venue {
  id: string | number;
  name: string;
  city: string;
  capacity: number;
  pricePerPerson: number;
  rating: number;
  tags: string[];
  image: string;
  description: string;
  features: string[];
}

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

function useVenueCart() {
  const [cartIds, setCartIds] = useState<string[]>([]);

  const update = async () => {
    const isLoggedIn = !!localStorage.getItem("user");
    if (isLoggedIn) {
      try {
        const res = await api.get("/user-favorites/");
        const ids = res.data
          .filter((f: any) => f.servicetype === "venue")
          .map((f: any) => String(f.serviceid));
        setCartIds(ids);
      } catch (e) { console.error(e); }
    } else {
      const raw = localStorage.getItem("wp_cart_venues");
      if (raw) {
        const list = JSON.parse(raw);
        setCartIds(list.map((i: any) => String(i.id)));
      } else {
        setCartIds([]);
      }
    }
  };

  useEffect(() => {
    update();
    window.addEventListener("wp:cart:update", update);
    return () => window.removeEventListener("wp:cart:update", update);
  }, []);

  return cartIds;
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "ocena" | "pojemnosc";

function VenueDetailsPage({ venue, onBack, onAddToCart }: { venue: Venue, onBack: () => void, onAddToCart: () => void }) {
  const [booking, setBooking] = useState({ date: "", guests: 100 });
  const cartIds = useVenueCart();
  const isInCart = cartIds.includes(String(venue.id));

  const estTotal = useMemo(() => {
    const g = Math.min(Math.max(1, booking.guests || 1), venue.capacity);
    return g * venue.pricePerPerson;
  }, [venue, booking.guests]);

  const getIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if(f.includes("wifi") || f.includes("internet")) return <Wifi className="h-5 w-5"/>;
    if(f.includes("parking") || f.includes("auto")) return <Car className="h-5 w-5"/>;
    if(f.includes("scena") || f.includes("nagłośnienie") || f.includes("muzyka")) return <Music className="h-5 w-5"/>;
    if(f.includes("kawa") || f.includes("catering")) return <Coffee className="h-5 w-5"/>;
    return <Check className="h-5 w-5"/>;
  }

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-50 border-b border-stone-100 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-stone-100 rounded-full pl-2 pr-4">
          <ArrowLeft className="h-5 w-5" /> Wróć do listy
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-full">Udostępnij</Button>
           <Button variant="outline" className="rounded-full"><Heart className="h-4 w-4 mr-2" /> Zapisz</Button>
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
            <p className="text-lg text-stone-600 leading-relaxed">{venue.description || "Brak opisu."}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">Co oferuje to miejsce?</h2>
            <div className="grid grid-cols-2 gap-4">
              {venue.features && venue.features.length > 0 ? (
                venue.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700">
                    {getIcon(f)} <span className="font-medium">{f}</span>
                  </div>
                ))
              ) : (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700"><Wifi className="h-5 w-5"/> Wi-Fi dla gości</div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700"><Car className="h-5 w-5"/> Darmowy parking</div>
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

              <Button 
                onClick={onAddToCart} 
                disabled={isInCart}
                size="lg" 
                className={`w-full h-12 text-lg rounded-xl shadow-lg transition-all ${isInCart ? "bg-stone-200 text-stone-500 shadow-none cursor-not-allowed hover:bg-stone-200" : "bg-rose-600 hover:bg-rose-700 shadow-rose-200"}`}
              >
                {isInCart ? "W koszyku" : "Dodaj do koszyka"}
              </Button>
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [viewDetailsId, setViewDetailsId] = useState<string | number | null>(null);

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const cartIds = useVenueCart();

  useEffect(() => {
      const fetchVenues = async () => {
        setLoading(true);
        try {
          const response = await api.get("/venues/");
          const mappedVenues: Venue[] = response.data.map((v: any) => ({
              id: v.id,
              name: v.name || v.venue_name || "Bez nazwy",
              city: v.city || "Nieznane",
              capacity: v.capacity || 100,
              pricePerPerson: Number(v.price) || Number(v.priceperperson) || Number(v.price_per_person) || Number(v.cost) || 0,
              rating: Number(v.rating) || 4.5,
              tags: Array.isArray(v.tags) ? v.tags : (v.tags ? v.tags.split(',') : []), 
              image: v.image || v.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
              description: v.description || "",
              features: Array.isArray(v.features) ? v.features : (v.features ? v.features.split(',') : ["Parking", "WiFi"])
          }));
          setVenues(mappedVenues);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchVenues();
    }, []);

  const [minPrice, maxPrice] = useMemo(() => {
       if (venues.length === 0) return [0, 1000];
       const prices = venues.map(m => m.pricePerPerson);
       return [Math.min(...prices), Math.max(...prices)];
  }, [venues]);
  
  useEffect(() => { 
      if (venues.length > 0) setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice, venues.length]);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wp_venues_shortlist");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const cities = useMemo(
    () => ["Wszystkie", ...Array.from(new Set(venues.map((v) => v.city)))],
    [venues]
  );

  const addToCart = async (venue: Venue) => {
    if (cartIds.includes(String(venue.id))) return;

    const isLoggedIn = !!localStorage.getItem("user");

    if (isLoggedIn) {
      try {
        await api.post("/user-favorites/", {
           serviceid: venue.id,
           servicetype: "venue"
        });
        window.dispatchEvent(new Event("wp:cart:update"));
        alert("Dodano salę do koszyka (konto)!");
      } catch (e: any) {
        if (e.response && (e.response.status === 400 || e.response.status === 409)) {
           alert("Ta sala znajduje się już w Twoim koszyku.");
        } else {
           console.error(e);
           alert("Błąd API.");
        }
      }
    } else {
      const KEY = "wp_cart_venues";
      try {
        const raw = localStorage.getItem(KEY);
        const prev = raw ? JSON.parse(raw) : [];
        if (!prev.find((p: any) => String(p.id) === String(venue.id))) {
          localStorage.setItem(KEY, JSON.stringify([...prev, venue]));
          window.dispatchEvent(new Event("wp:cart:update"));
          alert("Dodano salę do koszyka!");
        } else {
          alert("Ta sala znajduje się już w Twoim koszyku.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = useMemo(() => {
    let items = venues.filter((v) =>
      (q
        ? v.name.toLowerCase().includes(q.toLowerCase()) ||
          v.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
        : true) &&
      (city === "Wszystkie" ? true : v.city === city) &&
      v.capacity >= capacity[0] &&
      v.pricePerPerson >= priceRange[0] &&
      v.pricePerPerson <= priceRange[1]
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
  }, [venues, q, city, capacity, priceRange, sort]);

  useEffect(() => {
    localStorage.setItem("wp_venues_shortlist", JSON.stringify(shortlist));
  }, [shortlist]);

  const toggleShortlist = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const idStr = String(id);
    setShortlist((s) => (s.includes(idStr) ? s.filter((x) => x !== idStr) : [...s, idStr]));
  };

  const detailsVenue = useMemo(() => venues.find(v => v.id === viewDetailsId), [viewDetailsId, venues]);

  if (viewDetailsId && detailsVenue) {
    return (
      <VenueDetailsPage 
        venue={detailsVenue} 
        onBack={() => setViewDetailsId(null)} 
        onAddToCart={() => addToCart(detailsVenue)}
      />
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
              Przeglądaj wyselekcjonowane obiekty, sprawdzaj dostępność i planuj swój wielki dzień.
            </p>
          </div>

          <div className="flex gap-4">
             <StatCard label="Obiektów" value={String(venues.length)} />
             <StatCard label="Od zł/os." value={venues.length > 0 ? numberFmt(minPrice) : "-"} />
          </div>
        </header>


        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
             <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                 <h2 className="font-semibold text-stone-900">Filtry</h2>
                 { (q || city !== "Wszystkie") && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600" onClick={()=>{setQ(""); setCity("Wszystkie")}}>Reset</Button>}
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
                      <Slider value={[priceRange[0]]} min={minPrice} max={maxPrice} step={50} onValueChange={([v]) => setPriceRange([v, priceRange[1]])} className="py-2" />
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
                         const v = venues.find(x=>String(x.id)===id);
                         if(!v) return null;
                         return (
                             <div key={id} className="flex items-center justify-between text-sm">
                                 <span className="truncate max-w-[140px]">{v.name}</span>
                                 <button onClick={()=>setViewDetailsId(v.id)} className="text-xs font-medium underline decoration-rose-300 underline-offset-2">Szczegóły</button>
                             </div>
                         )
                    })}
                  </div>
                </div>
            )}
          </aside>

          <section className="lg:col-span-9">
             {loading ? (
                 <div className="flex h-64 flex-col items-center justify-center">
                     <Loader2 className="h-10 w-10 animate-spin text-rose-500 mb-4" />
                     <p className="text-stone-500">Szukam najlepszych sal...</p>
                 </div>
             ) : filtered.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white text-center">
                <div className="rounded-full bg-stone-100 p-4"><Filter className="h-6 w-6 text-stone-400" /></div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">Brak wyników</h3>
                <p className="text-stone-500">Zmień kryteria wyszukiwania.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v) => {
                  const isInCart = cartIds.includes(String(v.id));
                  return (
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
                          className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${shortlist.includes(String(v.id)) ? "bg-rose-500 text-white" : "bg-white/30 text-white hover:bg-white/50"}`}
                        >
                          <Heart className={`h-5 w-5 ${shortlist.includes(String(v.id)) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm px-2">
                              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" /> {v.rating}
                          </Badge>
                      </div>
                      
                      <div className="absolute bottom-3 left-4 z-10 text-white">
                           <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Cena za osobę</p>
                           <p className="text-xl font-bold">{v.pricePerPerson} zł</p>
                        </div>
                    </div>

                    <CardContent className="flex-1 p-5">
                      <div className="mb-2">
                         <h3 className="text-lg font-bold text-stone-900 leading-tight">{v.name}</h3>
                         <p className="mt-1 flex items-center text-sm text-stone-500">
                            <MapPin className="mr-1 h-3.5 w-3.5 text-stone-400" /> {v.city}
                         </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                         <Badge variant="secondary" className="bg-stone-100 text-stone-600 font-normal">
                             <Users className="mr-1.5 h-3 w-3" /> do {v.capacity}
                         </Badge>
                         {v.tags.slice(0,2).map((t, idx) => (
                             <Badge key={idx} variant="outline" className="text-stone-500 border-stone-200 font-normal">{t}</Badge>
                         ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 gap-3">
                        <Button onClick={() => setViewDetailsId(v.id)} size="sm" variant="outline" className="flex-1 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">Szczegóły</Button>
                        <Button 
                          onClick={()=>addToCart(v)} 
                          disabled={isInCart}
                          size="sm" 
                          className={`flex-1 rounded-xl shadow-lg transition-colors ${isInCart ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none hover:bg-stone-200" : "bg-stone-900 text-white hover:bg-stone-800 shadow-stone-900/20"}`}
                        >
                          {isInCart ? <><ShoppingBag className="w-4 h-4 mr-1"/> W koszyku</> : "Dodaj"}
                        </Button>
                    </CardFooter>
                  </Card>
                )})}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-black/5">
       <span className="text-2xl font-bold text-stone-900">{value}</span>
       <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">{label}</span>
    </div>
  )
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MapPin, Filter, Sparkles, Info, Heart, X, 
  Calendar, ArrowLeft, Car, Bus, Check, Users
} from "lucide-react";

import { TRANSPORT, type TransportVendor, CART_KEY_TRANSPORT } from "@/data/transport";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "miejsca" | "nazwa";

function TransportDetailsPage({ item, onBack, onBook }: { item: TransportVendor, onBack: () => void, onBook: () => void }) {
  const [form, setForm] = useState({ date: "", route: "" });

  const features = (item as any).features || ["Kierowca w cenie", "Dekoracja pojazdu", "Klimatyzacja", "Dojazd do Pana Młodego", "Szampan dla Pary Młodej"];
    
  const rating = useMemo(() => (item.id.charCodeAt(0) % 5) / 10 + 4.5, [item.id]);

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
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
             <Badge className="bg-blue-500 hover:bg-blue-600 border-0">Premium</Badge>
             <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md">{item.type}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{item.name}</h1>
          <div className="flex items-center gap-4 text-lg font-medium opacity-90">
            <span className="flex items-center gap-1"><MapPin className="h-5 w-5" /> {item.city}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Users className="h-5 w-5" /> {item.capacity ? `${item.capacity} miejsc` : "Auto osobowe"}</span>
             <span>•</span>
            <span className="flex items-center gap-1"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> {rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex gap-6 border-b border-stone-100 pb-8">
             <div className="space-y-1">
               <span className="text-sm text-stone-500">Cena od</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-stone-400"/> {numberFmt(item.priceFrom)} zł
               </div>
            </div>
            <div className="w-px bg-stone-200 h-12 self-center"/>
            <div className="space-y-1">
               <span className="text-sm text-stone-500">Pojemność</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Users className="h-5 w-5 text-stone-400"/> {item.capacity || "4"} os.
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O pojeździe</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{item.desc}</p>
            <p className="mt-4 text-stone-600">
              Gwarantujemy czystość, punktualność i profesjonalną obsługę kierowcy. 
              Pojazd jest zawsze przygotowany na najwyższym poziomie, aby uświetnić Wasz dzień.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">W cenie wynajmu</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700 transition-colors hover:bg-stone-100">
                  <Check className="h-5 w-5 text-accent-500"/> <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-32 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/50">
            <div className="flex items-end justify-between mb-6">
               <div>
                 <span className="text-3xl font-bold text-stone-900">{numberFmt(item.priceFrom)} zł</span>
                 <span className="text-stone-500 text-sm"> / wynajem</span>
               </div>
               <div className="flex items-center gap-1 text-sm font-medium">
                 <Star className="h-4 w-4 fill-stone-900" /> {rating.toFixed(1)}
               </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                 <div className="border-b border-stone-200 p-3 bg-stone-50">
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Data ślubu</label>
                   <input 
                      type="date" 
                      className="w-full bg-transparent text-sm outline-none cursor-pointer" 
                      value={form.date} 
                      onChange={(e)=>setForm({...form, date: e.target.value})} 
                   />
                 </div>
                 <div className="p-3 bg-white">
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Trasa (orientacyjnie)</label>
                   <input 
                      type="text" 
                      placeholder="np. Kraków - Wieliczka"
                      value={form.route} 
                      onChange={(e)=>setForm({...form, route: e.target.value})} 
                      className="w-full bg-transparent text-sm outline-none" 
                   />
                 </div>
              </div>

              <Button onClick={onBook} size="lg" className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                Sprawdź dostępność
              </Button>
              <p className="text-center text-xs text-stone-400">Niezobowiązujące zapytanie.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function TransportPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [vType, setVType] = useState<string>("Wszystkie");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minSeats, setMinSeats] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [onlyTop, setOnlyTop] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null); 
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wp_transport_shortlist") || "[]");
    } catch { return [] }
  });

  const [minPrice, maxPrice] = useMemo(() => {
     if (TRANSPORT.length === 0) return [0, 5000];
     const prices = TRANSPORT.map(t => t.priceFrom);
     return [Math.min(...prices), Math.max(...prices)];
  }, []);

  useEffect(() => { setPriceRange([minPrice, maxPrice]) }, [minPrice, maxPrice]);

  const types = useMemo(() => ["Wszystkie", ...Array.from(new Set(TRANSPORT.map(t => t.type)))], []);
  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(TRANSPORT.map(t => t.city)))], []);

  const filtered = useMemo(() => {
    const items = TRANSPORT.filter((t) => {
      const rating = (t.id.charCodeAt(0) % 5) / 10 + 4.5;
      
      const hay = `${t.name} ${t.city} ${t.type} ${t.desc}`.toLowerCase();
      const matchesText = q ? hay.includes(q.toLowerCase()) : true;
      const matchesCity = city === "Wszystkie" ? true : t.city === city;
      const matchesType = vType === "Wszystkie" ? true : t.type === vType;
      const matchesPrice = t.priceFrom >= priceRange[0] && t.priceFrom <= priceRange[1];
      const matchesSeats = minSeats > 0 ? (t.capacity ?? 0) >= minSeats : true;
      const matchesTop = !onlyTop || rating >= 4.7;

      return matchesText && matchesCity && matchesType && matchesPrice && matchesSeats && matchesTop;
    });

    switch (sort) {
      case "cena-rosn": items.sort((a, b) => a.priceFrom - b.priceFrom); break;
      case "cena-malej": items.sort((a, b) => b.priceFrom - a.priceFrom); break;
      case "miejsca": items.sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0)); break;
      case "nazwa": items.sort((a, b) => a.name.localeCompare(b.name, "pl")); break;
    }
    return items;
  }, [q, city, vType, priceRange, minSeats, sort, onlyTop]);

  useEffect(() => { localStorage.setItem("wp_transport_shortlist", JSON.stringify(shortlist)); }, [shortlist]);
  const toggleShortlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShortlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const selectedItem = useMemo(() => TRANSPORT.find(t => t.id === selectedId), [selectedId]);
  const detailsItem = useMemo(() => TRANSPORT.find(t => t.id === viewDetailsId), [viewDetailsId]);
  const [bookingForm, setBookingForm] = useState({ date: "", notes: "" });

  if (viewDetailsId && detailsItem) {
    return (
      <>
        <TransportDetailsPage 
           item={detailsItem} 
           onBack={() => setViewDetailsId(null)} 
           onBook={() => setSelectedId(detailsItem.id)}
        />
        {selectedId && <BookingSheet selectedItem={TRANSPORT.find(t => t.id === selectedId)} onClose={() => setSelectedId(null)} bookingForm={bookingForm} setBookingForm={setBookingForm} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <Car className="h-3.5 w-3.5" /> Pojazdy do ślubu i dla gości
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              Transport Weselny
            </h1>
            <p className="max-w-xl text-stone-500">
              Auta dla Pary Młodej, busy dla gości, limuzyny. Znajdź idealny środek transportu.
            </p>
          </div>
          <div className="flex gap-4">
             <StatCard label="Pojazdów" value={String(TRANSPORT.length)} />
             <StatCard label="Śr. Cena" value="1 200" />
          </div>
        </header>

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm md:hidden">
           <span className="text-sm font-medium text-stone-600">Wyniki: {filtered.length}</span>
           <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full border-stone-200"><Filter className="mr-2 h-4 w-4"/> Filtry</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem] flex flex-col">
                <SheetHeader className="mb-2 text-left"><SheetTitle>Filtrowanie</SheetTitle></SheetHeader>
                
                <div className="flex-1 overflow-y-auto px-1 py-4 space-y-5">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Szukaj</label>
                      <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. Autokar..." className="h-11 rounded-xl bg-stone-50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Lokalizacja</label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="h-11 rounded-xl bg-stone-50"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Typ pojazdu</label>
                      <Select value={vType} onValueChange={setVType}>
                        <SelectTrigger className="h-11 rounded-xl bg-stone-50"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Min. liczba miejsc: {minSeats}</label>
                      <Slider value={[minSeats]} min={0} max={100} step={1} onValueChange={([v])=>setMinSeats(v)} className="py-2" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Cena od</span>
                        <span className="font-medium">{numberFmt(priceRange[0])} zł</span>
                      </div>
                      <Slider value={[priceRange[0]]} min={minPrice} max={maxPrice} step={100} onValueChange={([v]) => setPriceRange([v, priceRange[1]])} className="py-2" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Sortowanie</label>
                      <Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}>
                        <SelectTrigger className="h-11 rounded-xl bg-stone-50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rekomendowane">Rekomendowane</SelectItem>
                          <SelectItem value="cena-rosn">Cena: rosnąco</SelectItem>
                          <SelectItem value="cena-malej">Cena: malejąco</SelectItem>
                          <SelectItem value="miejsca">Liczba miejsc</SelectItem>
                          <SelectItem value="nazwa">Nazwa A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>
                <SheetFooter className="p-4 border-t border-stone-200">
                    <Button onClick={() => setMobileFiltersOpen(false)} className="w-full h-12 rounded-xl bg-stone-900 text-white hover:bg-stone-800">Pokaż {filtered.length} wyników</Button>
                </SheetFooter>
              </SheetContent>
           </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                 <h2 className="font-semibold text-stone-900">Filtry</h2>
                 {(q || city !== "Wszystkie" || vType !== "Wszystkie" || onlyTop) && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600" onClick={()=>{setQ(""); setCity("Wszystkie"); setVType("Wszystkie"); setOnlyTop(false); setPriceRange([minPrice, maxPrice]); setMinSeats(0)}}>Reset</Button>}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Nazwa</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. Limuzyna..." className="bg-stone-50 border-transparent focus:bg-white rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Lokalizacja</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="bg-stone-50 border-transparent focus:bg-white rounded-xl"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Typ pojazdu</label>
                  <Select value={vType} onValueChange={setVType}>
                    <SelectTrigger className="bg-stone-50 border-transparent focus:bg-white rounded-xl"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                     <span className="text-stone-600">Min. miejsc</span>
                     <span className="font-medium">{minSeats}+</span>
                    </div>
                    <Slider value={[minSeats]} min={0} max={100} step={1} onValueChange={([v]) => setMinSeats(v)} className="py-2" />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                     <span className="text-stone-600">Cena od</span>
                     <span className="font-medium">{numberFmt(priceRange[0])} zł</span>
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
                      <SelectItem value="miejsca">Liczba miejsc</SelectItem>
                      <SelectItem value="nazwa">Nazwa A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9">
             {filtered.length === 0 ? (
               <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white text-center">
                  <div className="rounded-full bg-stone-100 p-4"><Car className="h-6 w-6 text-stone-400" /></div>
                  <h3 className="mt-4 text-lg font-semibold text-stone-900">Brak wyników</h3>
                  <p className="text-stone-500">Zmień kryteria wyszukiwania.</p>
               </div>
             ) : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                 {filtered.map((item) => {
                   const rating = (item.id.charCodeAt(0) % 5) / 10 + 4.5;
                   const TypeIcon = item.type.toLowerCase().includes("bus") ? Bus : Car;

                   return (
                   <Card key={item.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute top-3 right-3 z-10">
                          <button 
                             onClick={(e)=>toggleShortlist(e, item.id)} 
                             className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                               shortlist.includes(item.id) 
                               ? "bg-white text-rose-500 shadow-lg scale-110" 
                               : "bg-black/20 text-white backdrop-blur-sm hover:bg-white hover:text-rose-500"
                             }`}
                          >
                            <Heart className={`h-5 w-5 ${shortlist.includes(item.id) ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        
                        {rating >= 4.8 && (
                           <div className="absolute top-3 left-3 z-10">
                              <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm hover:bg-white px-2"><Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" /> {rating.toFixed(1)}</Badge>
                           </div>
                        )}

                        <div className="absolute bottom-3 left-4 z-10 text-white">
                           <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{item.type}</p>
                           <p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p>
                        </div>
                      </div>

                      <CardContent className="flex-1 p-5">
                        <div className="mb-2">
                           <h3 className="text-lg font-bold text-stone-900 leading-tight">{item.name}</h3>
                           <p className="mt-1 flex items-center text-sm text-stone-500">
                              <MapPin className="mr-1 h-3.5 w-3.5 text-stone-400" /> {item.city}
                           </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-stone-100 text-stone-600 font-normal">
                               <Users className="mr-1.5 h-3 w-3" /> {item.capacity ? `${item.capacity} os.` : "4 os."}
                            </Badge>
                            <Badge variant="outline" className="text-stone-500 border-stone-200 font-normal">
                               <TypeIcon className="mr-1.5 h-3 w-3" /> {item.type}
                            </Badge>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0 gap-3">
                         <Button onClick={() => setViewDetailsId(item.id)} variant="outline" className="flex-1 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">Szczegóły</Button>
                         <Button onClick={() => setSelectedId(item.id)} className="flex-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20">Zapytaj</Button>
                      </CardFooter>
                   </Card>
                 )})}
               </div>
             )}
          </section>
        </div>
      </div>

      {selectedId && <BookingSheet selectedItem={selectedItem} onClose={() => setSelectedId(null)} bookingForm={bookingForm} setBookingForm={setBookingForm} />}
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

function BookingSheet({ selectedItem, onClose, bookingForm, setBookingForm }) {
    if (!selectedItem) return null;
    
    const handleAddToCart = () => {
        try {
            const raw = localStorage.getItem(CART_KEY_TRANSPORT);
            const prev: TransportVendor[] = raw ? JSON.parse(raw) : [];
            const exists = prev.some((p) => p.id === selectedItem.id);
            if (!exists) {
                const next = [...prev, selectedItem];
                localStorage.setItem(CART_KEY_TRANSPORT, JSON.stringify(next));
            }
        } catch (e) { console.error(e) }
        onClose(); 
    }

    const TypeIcon = selectedItem.type.toLowerCase().includes("bus") ? Bus : Car;

    return (
        <Sheet open={!!selectedItem} onOpenChange={(o)=> !o && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 sm:rounded-l-[2rem] overflow-hidden flex flex-col">
           <div className="relative h-48 shrink-0">
               <img src={selectedItem.img} className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
               <div className="absolute bottom-4 left-6 right-6 text-white">
                   <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                   <p className="text-sm text-white/80 flex items-center gap-1"><TypeIcon className="h-3.5 w-3.5"/> {selectedItem.city}</p>
               </div>
               <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40"><X className="h-5 w-5"/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div>
                   <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-rose-500"/> Zapytaj o termin</h4>
                   <div className="space-y-4">
                       <div className="space-y-1.5">
                           <label className="text-sm font-medium text-stone-700">Planowana data</label>
                           <Input type="date" className="h-12 rounded-xl bg-stone-50 border-stone-200" value={bookingForm.date} onChange={(e)=>setBookingForm({...bookingForm, date: e.target.value})} />
                       </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-stone-700">Wiadomość (opcjonalnie)</label>
                           <textarea 
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-stone-900"
                            placeholder="Skąd - Dokąd, godziny..."
                            value={bookingForm.notes}
                            onChange={(e)=>setBookingForm({...bookingForm, notes: e.target.value})}
                           />
                       </div>
                   </div>
               </div>

               <div className="rounded-2xl bg-stone-900 p-5 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-stone-400 text-sm">Cena (od)</span>
                        <Info className="h-4 w-4 text-stone-500" />
                    </div>
                    <div className="text-3xl font-bold">{numberFmt(selectedItem.priceFrom)} zł</div>
               </div>
           </div>

           <SheetFooter className="p-6 pt-2 bg-white border-t border-stone-100 grid grid-cols-2 gap-3">
               <Button size="lg" variant="outline" className="w-full rounded-xl h-14" onClick={handleAddToCart}>
                   <Heart className="h-4 w-4 mr-2" /> Dodaj
               </Button>
               <Button size="lg" className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 h-14 text-lg shadow-lg shadow-rose-900/20">
                   Wyślij
               </Button>
           </SheetFooter>
        </SheetContent>
      </Sheet>
    )
}
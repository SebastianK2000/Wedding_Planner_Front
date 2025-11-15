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
  Calendar, ArrowLeft, Music as MusicIcon, Mic2, Speaker, Headphones, Check, PlayCircle 
} from "lucide-react";

import { MUSIC, type MusicItem } from "@/data/music";

//const CART_KEY = "wp_cart_music";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "nazwa";

function MusicDetailsPage({ item, onBack, onBook }: { item: MusicItem, onBack: () => void, onBook: () => void }) {
  const [form, setForm] = useState({ date: "", hours: 10 });

  const features = (item ?? ["Własne nagłośnienie", "Oświetlenie parkietu", "Prowadzenie zabaw", "Dojazd do 100km", "Biesiada przy stołach"]) as string[];
  const TypeIcon = item.type.toLowerCase().includes("dj") ? Headphones : Mic2;
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
             <Badge className="bg-purple-500 hover:bg-purple-600 border-0">Top Artysta</Badge>
             <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md">{item.type}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{item.name}</h1>
          <div className="flex items-center gap-4 text-lg font-medium opacity-90">
            <span className="flex items-center gap-1"><MapPin className="h-5 w-5" /> {item.city}</span>
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
               <span className="text-sm text-stone-500">Rodzaj</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <TypeIcon className="h-5 w-5 text-stone-400"/> {item.type}
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O wykonawcy</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{item.desc}</p>
            <p className="mt-4 text-stone-600">
              Zapewniamy profesjonalne nagłośnienie i oświetlenie. Nasz repertuar jest dopasowywany do gości, 
              aby parkiet był pełny do białego rana.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">W ofercie</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700 transition-colors hover:bg-stone-100">
                  <Check className="h-5 w-5 text-accent-500"/> <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-stone-900 p-8 text-white flex items-center justify-between overflow-hidden relative">
              <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-1">Posłuchaj demo</h3>
                  <p className="text-stone-400 text-sm">Sprawdź jak brzmią na żywo</p>
              </div>
              <Button size="icon" className="h-14 w-14 rounded-full bg-white text-stone-900 hover:bg-stone-200 relative z-10">
                  <PlayCircle className="h-8 w-8" />
              </Button>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-purple-900/50 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-32 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/50">
            <div className="flex items-end justify-between mb-6">
               <div>
                 <span className="text-3xl font-bold text-stone-900">{numberFmt(item.priceFrom)} zł</span>
                 <span className="text-stone-500 text-sm"> / za 10h</span>
               </div>
               <div className="flex items-center gap-1 text-sm font-medium">
                 <Star className="h-4 w-4 fill-stone-900" /> {rating.toFixed(1)}
               </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                 <div className="border-b border-stone-200 p-3 bg-stone-50">
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Data wesela</label>
                   <input 
                      type="date" 
                      className="w-full bg-transparent text-sm outline-none cursor-pointer" 
                      value={form.date} 
                      onChange={(e)=>setForm({...form, date: e.target.value})} 
                   />
                 </div>
                 <div className="p-3 bg-white">
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Czas trwania (h)</label>
                   <input 
                      type="number" 
                      min={1} 
                      max={12}
                      value={form.hours} 
                      onChange={(e)=>setForm({...form, hours: Number(e.target.value)})} 
                      className="w-full bg-transparent text-sm outline-none" 
                   />
                 </div>
              </div>

              <Button onClick={onBook} size="lg" className="w-full h-14 text-lg rounded-xl bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-200">
                Zapytaj o termin
              </Button>
              <p className="text-center text-xs text-stone-400">Niezobowiązujące zapytanie.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function MusicPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("Wszystkie");
  const [mtype, setMtype] = useState<string>("Wszystkie");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  
  const [selectedId, setSelectedId] = useState<string | null>(null); 
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wp_music_shortlist") || "[]");
    } catch { return [] }
  });
  
  const [minPrice, maxPrice] = useMemo(() => {
     if (MUSIC.length === 0) return [0, 20000];
     const prices = MUSIC.map(m => m.priceFrom);
     return [Math.min(...prices), Math.max(...prices)];
  }, []);

  useEffect(() => { setPriceRange([minPrice, maxPrice]) }, [minPrice, maxPrice]);

  const types = useMemo(() => ["Wszystkie", ...Array.from(new Set(MUSIC.map(m => m.type)))], []);
  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(MUSIC.map(m => m.city)))], []);

  const filtered = useMemo(() => {
    const items = MUSIC.filter((m) => {
      const hay = `${m.name} ${m.city} ${m.type} ${m.desc}`.toLowerCase();
      const matchesText = q ? hay.includes(q.toLowerCase()) : true;
      const matchesCity = city === "Wszystkie" ? true : m.city === city;
      const matchesType = mtype === "Wszystkie" ? true : m.type === mtype;
      const matchesPrice = m.priceFrom >= priceRange[0] && m.priceFrom <= priceRange[1];
      return matchesText && matchesCity && matchesType && matchesPrice;
    });

    switch (sort) {
      case "cena-rosn": items.sort((a, b) => a.priceFrom - b.priceFrom); break;
      case "cena-malej": items.sort((a, b) => b.priceFrom - a.priceFrom); break;
      case "nazwa": items.sort((a, b) => a.name.localeCompare(b.name, "pl")); break;
    }
    return items;
  }, [q, city, mtype, priceRange, sort]);

  useEffect(() => { localStorage.setItem("wp_music_shortlist", JSON.stringify(shortlist)); }, [shortlist]);
  const toggleShortlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShortlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const selectedItem = useMemo(() => MUSIC.find(m => m.id === selectedId), [selectedId]);
  const detailsItem = useMemo(() => MUSIC.find(m => m.id === viewDetailsId), [viewDetailsId]);
  const [bookingForm, setBookingForm] = useState({ date: "", notes: "" });

  if (viewDetailsId && detailsItem) {
    return (
      <>
        <MusicDetailsPage 
           item={detailsItem} 
           onBack={() => setViewDetailsId(null)} 
           onBook={() => setSelectedId(detailsItem.id)}
        />
        {selectedId && <BookingSheet selectedItem={MUSIC.find(m => m.id === selectedId)} onClose={() => setSelectedId(null)} bookingForm={bookingForm} setBookingForm={setBookingForm} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              <MusicIcon className="h-3.5 w-3.5" /> Oprawa muzyczna
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              Zespoły i DJ-e
            </h1>
            <p className="max-w-xl text-stone-500">
              Wybierz profesjonalistów, którzy porwą Twoich gości do tańca.
            </p>
          </div>
          <div className="flex gap-4">
             <StatCard label="Artystów" value={String(MUSIC.length)} />
             <StatCard label="Śr. Cena" value="4 500" />
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
                      <label className="text-sm font-medium text-stone-700">Nazwa</label>
                      <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. The Band..." className="h-11 rounded-xl bg-stone-50" />
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
                      <label className="text-sm font-medium text-stone-700">Rodzaj</label>
                      <Select value={mtype} onValueChange={setMtype}>
                        <SelectTrigger className="h-11 rounded-xl bg-stone-50"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
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
                 {(q || mtype !== "Wszystkie" || city !== "Wszystkie") && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600" onClick={()=>{setQ(""); setMtype("Wszystkie"); setCity("Wszystkie")}}>Reset</Button>}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Nazwa</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. The Band..." className="bg-stone-50 border-transparent focus:bg-white rounded-xl" />
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
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Rodzaj</label>
                  <Select value={mtype} onValueChange={setMtype}>
                    <SelectTrigger className="bg-stone-50 border-transparent focus:bg-white rounded-xl"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
                  <div className="rounded-full bg-stone-100 p-4"><MusicIcon className="h-6 w-6 text-stone-400" /></div>
                  <h3 className="mt-4 text-lg font-semibold text-stone-900">Brak wyników</h3>
               </div>
             ) : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <Card
                    key={item.id}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 pointer-events-none" />

                      <div className="absolute top-3 right-3 z-50">
                        <button
                          onClick={(e) => toggleShortlist(e, item.id)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                            shortlist.includes(item.id)
                              ? "bg-white text-rose-500 shadow-lg scale-110"
                              : "bg-black/50 text-white backdrop-blur-sm hover:bg-white hover:text-rose-500"
                          }`}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              shortlist.includes(item.id) ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-4 z-10 text-white">
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
                          {item.type}
                        </p>
                        <p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-5">
                      <div className="mb-2">
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">
                          {item.name}
                        </h3>
                        <p className="mt-1 flex items-center text-sm text-stone-500">
                          <MapPin className="mr-1 h-3.5 w-3.5 text-stone-400" /> {item.city}
                        </p>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-2">{item.desc}</p>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 gap-3">
                      <Button
                        onClick={() => setViewDetailsId(item.id)}
                        variant="outline"
                        className="flex-1 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50"
                      >
                        Szczegóły
                      </Button>
                      <Button
                        onClick={() => setSelectedId(item.id)}
                        className="flex-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20"
                      >
                        Zapytaj
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
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
    return (
        <Sheet open={!!selectedItem} onOpenChange={(o)=> !o && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 sm:rounded-l-[2rem] overflow-hidden flex flex-col">
           <div className="relative h-48 shrink-0">
               <img src={selectedItem.img} className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
               <div className="absolute bottom-4 left-6 right-6 text-white">
                   <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                   <p className="text-sm text-white/80 flex items-center gap-1"><Speaker className="h-3.5 w-3.5"/> {selectedItem.type}</p>
               </div>
               <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40"><X className="h-5 w-5"/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div>
                   <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-rose-500"/> Sprawdź termin</h4>
                   <div className="space-y-4">
                       <div className="space-y-1.5">
                           <label className="text-sm font-medium text-stone-700">Planowana data</label>
                           <Input type="date" className="h-12 rounded-xl bg-stone-50 border-stone-200" value={bookingForm.date} onChange={(e)=>setBookingForm({...bookingForm, date: e.target.value})} />
                       </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-stone-700">Dodatkowe pytania</label>
                           <textarea 
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-stone-900"
                            placeholder="np. Czy gracie disco-polo?"
                            value={bookingForm.notes}
                            onChange={(e)=>setBookingForm({...bookingForm, notes: e.target.value})}
                           />
                       </div>
                   </div>
               </div>

               <div className="rounded-2xl bg-stone-900 p-5 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-stone-400 text-sm">Budżet orientacyjny</span>
                        <Info className="h-4 w-4 text-stone-500" />
                    </div>
                    <div className="text-3xl font-bold">{numberFmt(selectedItem.priceFrom)} zł</div>
               </div>
           </div>

           <SheetFooter className="p-6 pt-2 bg-white border-t border-stone-100">
               <Button size="lg" className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 h-14 text-lg shadow-lg shadow-rose-900/20">Wyślij zapytanie</Button>
           </SheetFooter>
        </SheetContent>
      </Sheet>
    )
}
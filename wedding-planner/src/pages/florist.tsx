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
  Calendar, ArrowLeft, Flower2, Scissors, Car, Gift, Check 
} from "lucide-react";

import { FLORISTS, type FloristItem } from "@/data/florists";

//const CART_KEY = "wp_cart_florists";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "ocena";

function FloristDetailsPage({ item, onBack, onBook }: { item: FloristItem, onBack: () => void, onBook: () => void }) {
  const [form, setForm] = useState({ date: "", budget: item.priceFrom });

  type WithFeatures = FloristItem & { features?: string[] };
  const features = (item as WithFeatures).features ?? ["Dekoracja sali", "Bukiety ślubne", "Dekoracja auta", "Butonierki", "Brama weselna"];

  const getIcon = (feature: string) => {
    if(feature.includes("auto") || feature.includes("Transport")) return <Car className="h-5 w-5"/>;
    if(feature.includes("Bukiet")) return <Flower2 className="h-5 w-5"/>;
    if(feature.includes("Dekoracja")) return <Scissors className="h-5 w-5"/>;
    if(feature.includes("Prezent") || feature.includes("Box")) return <Gift className="h-5 w-5"/>;
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
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full max-w-7xl mx-auto">
          <Badge className="bg-rose-500 hover:bg-rose-600 mb-4 border-0">Bestseller</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{item.title}</h1>
            <div className="flex items-center gap-4 text-lg font-medium opacity-90">
            <span className="flex items-center gap-1"><MapPin className="h-5 w-5" /> {item.city}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> {((item as FloristItem & { rating?: number }).rating ?? 4.8)}</span>
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
               <span className="text-sm text-stone-500">Firma</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Flower2 className="h-5 w-5 text-stone-400"/> {item.companyName}
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O firmie</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{item.desc}</p>
            <p className="mt-4 text-stone-600">
              Tworzymy dekoracje z pasją. Każdy bukiet i każda kompozycja to dla nas osobna historia.
              Dbamy o świeżość kwiatów i spójność kolorystyczną z motywem przewodnim Waszego wesela.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">Zakres usług</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700 transition-colors hover:bg-stone-100">
                  {getIcon(f)} <span className="font-medium">{f}</span>
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
                 <span className="text-stone-500 text-sm"> / pakiet startowy</span>
               </div>
               <div className="flex items-center gap-1 text-sm font-medium">
                 <Star className="h-4 w-4 fill-stone-900" /> {((item as FloristItem & { rating?: number }).rating ?? 4.8)}
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
                   <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Budżet na kwiaty (PLN)</label>
                   <input 
                      type="number" 
                      min={item.priceFrom} 
                      value={form.budget} 
                      onChange={(e)=>setForm({...form, budget: Number(e.target.value)})} 
                      className="w-full bg-transparent text-sm outline-none" 
                   />
                 </div>
              </div>

              <Button onClick={onBook} size="lg" className="w-full h-14 text-lg rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200">
                Zapytaj o ofertę
              </Button>
              <p className="text-center text-xs text-stone-400">Darmowa konsultacja.</p>
            </div>
            
            <div className="pt-4 border-t border-stone-100 text-center text-sm text-stone-500">
                <span className="flex items-center justify-center gap-2"><Check className="h-4 w-4 text-green-500"/> Wolne terminy na 2025</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function BookingSheet({ selectedItem, onClose, bookingForm, setBookingForm }) {
    if (!selectedItem) return null;
    return (
        <Sheet open={!!selectedItem} onOpenChange={(o)=> !o && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 sm:rounded-l-[2rem] overflow-hidden flex flex-col">
           <div className="relative h-48 shrink-0">
               <img src={selectedItem.image} className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
               <div className="absolute bottom-4 left-6 right-6 text-white">
                   <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                   <p className="text-sm text-white/80 flex items-center gap-1"><Flower2 className="h-3.5 w-3.5"/> {selectedItem.companyName}</p>
               </div>
               <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40"><X className="h-5 w-5"/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div>
                   <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-rose-500"/> Zapytanie o dostępność</h4>
                   <div className="space-y-4">
                       <div className="space-y-1.5">
                           <label className="text-sm font-medium text-stone-700">Planowana data</label>
                           <Input type="date" className="h-12 rounded-xl bg-stone-50 border-stone-200" value={bookingForm.date} onChange={(e)=>setBookingForm({...bookingForm, date: e.target.value})} />
                       </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-stone-700">Wiadomość / Wymagania</label>
                           <textarea 
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-stone-900"
                            placeholder="Opisz styl wesela, np. boho, glamour..."
                            value={bookingForm.notes}
                            onChange={(e)=>setBookingForm({...bookingForm, notes: e.target.value})}
                           />
                       </div>
                   </div>
               </div>

               <div className="rounded-2xl bg-stone-900 p-5 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-stone-400 text-sm">Cena startowa</span>
                        <Info className="h-4 w-4 text-stone-500" />
                    </div>
                    <div className="text-3xl font-bold">{numberFmt(selectedItem.priceFrom)} zł</div>
                    <div className="text-sm text-stone-500 mt-1">Ostateczna wycena po konsultacji.</div>
               </div>
           </div>

           <SheetFooter className="p-6 pt-2 bg-white border-t border-stone-100">
               <Button size="lg" className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 h-14 text-lg shadow-lg shadow-rose-900/20">Wyślij zapytanie</Button>
           </SheetFooter>
        </SheetContent>
      </Sheet>
    )
}

export default function FloristPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wp_florists_shortlist");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [minPrice, maxPrice] = useMemo(() => {
    if (FLORISTS.length === 0) return [0, 10000];
    const prices = FLORISTS.map(f => f.priceFrom);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  useEffect(() => {
      setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(FLORISTS.map(f => f.city)))], []);

  const filtered = useMemo(() => {
    let items = FLORISTS.filter((f) =>
      (q
        ? f.title.toLowerCase().includes(q.toLowerCase()) || 
          f.companyName.toLowerCase().includes(q.toLowerCase()) ||
          f.desc.toLowerCase().includes(q.toLowerCase())
        : true) &&
      (city === "Wszystkie" ? true : f.city === city) &&
      f.priceFrom >= priceRange[0] &&
      f.priceFrom <= priceRange[1]
    );

    switch (sort) {
      case "cena-rosn":
        items = items.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "cena-malej":
        items = items.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      default:
        break; 
    }
    return items;
  }, [q, city, priceRange, sort]);

  useEffect(() => {
    localStorage.setItem("wp_florists_shortlist", JSON.stringify(shortlist));
  }, [shortlist]);

  const toggleShortlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShortlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const selectedItem = useMemo(() => FLORISTS.find(f => f.id === selectedId), [selectedId]);
  const detailsItem = useMemo(() => FLORISTS.find(f => f.id === viewDetailsId), [viewDetailsId]);

  const [bookingForm, setBookingForm] = useState({ date: "", notes: "" });

  if (viewDetailsId && detailsItem) {
      return (
          <>
            <FloristDetailsPage 
                item={detailsItem} 
                onBack={() => setViewDetailsId(null)} 
                onBook={() => setSelectedId(detailsItem.id)}
            />
            {selectedId && <BookingSheet selectedItem={FLORISTS.find(f => f.id === selectedId)} onClose={() => setSelectedId(null)} bookingForm={bookingForm} setBookingForm={setBookingForm} />}
          </>
      )
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <Flower2 className="h-3.5 w-3.5" /> Najpiękniejsze dekoracje
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              Florystyka i Dekoracje
            </h1>
            <p className="max-w-xl text-stone-500">
              Znajdź artystów, którzy zamienią Twoją salę w zaczarowany ogród.
            </p>
          </div>

          <div className="flex gap-4">
             <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-black/5">
               <span className="text-2xl font-bold text-stone-900">{FLORISTS.length}</span>
               <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Ofert</span>
             </div>
             <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-black/5">
               <span className="text-2xl font-bold text-stone-900">{numberFmt(minPrice)}</span>
               <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Od zł</span>
             </div>
          </div>
        </header>

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm md:hidden">
          <span className="text-sm font-medium text-stone-600">Wyniki: {filtered.length}</span>
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full border-stone-200"><Filter className="mr-2 h-4 w-4" /> Filtry</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem] flex flex-col">
               <SheetHeader className="mb-5 text-left"><SheetTitle>Filtrowanie</SheetTitle></SheetHeader>
               <div className="flex-1 overflow-y-auto px-1 space-y-5">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Nazwa</label>
                      <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Szukaj..." className="h-11 rounded-xl bg-stone-50" />
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
                 {(q || priceRange[0] !== minPrice || city !== "Wszystkie") && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600" onClick={()=>{setQ(""); setCity("Wszystkie"); setPriceRange([minPrice, maxPrice])}}>Reset</Button>}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Nazwa</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. Bukiety..." className="bg-stone-50 border-transparent focus:bg-white rounded-xl" />
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9">
             {filtered.length === 0 ? (
               <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white text-center">
                  <div className="rounded-full bg-stone-100 p-4"><Filter className="h-6 w-6 text-stone-400" /></div>
                  <h3 className="mt-4 text-lg font-semibold text-stone-900">Brak wyników</h3>
               </div>
             ) : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                 {filtered.map((item) => (
                   <Card key={item.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute top-3 right-3 z-10">
                          <button onClick={(e)=>toggleShortlist(e, item.id)} className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${shortlist.includes(item.id) ? "bg-rose-500 text-white" : "bg-white/30 text-white hover:bg-white/50"}`}>
                            <Heart className={`h-5 w-5 ${shortlist.includes(item.id) ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        
                        <div className="absolute bottom-3 left-4 z-10 text-white">
                           <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Pakiet od</p>
                           <p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p>
                        </div>
                      </div>

                      <CardContent className="flex-1 p-5">
                        <div className="mb-2">
                           <h3 className="text-lg font-bold text-stone-900 leading-tight">{item.title}</h3>
                           <p className="mt-1 flex items-center text-sm text-stone-500">
                              <Flower2 className="mr-1 h-3.5 w-3.5 text-stone-400" /> {item.companyName}
                           </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                            <span className="flex items-center bg-stone-50 px-2 py-1 rounded-md border border-stone-100"><MapPin className="mr-1 h-3 w-3"/> {item.city}</span>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0 gap-3">
                         <Button onClick={() => setViewDetailsId(item.id)} variant="outline" className="flex-1 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">Szczegóły</Button>
                         <Button onClick={() => setSelectedId(item.id)} className="flex-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20">Zapytaj</Button>
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
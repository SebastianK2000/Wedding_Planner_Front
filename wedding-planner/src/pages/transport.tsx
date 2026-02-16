/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MapPin, Sparkles, Heart, 
  ArrowLeft, Car, Users, Check, Loader2 
} from "lucide-react";
import api from "../lib/api";

export interface TransportItem {
  id: string | number;
  name: string;
  city: string;
  capacity: number;
  priceFrom: number;
  rating: number;
  image: string;
  description: string;
  features: string[];
}

const CART_KEY = "wp_cart_transport";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "pojemnosc";

function TransportDetailsPage({ item, onBack, onAddToCart }: { item: TransportItem, onBack: () => void, onAddToCart: () => void }) {
  const features = item.features && item.features.length > 0 
    ? item.features 
    : ["Klimatyzacja", "Skórzana tapicerka", "Dekoracja auta", "Elegancki kierowca"];

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
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full max-w-7xl mx-auto">
          <Badge className="bg-blue-500 hover:bg-blue-600 mb-4 border-0">Premium Transport</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{item.name}</h1>
          <div className="flex items-center gap-4 text-lg font-medium opacity-90">
            <span className="flex items-center gap-1"><MapPin className="h-5 w-5" /> {item.city}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> {item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex gap-6 border-b border-stone-100 pb-8">
             <div className="space-y-1">
               <span className="text-sm text-stone-500">Wynajem od</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-stone-400"/> {numberFmt(item.priceFrom)} zł
               </div>
            </div>
            <div className="w-px bg-stone-200 h-12 self-center"/>
            <div className="space-y-1">
               <span className="text-sm text-stone-500">Miejsca</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Users className="h-5 w-5 text-stone-400"/> do {item.capacity} os.
               </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O pojeździe</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{item.description || "Luksusowy transport na Twoje wesele."}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">Udogodnienia</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700">
                  <Check className="h-5 w-5 text-blue-500"/> <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="sticky top-32 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/50">
            <div className="flex items-end justify-between mb-6">
               <div><span className="text-3xl font-bold text-stone-900">{numberFmt(item.priceFrom)} zł</span></div>
               <div className="flex items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-stone-900" /> {item.rating.toFixed(1)}</div>
            </div>
            <div className="space-y-4 mb-6">
              <Button onClick={onAddToCart} size="lg" className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                Dodaj do koszyka
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransportPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [capacity, setCapacity] = useState([0]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(15000);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [viewDetailsId, setViewDetailsId] = useState<string | number | null>(null);
  const [items, setItems] = useState<TransportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransport = async () => {
      setLoading(true);
      try {
        const response = await api.get("/transport/");
        const mapped = response.data.map((t: any) => ({
          id: t.id,
          name: t.name || "Auto do ślubu",
          city: t.city || "Cała Polska",
          capacity: Number(t.capacity) || 4,
          priceFrom: Number(t.pricefrom) || Number(t.price) || 1500,
          rating: Number(t.rating) || 4.8,
          image: t.imageurl || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
          description: t.description || "",
          features: Array.isArray(t.features) ? t.features : []
        }));
        setItems(mapped);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchTransport();
  }, []);

  const [minPrice, maxPrice] = useMemo(() => {
      if (items.length === 0) return [0, 15000];
      const prices = items.map(i => i.priceFrom);
      return [Math.min(...prices), Math.max(...prices)];
  }, [items]);

  useEffect(() => {
    if (items.length > 0) {
      setPriceFrom(minPrice);
      setPriceTo(maxPrice);
    }
  }, [minPrice, maxPrice, items.length]);

  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(items.map(i => i.city)))], [items]);

  const addToCart = (item: TransportItem) => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev = raw ? JSON.parse(raw) : [];
      if (!prev.find((p: any) => String(p.id) === String(item.id))) {
        localStorage.setItem(CART_KEY, JSON.stringify([...prev, item]));
        window.dispatchEvent(new Event("wp:cart:update"));
        alert("Dodano transport do koszyka!");
      } else { alert("Ten pojazd jest już w Twoim koszyku."); }
    } catch (e) { console.error(e) }
  };

  const filtered = useMemo(() => {
    const result = items.filter((t) =>
      (q ? t.name.toLowerCase().includes(q.toLowerCase()) : true) &&
      (city === "Wszystkie" ? true : t.city === city) &&
      t.capacity >= capacity[0] &&
      (t.priceFrom >= priceFrom && t.priceFrom <= priceTo)
    );
    switch (sort) {
      case "cena-rosn": result.sort((a, b) => a.priceFrom - b.priceFrom); break;
      case "cena-malej": result.sort((a, b) => b.priceFrom - a.priceFrom); break;
      case "pojemnosc": result.sort((a, b) => b.capacity - a.capacity); break;
      default: result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [items, q, city, capacity, priceFrom, priceTo, sort]);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("wp_transport_shortlist") || "[]"); } catch { return [] }
  });

  const toggleShortlist = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const idStr = String(id);
    const newShortlist = shortlist.includes(idStr) ? shortlist.filter(x => x !== idStr) : [...shortlist, idStr];
    setShortlist(newShortlist);
    localStorage.setItem("wp_transport_shortlist", JSON.stringify(newShortlist));
  };

  const detailsItem = useMemo(() => items.find(i => i.id === viewDetailsId), [viewDetailsId, items]);

  if (viewDetailsId && detailsItem) {
    return <TransportDetailsPage item={detailsItem} onBack={() => setViewDetailsId(null)} onAddToCart={() => addToCart(detailsItem)} />;
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <Car className="h-3.5 w-3.5" /> Luksusowa flota
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Transport</h1>
          </div>
          <div className="flex gap-4">
             <StatCard label="Pojazdów" value={String(items.length)} />
             <StatCard label="Od zł" value={items.length > 0 ? numberFmt(minPrice) : "-"} />
          </div>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                 <h2 className="font-semibold text-stone-900">Filtry</h2>
                 {(q || city !== "Wszystkie") && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600" onClick={()=>{setQ(""); setCity("Wszystkie"); setCapacity([0]); setPriceFrom(minPrice); setPriceTo(maxPrice);}}>Reset</Button>}
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Szukaj</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Model auta..." className="bg-stone-50 border-transparent rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Lokalizacja</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="bg-stone-50 border-transparent rounded-xl"><SelectValue/></SelectTrigger>
                    <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                     <span className="text-stone-600">Pojemność</span>
                     <span className="font-medium">{capacity[0]}+ os.</span>
                    </div>
                  <Slider value={capacity} min={0} max={60} step={1} onValueChange={setCapacity} />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Budżet</label>
                    <div className="flex justify-between text-sm mb-1">
                     <span className="text-stone-600">Cena od</span>
                     <span className="font-medium">{numberFmt(priceFrom)} zł</span>
                    </div>
                    <Slider value={[priceFrom]} min={minPrice} max={maxPrice} step={100} onValueChange={([v]) => setPriceFrom(v)} />
                    <div className="flex justify-between text-sm mt-3 mb-1">
                     <span className="text-stone-600">Cena do</span>
                     <span className="font-medium">{numberFmt(priceTo)} zł</span>
                    </div>
                    <Slider value={[priceTo]} min={minPrice} max={maxPrice} step={100} onValueChange={([v]) => setPriceTo(v)} />
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Sortowanie</label>
                  <Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}>
                    <SelectTrigger className="bg-transparent border-stone-200 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rekomendowane">Rekomendowane</SelectItem>
                      <SelectItem value="cena-rosn">Cena: rosnąco</SelectItem>
                      <SelectItem value="cena-malej">Cena: malejąco</SelectItem>
                      <SelectItem value="pojemnosc">Liczba miejsc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>
          <section className="lg:col-span-9">
             {loading ? <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div> : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <Card key={item.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute top-3 right-3 z-10">
                        <button onClick={(e)=>toggleShortlist(e, item.id)} className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${shortlist.includes(String(item.id)) ? "bg-white text-rose-500 shadow-lg scale-110" : "bg-black/20 text-white backdrop-blur-sm hover:bg-white hover:text-rose-500"}`}>
                          <Heart className={`h-5 w-5 ${shortlist.includes(String(item.id)) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                           <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm px-2"><Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" /> {item.rating.toFixed(1)}</Badge>
                      </div>
                      <div className="absolute bottom-3 left-4 z-10 text-white">
                           <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Wynajem od</p>
                           <p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-5">
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">{item.name}</h3>
                        <p className="mt-1 flex items-center text-sm text-stone-500"><MapPin className="mr-1.5 h-3.5 w-3.5 text-stone-400" /> {item.city} • {item.capacity} os.</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 gap-3">
                        <Button onClick={() => setViewDetailsId(item.id)} variant="outline" className="flex-1 rounded-xl" size="sm">Szczegóły</Button>
                        <Button onClick={()=>addToCart(item)} className="flex-1 rounded-xl bg-stone-900 text-white shadow-lg shadow-stone-900/20" size="sm">Dodaj do koszyka</Button>
                    </CardFooter>
                  </Card>
                ))}
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
  );
}
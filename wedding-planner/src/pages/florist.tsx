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
  ArrowLeft, Flower2, Scissors, Car, Gift, Check, Loader2 
} from "lucide-react";
import api from "../lib/api";

export interface FloristItem {
  id: string | number;
  title: string;
  companyName: string;
  city: string;
  priceFrom: number;
  image: string;
  desc: string;
  rating?: number;
  features?: string[];
}

const CART_KEY = "wp_cart_florists";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "ocena";

function FloristDetailsPage({ item, onBack, onAddToCart }: { item: FloristItem, onBack: () => void, onAddToCart: () => void }) {
  const features = item.features && item.features.length > 0 
    ? item.features 
    : ["Dekoracja sali", "Bukiety ślubne", "Dekoracja auta", "Butonierki", "Brama weselna"];

  const getIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if(f.includes("auto") || f.includes("transport")) return <Car className="h-5 w-5"/>;
    if(f.includes("bukiet") || f.includes("kwiat")) return <Flower2 className="h-5 w-5"/>;
    if(f.includes("dekoracja")) return <Scissors className="h-5 w-5"/>;
    if(f.includes("prezent") || f.includes("box")) return <Gift className="h-5 w-5"/>;
    return <Check className="h-5 w-5"/>;
  }

  const rating = item.rating || 4.5;

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
               <span className="text-sm text-stone-500">Firma</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Flower2 className="h-5 w-5 text-stone-400"/> {item.companyName}
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O firmie</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{item.desc || "Brak opisu."}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">Zakres usług</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700">
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
               </div>
               <div className="flex items-center gap-1 text-sm font-medium">
                 <Star className="h-4 w-4 fill-stone-900" /> {rating.toFixed(1)}
               </div>
            </div>

            <div className="space-y-4 mb-6">
              <Button onClick={onAddToCart} size="lg" className="w-full h-14 text-lg rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200">
                Dodaj do koszyka
              </Button>
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

export default function FloristPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [viewDetailsId, setViewDetailsId] = useState<string | number | null>(null);
  const [florists, setFlorists] = useState<FloristItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlorists = async () => {
      setLoading(true);
      try {
        const response = await api.get("/florists/");
        const mapped: FloristItem[] = response.data.map((f: any) => ({
            id: f.id,
            title: f.title || f.companyname || "Pracownia Florystyczna",
            companyName: f.companyname || f.title || "Nieznana Firma",
            city: f.city || "Nieznane",
            priceFrom: Number(f.pricefrom) || Number(f.price) || 2000,
            image: f.imageurl || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop",
            desc: f.description || "Tworzymy wymarzone dekoracje na Twój ślub.",
            rating: Number(f.rating) || 4.5
        }));
        setFlorists(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlorists();
  }, []);

  const [minPrice, maxPrice] = useMemo(() => {
    if (florists.length === 0) return [0, 10000];
    const prices = florists.map(f => f.priceFrom);
    return [Math.min(...prices), Math.max(...prices)];
  }, [florists]);

  useEffect(() => {
      if (florists.length > 0) setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice, florists.length]);

  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(florists.map(f => f.city)))], [florists]);

  const addToCart = (item: FloristItem) => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev: FloristItem[] = raw ? JSON.parse(raw) : [];
      if (!prev.some((p) => String(p.id) === String(item.id))) {
        localStorage.setItem(CART_KEY, JSON.stringify([...prev, item]));
        window.dispatchEvent(new Event("wp:cart:update"));
        alert("Dodano dekoracje do koszyka!");
      } else {
        alert("Ta oferta znajduje się już w Twoim koszyku.");
      }
    } catch (e) { console.error(e) }
  };

  const filtered = useMemo(() => {
    const items = florists.filter((f) =>
      (q ? f.title.toLowerCase().includes(q.toLowerCase()) || f.companyName.toLowerCase().includes(q.toLowerCase()) : true) &&
      (city === "Wszystkie" ? true : f.city === city) &&
      f.priceFrom >= priceRange[0] &&
      f.priceFrom <= priceRange[1]
    );

    switch (sort) {
      case "cena-rosn": items.sort((a, b) => a.priceFrom - b.priceFrom); break;
      case "cena-malej": items.sort((a, b) => b.priceFrom - a.priceFrom); break;
      case "ocena": items.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return items;
  }, [florists, q, city, priceRange, sort]);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("wp_florists_shortlist");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  });

  const toggleShortlist = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const idStr = String(id);
    setShortlist((s) => (s.includes(idStr) ? s.filter((x) => x !== idStr) : [...s, idStr]));
  };

  const detailsItem = useMemo(() => florists.find(f => f.id === viewDetailsId), [viewDetailsId, florists]);

  if (viewDetailsId && detailsItem) {
      return <FloristDetailsPage item={detailsItem} onBack={() => setViewDetailsId(null)} onAddToCart={() => addToCart(detailsItem)} />
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <Flower2 className="h-3.5 w-3.5" /> Najpiękniejsze dekoracje
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Florystyka i Dekoracje</h1>
          </div>
          <div className="flex gap-4">
             <StatCard label="Ofert" value={String(florists.length)} />
             <StatCard label="Od zł" value={florists.length > 0 ? numberFmt(minPrice) : "-"} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="font-semibold text-stone-900">Filtry</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Szukaj</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Nazwa firmy..." className="bg-stone-50 border-transparent rounded-xl" />
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
                     <span className="text-stone-600">Cena do</span>
                     <span className="font-medium">{numberFmt(priceRange[1])} zł</span>
                    </div>
                  <Slider value={[priceRange[1]]} min={minPrice} max={maxPrice} step={100} onValueChange={([v]) => setPriceRange([priceRange[0], v])} />
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
          </aside>

          <section className="lg:col-span-9">
             {loading ? <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div> : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                 {filtered.map((item) => (
                   <Card key={item.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-3 right-3 z-10">
                          <button onClick={(e)=>toggleShortlist(e, item.id)} className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${shortlist.includes(String(item.id)) ? "bg-rose-500 text-white" : "bg-white/30 text-white hover:bg-white/50"}`}>
                            <Heart className={`h-5 w-5 ${shortlist.includes(String(item.id)) ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-4 z-10 text-white"><p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p></div>
                      </div>
                      <CardContent className="flex-1 p-5">
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">{item.title}</h3>
                        <p className="mt-1 flex items-center text-sm text-stone-500"><Flower2 className="mr-1.5 h-3.5 w-3.5" /> {item.companyName}</p>
                        <p className="mt-2 text-xs text-stone-400 flex items-center"><MapPin className="mr-1 h-3 w-3"/> {item.city}</p>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 gap-3">
                          <Button onClick={() => setViewDetailsId(item.id)} variant="outline" className="flex-1 rounded-xl" size="sm">Szczegóły</Button>
                          <Button onClick={() => addToCart(item)} className="flex-1 rounded-xl bg-stone-900 text-white shadow-lg shadow-stone-900/20" size="sm">Dodaj do koszyka</Button>
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
  )
}
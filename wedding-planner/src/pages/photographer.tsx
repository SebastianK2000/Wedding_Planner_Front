/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Star, ArrowLeft, Loader2, Heart, Sparkles, Check } from "lucide-react";
import api from "../lib/api";

export interface PhotographerItem {
  id: string | number;
  name: string;
  city: string;
  priceFrom: number;
  rating: number;
  img: string;
  desc: string;
  tags: string[];
}

const CART_KEY = "wp_cart_photographers";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "nazwa";

function PhotographerDetailsPage({ item, onBack, onAddToCart }: { item: PhotographerItem, onBack: () => void, onAddToCart: () => void }) {
  const features = ["Sesja narzeczeńska", "Reportaż 12h", "Pendrive z grawerem", "Galeria online", "Album Premium"];
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
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full max-w-7xl mx-auto">
          <Badge className="bg-rose-500 hover:bg-rose-600 mb-4 border-0">Artysta Roku</Badge>
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
               <span className="text-sm text-stone-500">Pakiet od</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-stone-400"/> {numberFmt(item.priceFrom)} zł
               </div>
            </div>
            <div className="w-px bg-stone-200 h-12 self-center"/>
            <div className="space-y-1">
               <span className="text-sm text-stone-500">Styl</span>
               <div className="font-semibold text-lg flex items-center gap-2">
                 <Camera className="h-5 w-5 text-stone-400"/> {item.tags.join(" / ")}
               </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-stone-900">O fotografie</h2>
            <p className="text-lg text-stone-600 leading-relaxed">{item.desc}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-stone-900">Co zawiera pakiet?</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700">
                  <Check className="h-5 w-5 text-green-500"/> <span className="font-medium">{f}</span>
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
              <Button onClick={onAddToCart} size="lg" className="w-full h-14 text-lg rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200">
                Dodaj do koszyka
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhotographerPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [onlyTop, setOnlyTop] = useState(false);
  const [viewDetailsId, setViewDetailsId] = useState<string | number | null>(null);
  const [items, setItems] = useState<PhotographerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotographers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/photographers/");
        const mapped = response.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          city: p.city || "Cała Polska",
          priceFrom: Number(p.pricefrom) || 3000,
          rating: 4.5 + (Number(p.id) % 5) / 10,
          img: p.imageurl || "https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1200&auto=format&fit=crop",
          desc: p.description || "Profesjonalna fotografia ślubna.",
          tags: ["Reportaż", "Artystyczny"]
        }));
        setItems(mapped);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchPhotographers();
  }, []);

  const [minPrice, maxPrice] = useMemo(() => {
      if (items.length === 0) return [0, 20000];
      const prices = items.map(i => i.priceFrom);
      return [Math.min(...prices), Math.max(...prices)];
  }, [items]);

  useEffect(() => { if(items.length > 0) setPriceRange([minPrice, maxPrice]) }, [minPrice, maxPrice, items.length]);

  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(items.map(i => i.city)))], [items]);

  const addToCart = (item: PhotographerItem) => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const prev = raw ? JSON.parse(raw) : [];
      if (!prev.find((p: any) => String(p.id) === String(item.id))) {
        localStorage.setItem(CART_KEY, JSON.stringify([...prev, item]));
        window.dispatchEvent(new Event("wp:cart:update"));
        alert("Dodano fotografa do koszyka!");
      } else { alert("Ten fotograf jest już w Twoim koszyku."); }
    } catch (e) { console.error(e) }
  };

  const filtered = useMemo(() => {
    const result = items.filter((p) => {
      const hay = `${p.name} ${p.city} ${p.desc}`.toLowerCase();
      return (q ? hay.includes(q.toLowerCase()) : true) &&
             (city === "Wszystkie" ? true : p.city === city) &&
             (p.priceFrom >= priceRange[0] && p.priceFrom <= priceRange[1]) &&
             (!onlyTop || p.rating >= 4.7);
    });
    switch (sort) {
      case "cena-rosn": result.sort((a, b) => a.priceFrom - b.priceFrom); break;
      case "cena-malej": result.sort((a, b) => b.priceFrom - a.priceFrom); break;
      case "nazwa": result.sort((a, b) => a.name.localeCompare(b.name, "pl")); break;
      default: result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [items, q, city, priceRange, sort, onlyTop]);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("wp_photographers_shortlist") || "[]"); } catch { return [] }
  });

  const toggleShortlist = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const idStr = String(id);
    const newShortlist = shortlist.includes(idStr) ? shortlist.filter(x => x !== idStr) : [...shortlist, idStr];
    setShortlist(newShortlist);
    localStorage.setItem("wp_photographers_shortlist", JSON.stringify(newShortlist));
  };

  const detailsItem = useMemo(() => items.find(i => i.id === viewDetailsId), [viewDetailsId, items]);

  if (viewDetailsId && detailsItem) {
    return <PhotographerDetailsPage item={detailsItem} onBack={() => setViewDetailsId(null)} onAddToCart={() => addToCart(detailsItem)} />;
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              <Camera className="h-3.5 w-3.5" /> Twoje wspomnienia
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Fotografowie</h1>
          </div>
          <div className="flex gap-4">
             <StatCard label="Artystów" value={String(items.length)} />
             <StatCard label="Pakiet od" value={items.length > 0 ? numberFmt(minPrice) : "-"} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                 <h2 className="font-semibold text-stone-900">Filtry</h2>
                 {(q || city !== "Wszystkie" || onlyTop) && <Button variant="ghost" className="h-auto p-0 text-xs text-rose-600" onClick={()=>{setQ(""); setCity("Wszystkie"); setOnlyTop(false); setPriceRange([minPrice, maxPrice])}}>Reset</Button>}
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-stone-400">Nazwa lub styl</label>
                  <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="np. Kadr, Boho..." className="bg-stone-50 border-transparent focus:bg-white rounded-xl" />
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
                     <span className="text-stone-600">Budżet</span>
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
             {loading ? <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div> : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <Card key={item.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-3 right-3 z-10">
                        <button onClick={(e)=>toggleShortlist(e, item.id)} className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${shortlist.includes(String(item.id)) ? "bg-white text-rose-500 shadow-lg scale-110" : "bg-black/20 text-white backdrop-blur-sm hover:bg-white hover:text-rose-500"}`}>
                          <Heart className={`h-5 w-5 ${shortlist.includes(String(item.id)) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 z-10 flex gap-2">
                           <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm px-2"><Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" /> {item.rating.toFixed(1)}</Badge>
                      </div>
                      <div className="absolute bottom-3 left-4 z-10 text-white">
                           <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Pakiet od</p>
                           <p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-5">
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">{item.name}</h3>
                        <p className="mt-1 flex items-center text-sm text-stone-500"><MapPin className="mr-1.5 h-3.5 w-3.5 text-stone-400" /> {item.city}</p>
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
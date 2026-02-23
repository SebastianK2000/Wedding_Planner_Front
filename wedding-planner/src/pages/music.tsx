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
  ArrowLeft, Music as MusicIcon, Mic2, Headphones, Check, Loader2, ShoppingBag
} from "lucide-react";
import api from "../lib/api";

export interface MusicItem {
  id: string | number;
  name: string;
  type: string;
  city: string;
  priceFrom: number;
  img: string;
  desc: string;
  rating?: number;
}

const CART_KEY = "wp_cart_music";

function numberFmt(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

function useMusicCart() {
  const [cartIds, setCartIds] = useState<string[]>([]);
  const update = async () => {
    const isLoggedIn = !!localStorage.getItem("user");
    if (isLoggedIn) {
      try {
        const res = await api.get("/user-favorites/");
        setCartIds(res.data.filter((f: any) => f.servicetype === "musician").map((f: any) => String(f.serviceid)));
      } catch (e) { console.error(e); }
    } else {
      const raw = localStorage.getItem(CART_KEY);
      setCartIds(raw ? JSON.parse(raw).map((i: any) => String(i.id)) : []);
    }
  };
  useEffect(() => {
    update();
    window.addEventListener("wp:cart:update", update);
    return () => window.removeEventListener("wp:cart:update", update);
  }, []);
  return cartIds;
}

type SortKey = "rekomendowane" | "cena-rosn" | "cena-malej" | "nazwa";

function MusicDetailsPage({ item, onBack, onAddToCart }: { item: MusicItem, onBack: () => void, onAddToCart: () => void }) {
  const features: string[] = ["Własne nagłośnienie", "Oświetlenie parkietu", "Prowadzenie zabaw", "Dojazd do 100km", "Biesiada przy stołach"];
  const TypeIcon = item.type.toLowerCase().includes("dj") ? Headphones : Mic2;
  const rating = item.rating || 4.5;
  
  const cartIds = useMusicCart();
  const isInCart = cartIds.includes(String(item.id));

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
          <div><h2 className="text-2xl font-semibold mb-4 text-stone-900">O wykonawcy</h2><p className="text-lg text-stone-600 leading-relaxed">{item.desc || "Brak opisu wykonawcy."}</p></div>
          <div><h2 className="text-2xl font-semibold mb-6 text-stone-900">W ofercie</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (<div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-700"><Check className="h-5 w-5 text-accent-500"/> <span className="font-medium">{f}</span></div>))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-32 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/50">
            <div className="flex items-end justify-between mb-6">
               <div><span className="text-3xl font-bold text-stone-900">{numberFmt(item.priceFrom)} zł</span></div>
               <div className="flex items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-stone-900" /> {rating.toFixed(1)}</div>
            </div>
            <div className="space-y-4 mb-6">
              <Button 
                onClick={onAddToCart} 
                disabled={isInCart}
                size="lg" 
                className={`w-full h-14 text-lg rounded-xl shadow-lg transition-all ${isInCart ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none hover:bg-stone-200" : "bg-purple-600 hover:bg-purple-700 shadow-purple-200"}`}
              >
                {isInCart ? "Już w koszyku" : "Dodaj do koszyka"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MusicPro() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Wszystkie");
  const [mtype, setMtype] = useState("Wszystkie");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sort, setSort] = useState<SortKey>("rekomendowane");
  const [viewDetailsId, setViewDetailsId] = useState<string | number | null>(null);
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cartIds = useMusicCart();

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const response = await api.get("/music/");
        const mapped: MusicItem[] = response.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            city: m.city || "Cała Polska", 
            type: m.name?.toLowerCase().includes("dj") ? "DJ" : "Zespół", 
            priceFrom: Number(m.pricefrom) || Number(m.price) || 4000,
            img: m.imageurl,
            desc: m.description || "Profesjonalna oprawa muzyczna.",
            rating: Number(m.rating) || 4.5
        }));
        setMusicList(mapped);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchMusic();
  }, []);

  const [minPrice, maxPrice] = useMemo(() => {
     if (musicList.length === 0) return [0, 20000];
     const prices = musicList.map(m => m.priceFrom);
     return [Math.min(...prices), Math.max(...prices)];
  }, [musicList]);

  useEffect(() => { if(musicList.length > 0) setPriceRange([minPrice, maxPrice]) }, [minPrice, maxPrice, musicList.length]);

  const types = useMemo(() => ["Wszystkie", ...Array.from(new Set(musicList.map(m => m.type)))], [musicList]);
  const cities = useMemo(() => ["Wszystkie", ...Array.from(new Set(musicList.map(m => m.city)))], [musicList]);

  const addToCart = async (item: MusicItem) => {
    if (cartIds.includes(String(item.id))) return;

    const isLoggedIn = !!localStorage.getItem("user");
    if (isLoggedIn) {
      try {
        await api.post("/user-favorites/", { serviceid: item.id, servicetype: "musician" });
        window.dispatchEvent(new Event("wp:cart:update"));
        alert("Dodano wykonawcę do koszyka!");
      } catch (e: any) {
        if (e.response && (e.response.status === 400 || e.response.status === 409)) alert("Ten wykonawca jest już w Twoim koszyku.");
        else alert("Błąd API.");
      }
    } else {
      try {
        const raw = localStorage.getItem(CART_KEY);
        const prev = raw ? JSON.parse(raw) : [];
        if (!prev.find((p: any) => String(p.id) === String(item.id))) {
          localStorage.setItem(CART_KEY, JSON.stringify([...prev, item]));
          window.dispatchEvent(new Event("wp:cart:update"));
          alert("Dodano wykonawcę do koszyka!");
        } else alert("Wykonawca jest już w koszyku.");
      } catch (e) { console.error(e) }
    }
  };

  const filtered = useMemo(() => {
    const items = musicList.filter((m) => {
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
      default: items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return items;
  }, [musicList, q, city, mtype, priceRange, sort]);

  const [shortlist, setShortlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("wp_music_shortlist") || "[]"); } catch { return [] }
  });

  const toggleShortlist = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const idStr = String(id);
    setShortlist((s) => (s.includes(idStr) ? s.filter((x) => x !== idStr) : [...s, idStr]));
  };

  const detailsItem = useMemo(() => musicList.find(m => m.id === viewDetailsId), [viewDetailsId, musicList]);

  if (viewDetailsId && detailsItem) {
    return <MusicDetailsPage item={detailsItem} onBack={() => setViewDetailsId(null)} onAddToCart={() => addToCart(detailsItem)} />;
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 md:p-8 font-sans text-stone-800">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              <MusicIcon className="h-3.5 w-3.5" /> Oprawa muzyczna
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Zespoły i DJ-e</h1>
          </div>
          <div className="flex gap-4">
             <StatCard label="Artystów" value={String(musicList.length)} />
             <StatCard label="Od zł" value={musicList.length > 0 ? numberFmt(minPrice) : "-"} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="font-semibold text-stone-900">Filtry</h2>
              <div className="space-y-5">
                <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Szukaj..." className="bg-stone-50 border-transparent rounded-xl" />
                <Select value={city} onValueChange={setCity}><SelectTrigger className="bg-stone-50 border-transparent rounded-xl"><SelectValue/></SelectTrigger><SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                <Select value={mtype} onValueChange={setMtype}><SelectTrigger className="bg-stone-50 border-transparent rounded-xl"><SelectValue/></SelectTrigger><SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                <div className="space-y-3"><div className="flex justify-between text-sm"><span className="text-stone-600">Cena od</span><span className="font-medium">{numberFmt(priceRange[0])} zł</span></div><Slider value={[priceRange[0]]} min={minPrice} max={maxPrice} step={100} onValueChange={([v]) => setPriceRange([v, priceRange[1]])} className="py-2" /></div>
                <div className="space-y-2 pt-2 border-t border-stone-100"><label className="text-xs font-medium uppercase tracking-wider text-stone-400">Sortowanie</label><Select value={sort} onValueChange={(v)=>setSort(v as SortKey)}><SelectTrigger className="bg-transparent border-stone-200 rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rekomendowane">Rekomendowane</SelectItem><SelectItem value="cena-rosn">Cena: rosnąco</SelectItem><SelectItem value="cena-malej">Cena: malejąco</SelectItem><SelectItem value="nazwa">Nazwa A-Z</SelectItem></SelectContent></Select></div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9">
             {loading ? <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div> : (
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => {
                  const isInCart = cartIds.includes(String(item.id));
                  return (
                  <Card key={item.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-3 right-3 z-10">
                        <button onClick={(e)=>toggleShortlist(e, item.id)} className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${shortlist.includes(String(item.id)) ? "bg-rose-500 text-white" : "bg-white/30 text-white hover:bg-white/50"}`}>
                          <Heart className={`h-5 w-5 ${shortlist.includes(String(item.id)) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-4 z-10 text-white"><p className="text-xl font-bold">{numberFmt(item.priceFrom)} zł</p></div>
                    </div>
                    <CardContent className="flex-1 p-5">
                      <h3 className="text-lg font-bold text-stone-900 leading-tight">{item.name}</h3>
                      <p className="mt-1 flex items-center text-sm text-stone-500">{item.city} • {item.type}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 gap-3">
                        <Button onClick={() => setViewDetailsId(item.id)} variant="outline" className="flex-1 rounded-xl" size="sm">Szczegóły</Button>
                        <Button 
                          onClick={()=>addToCart(item)} 
                          disabled={isInCart}
                          className={`flex-1 rounded-xl shadow-lg transition-colors ${isInCart ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none" : "bg-stone-900 text-white hover:bg-stone-800 shadow-stone-900/20"}`}
                          size="sm"
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
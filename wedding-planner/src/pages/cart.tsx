/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { X, Trash2, Loader2, ShoppingBag, CreditCard, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const CART_KEYS = {
  photographers: "wp_cart_photographers",
  florists: "wp_cart_florists",
  music: "wp_cart_music",
  venues: "wp_cart_venues",
  transport: "wp_cart_transport"
};

const BUDGET_CATEGORY_MAP: Record<string, number> = {
  venue: 1,
  photographer: 2,
  musician: 3,
  florist: 4,
  transport: 6
};

interface CartItem {
  uniqueId: string;
  id: number;
  type: string;
  name: string;
  price?: number;
  image?: string;
  savedAt?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

export default function Cart({ isOpen, onClose, isLoggedIn }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  
  const navigate = useNavigate();

  const fetchLocalCart = useCallback(() => {
    const loadedItems: CartItem[] = [];
    
    Object.entries(CART_KEYS).forEach(([type, key]) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.forEach((p: any) => {
            loadedItems.push({
              uniqueId: `${type}-${p.id}`,
              id: p.id,
              type: type,
              name: p.name || p.title || p.companyname || "Usługa",
              price: Number(p.price || p.priceFrom || p.pricePerPerson || 0),
              image: p.img || p.image || p.imageurl,
              savedAt: new Date().toISOString()
            });
          });
        }
      } catch (e) { console.error("Błąd odczytu LS", e); }
    });
    
    setItems(loadedItems);
  }, []);

  const fetchApiCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/user-favorites/");
      const favorites = res.data;

      const detailPromises = favorites.map(async (fav: any) => {
        try {
          let endpoint = "";
          switch (fav.servicetype) {
            case "venue": endpoint = "/venues/"; break;
            case "photographer": endpoint = "/photographers/"; break;
            case "musician": endpoint = "/music/"; break;
            case "florist": endpoint = "/florists/"; break;
            case "transport": endpoint = "/transport/"; break;
            default: return null; 
          }

          const detailRes = await api.get(`${endpoint}${fav.serviceid}/`);
          const d = detailRes.data;

          return {
            uniqueId: `${fav.servicetype}-${fav.serviceid}`,
            id: fav.serviceid,
            type: fav.servicetype,
            name: d.name || d.title || d.companyname,
            price: Number(d.pricefrom || d.priceperperson || d.price || 0),
            image: d.imageurl || d.image,
            savedAt: fav.savedat
          } as CartItem;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return null;
        }
      });

      const resolvedItems = await Promise.all(detailPromises);
      setItems(resolvedItems.filter((i): i is CartItem => i !== null));

    } catch (e) {
      console.error("Błąd API koszyka", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshCart = () => {
      if (isLoggedIn) {
        fetchApiCart();
      } else {
        fetchLocalCart();
      }
    };

    if (isOpen) {
      refreshCart();
    }

    window.addEventListener("wp:cart:update", refreshCart);
    return () => {
      window.removeEventListener("wp:cart:update", refreshCart);
    };
  }, [isOpen, isLoggedIn, fetchApiCart, fetchLocalCart]);

  const removeItem = async (item: CartItem) => {
    if (isLoggedIn) {
      try {
        const res = await api.get("/user-favorites/");
        const favRecord = res.data.find((f: any) => f.serviceid === item.id && f.servicetype === item.type);
        
        if (favRecord) {
          await api.delete(`/user-favorites/${favRecord.id}/`);
          setItems(prev => prev.filter(i => i.uniqueId !== item.uniqueId));
          window.dispatchEvent(new Event("wp:cart:update"));
        }
      } catch (e) { console.error("Błąd usuwania API", e); }
    } else {
      let lsKey = "";
      if (item.type === "venue") lsKey = CART_KEYS.venues;
      else if (item.type === "photographer") lsKey = CART_KEYS.photographers;
      else if (item.type === "florist") lsKey = CART_KEYS.florists;
      else if (item.type === "musician") lsKey = CART_KEYS.music;
      else if (item.type === "transport") lsKey = CART_KEYS.transport;

      if (lsKey) {
        try {
          const raw = localStorage.getItem(lsKey);
          if (raw) {
            const list = JSON.parse(raw);
            const newList = list.filter((x: any) => x.id !== item.id);
            localStorage.setItem(lsKey, JSON.stringify(newList));
            setItems(prev => prev.filter(i => i.uniqueId !== item.uniqueId));
            window.dispatchEvent(new Event("wp:cart:update"));
          }
        } catch (e) { console.error("Błąd usuwania z LS", e); }
      }
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsPaying(true);
    setPaymentStep(0);

    setTimeout(() => setPaymentStep(1), 1000);
    setTimeout(() => setPaymentStep(2), 2500);
    
    setTimeout(async () => {
      if (isLoggedIn) {
        try {
          const budgetPromises = items.map(item => {
             const categoryId = BUDGET_CATEGORY_MAP[item.type] || 8;
             return api.post("/budget-items/", {
                categoryid: categoryId,
                name: item.name,
                plannedamount: item.price || 0,
                actualamount: item.price || 0,
                ispaid: true,
                notes: "Zakupione przez aplikację (Koszyk)"
             });
          });

          await Promise.all(budgetPromises);
          
          const favRes = await api.get("/user-favorites/");
          const deletePromises = favRes.data.map((fav: any) => api.delete(`/user-favorites/${fav.id}/`));
          await Promise.all(deletePromises);

        } catch (e) {
          console.error("Błąd podczas zapisywania do budżetu", e);
          alert("Wystąpił błąd zapisu do budżetu, ale płatność została symulowana.");
        }
      } else {
        Object.values(CART_KEYS).forEach(key => localStorage.removeItem(key));
      }

      setItems([]);
      window.dispatchEvent(new Event("wp:cart:update"));
      
      setTimeout(() => {
        setIsPaying(false);
        onClose();
        alert("Dziękujemy! Twoje zamówienie zostało zrealizowane i dodane do budżetu.");
        if (isLoggedIn) navigate("/budzet");
      }, 500);

    }, 4000);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={isPaying ? undefined : onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {isPaying && (
          <div className="absolute inset-0 z-[80] bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
             {paymentStep < 2 ? (
               <>
                 <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-stone-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-rose-500 animate-spin"></div>
                    <div className="h-24 w-24 rounded-full bg-stone-50 flex items-center justify-center relative z-10">
                        <Lock className="h-10 w-10 text-stone-400 animate-pulse" />
                    </div>
                 </div>
                 <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {paymentStep === 0 ? "Inicjowanie płatności..." : "Autoryzacja banku..."}
                 </h3>
                 <p className="text-stone-500 text-sm">Proszę nie zamykać okna.</p>
               </>
             ) : (
                <>
                  <div className="mb-6 h-24 w-24 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-300">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Płatność przyjęta!</h3>
                  <p className="text-stone-500 text-sm">Zapisujemy usługi w Twoim budżecie...</p>
                </>
             )}
          </div>
        )}

        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag size={20} /> Twój Koszyk
            </h2>
            <button onClick={onClose} disabled={isPaying} className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-50 transition-colors disabled:opacity-50">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-stone-500 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                <p className="text-sm">Ładowanie Twoich wyborów...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-stone-300" />
                </div>
                <p className="font-medium">Koszyk jest pusty</p>
                <p className="text-sm mt-1">Przeglądaj oferty i zapisuj to, co Ci się podoba.</p>
                <Button onClick={onClose} variant="outline" className="mt-6">Wróć do przeglądania</Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.uniqueId} className="group relative flex gap-4 p-3 rounded-2xl border border-stone-100 bg-white hover:border-rose-200 hover:shadow-md transition-all">
                  <div className="w-20 h-20 flex-shrink-0 bg-stone-100 rounded-xl overflow-hidden">
                    <img 
                      src={item.image || "https://placehold.co/100x100?text=Usługa"} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-0.5">{item.type}</p>
                            <h4 className="font-bold text-stone-900 truncate pr-4 text-sm sm:text-base">{item.name}</h4>
                        </div>
                        <button 
                            onClick={() => removeItem(item)}
                            className="text-stone-300 hover:text-rose-500 p-1 rounded transition-colors"
                            title="Usuń z koszyka"
                            disabled={isPaying}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    {item.price ? (
                        <p className="text-sm text-stone-500 mt-1">{item.price} PLN <span className="text-xs text-stone-400"></span></p>
                    ) : (
                        <p className="text-sm text-stone-400 mt-1 italic">Cena do uzgodnienia</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-stone-100 bg-stone-50">
             <div className="flex justify-between items-center mb-2">
                <span className="text-stone-600 font-medium">Liczba usług:</span>
                <span className="font-bold text-stone-900">{items.length}</span>
             </div>
             {items.length > 0 && (
               <div className="flex justify-between items-center mb-4 text-sm text-stone-500">
                  <span>Suma do zapłaty:</span>
                  <span className="text-lg font-bold text-stone-900">{calculateTotal()} PLN</span>
               </div>
             )}
             <Button 
                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-lg shadow-stone-900/20 transition-all active:scale-[0.98]" 
                onClick={handleCheckout}
                disabled={items.length === 0 || isPaying}
             >
                {isPaying ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Przetwarzanie...</>
                ) : (
                    <><CreditCard className="mr-2 h-5 w-5" /> Zrealizuj i zapłać</>
                )}
             </Button>
             <p className="text-[10px] text-center text-stone-400 mt-3 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Płatność zabezpieczona (Symulacja)
             </p>
          </div>

        </div>
      </div>
    </>
  );
}
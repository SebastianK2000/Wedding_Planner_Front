import { Heart, Star } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }: {
  children: React.ReactNode; title: string; subtitle?: string;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-stone-50">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 grid md:grid-cols-5 min-h-[600px]">
        
        <div className="md:col-span-3 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            
            <div className="flex items-center gap-2 mb-8 text-accent-600">
               <div className="p-2 bg-accent-50 rounded-xl">
                  <Heart className="h-5 w-5 fill-accent-600" />
               </div>
               <span className="font-bold text-lg tracking-tight text-stone-900">WeddingPlanner</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">{title}</h1>
            {subtitle && <p className="text-stone-500 mt-2 leading-relaxed">{subtitle}</p>}
            
            <div className="mt-8">
              {children}
            </div>
          </div>
        </div>

        <div className="hidden md:block md:col-span-2 relative bg-stone-900 text-white">
          <img 
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Wedding background" 
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-8 lg:p-12 z-10">
            <div className="mb-6">
               <div className="flex gap-1 mb-3 text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
               </div>
               <blockquote className="text-lg font-medium leading-relaxed opacity-90">
                 "Dzięki tej aplikacji zaoszczędziliśmy setki godzin i uniknęliśmy niepotrzebnego stresu. Nasz dzień był idealny!"
               </blockquote>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                  MK
               </div>
               <div>
                  <div className="font-semibold text-sm">Marta i Krzysztof</div>
                  <div className="text-xs text-stone-300">Pobrali się w lipcu 2024</div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
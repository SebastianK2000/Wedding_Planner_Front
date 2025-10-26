export type TransportType = "Bus" | "Auto";
export type TransportVendor = {
  id: string;
  type: TransportType;
  name: string;
  city: string;
  priceFrom: number;    // cena orientacyjna za usługę
  capacity?: number;    // tylko dla busów
  img: string;
  desc: string;
};

export const TRANSPORT: TransportVendor[] = [
  {
    id: "t1",
    type: "Bus",
    name: "CityBus 50",
    city: "Kraków",
    capacity: 50,
    priceFrom: 1800,
    img: "https://images.unsplash.com/photo-1524312152227-6b1b8c0f3b43?auto=format&fit=crop&q=80&w=1600",
    desc: "Autokar turystyczny, klimatyzacja, mikrofon, bagażnik.",
  },
  {
    id: "t2",
    type: "Bus",
    name: "MiniCoach 30",
    city: "Katowice",
    capacity: 30,
    priceFrom: 1400,
    img: "https://images.unsplash.com/photo-1560464024-54ca61237c1d?auto=format&fit=crop&q=80&w=1600",
    desc: "Midibus 30 miejsc, idealny dla krótszych tras.",
  },
  {
    id: "t3",
    type: "Bus",
    name: "Sprinter 20",
    city: "Warszawa",
    capacity: 20,
    priceFrom: 1100,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600",
    desc: "Bus 20 miejsc, komfortowe fotele, klimatyzacja.",
  },
  {
    id: "t4",
    type: "Auto",
    name: "Klasyk – Jaguar XJ",
    city: "Kraków",
    priceFrom: 900,
    img: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=1600",
    desc: "Auto ślubne klasy premium z kierowcą.",
  },
  {
    id: "t5",
    type: "Auto",
    name: "Retro – VW Garbus",
    city: "Wrocław",
    priceFrom: 700,
    img: "https://images.unsplash.com/photo-1533555907313-7f3cf2404354?auto=format&fit=crop&q=80&w=1600",
    desc: "Stylowe retro, dekor florystyczny w cenie.",
  },
  {
    id: "t6",
    type: "Auto",
    name: "Limuzyna – S-Klasa",
    city: "Warszawa",
    priceFrom: 1200,
    img: "https://images.unsplash.com/photo-1621996346565-5e4d9e92ba54?auto=format&fit=crop&q=80&w=1600",
    desc: "Czarna limuzyna z szoferem, 3–4h pakiet.",
  },
];

// wspólny koszyk dla transportu
export const CART_KEY_TRANSPORT = "wp_cart_transport";

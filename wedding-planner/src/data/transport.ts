export type TransportType = "Bus" | "Auto";
export type TransportVendor = {
  id: string;
  type: TransportType;
  name: string;
  city: string;
  priceFrom: number;
  capacity?: number;
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
    img: "https://images.unsplash.com/photo-1548776556-e5e904ce5fce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYW5zcG9ydGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    desc: "Autokar turystyczny, klimatyzacja, mikrofon, bagażnik.",
  },
  {
    id: "t2",
    type: "Bus",
    name: "MiniCoach 30",
    city: "Katowice",
    capacity: 30,
    priceFrom: 1400,
    img: "https://images.unsplash.com/photo-1523371696700-91e21249c0ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2VkZGluZyUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Midibus 30 miejsc, idealny dla krótszych tras.",
  },
  {
    id: "t3",
    type: "Bus",
    name: "Sprinter 20",
    city: "Warszawa",
    capacity: 20,
    priceFrom: 1100,
    img: "https://plus.unsplash.com/premium_photo-1709052714435-eee4a68f1bd2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwYnVzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    desc: "Bus 20 miejsc, komfortowe fotele, klimatyzacja.",
  },
  {
    id: "t4",
    type: "Auto",
    name: "Klasyk – Jaguar XJ",
    city: "Kraków",
    priceFrom: 900,
    img: "https://images.unsplash.com/photo-1571113908007-5d6aae13d73e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdlZGRpbmclMjBjYXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Auto ślubne klasy premium z kierowcą.",
  },
  {
    id: "t5",
    type: "Auto",
    name: "Retro – VW Garbus",
    city: "Wrocław",
    priceFrom: 700,
    img: "https://images.unsplash.com/photo-1570907870057-e1e338bc0665?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2VkZGluZyUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Stylowe retro, dekor florystyczny w cenie.",
  },
  {
    id: "t6",
    type: "Auto",
    name: "Limuzyna – S-Klasa",
    city: "Warszawa",
    priceFrom: 1200,
    img: "https://plus.unsplash.com/premium_photo-1664297833650-b682525c5b78?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VkZGluZyUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Czarna limuzyna z szoferem, 3–4h pakiet.",
  },
];

export const CART_KEY_TRANSPORT = "wp_cart_transport";

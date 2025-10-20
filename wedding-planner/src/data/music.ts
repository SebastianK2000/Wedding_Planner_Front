export type MusicItem = {
  id: string;
  name: string;
  city: string;
  priceFrom: number;
  img: string;
  desc: string;
  type: "DJ" | "Zespół";
};

export const MUSIC: MusicItem[] = [
  {
    id: "m1",
    name: "DJ Sunshine",
    city: "Kraków",
    priceFrom: 3500,
    img: "https://images.unsplash.com/photo-1482575832494-771f74bf6857?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZyUyMGRqfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    desc: "Energetyczny set, prowadzenie zabaw, oświetlenie LED.",
    type: "DJ",
  },
  {
    id: "m2",
    name: "Golden Strings",
    city: "Warszawa",
    priceFrom: 5200,
    img: "https://images.unsplash.com/photo-1512404871764-1cf03a297841?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGJhbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Kwartet smyczkowy na ceremonię i koktajl.",
    type: "Zespół",
  },
  {
    id: "m3",
    name: "The Wedding Band",
    city: "Gdańsk",
    priceFrom: 6800,
    img: "https://plus.unsplash.com/premium_photo-1681841600703-376f274b2fbc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2VkZGluZyUyMGJhbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Repertuar taneczny lat 80–90 i najnowsze hity.",
    type: "Zespół",
  },
  {
    id: "m4",
    name: "DJ Velvet",
    city: "Wrocław",
    priceFrom: 3900,
    img: "https://images.unsplash.com/photo-1571266028243-d220c6a7edbf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGRqfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    desc: "Nowoczesne brzmienia i elegancka konferansjerka.",
    type: "DJ",
  },
  {
    id: "m5",
    name: "Acoustic Duo",
    city: "Poznań",
    priceFrom: 4500,
    img: "https://images.unsplash.com/photo-1686724641588-06ba81d5bf8c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMG9ya2llc3RyYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Duet wokal + gitara na kameralne przyjęcia.",
    type: "Zespół",
  },
  {
    id: "m6",
    name: "Jazz Lounge",
    city: "Łódź",
    priceFrom: 5100,
    img: "https://images.unsplash.com/photo-1730636106465-5bf686631564?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2VkZGluZyUyMG9ya2llc3RyYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    desc: "Smooth jazz na powitanie i kolację.",
    type: "Zespół",
  },
];

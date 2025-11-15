export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  pricePerPerson: number;
  rating: number;
  tags: string[];
  image: string;
  description: string;
  features: string[];
}

export const VENUES: Venue[] = [
  {
    id: "v1",
    name: "Dwór Pod Dębami",
    city: "Kraków",
    capacity: 180,
    pricePerPerson: 290,
    rating: 4.7,
    tags: ["rustykalna", "ogród", "noclegi"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    description: "Elegancki dwór z historią sięgającą XIX wieku. Otoczony stuletnim parkiem dębowym, oferuje niepowtarzalną atmosferę prywatności i luksusu. Do dyspozycji gości jest przepiękna, przeszklona oranżeria idealna na drink bar, a także stylowe wnętrza pałacowe. Obiekt posiada bazę noclegową dla 45 osób w apartamentach urządzonych w stylu epoki.",
    features: ["Noclegi dla gości", "Parking", "Ogród", "Klimatyzacja", "Menu wegańskie"]
  },
  {
    id: "v2",
    name: "Stara Stajnia Loft",
    city: "Warszawa",
    capacity: 120,
    pricePerPerson: 350,
    rating: 4.8,
    tags: ["loft", "industrial", "wegańskie menu"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Industrialny klimat w sercu miasta. Stara Stajnia to zrewitalizowany budynek z 1905 roku, gdzie surowa cegła łączy się z nowoczesnym designem i stalą. Wysokie na 6 metrów wnętrza zapewniają niesamowitą akustykę i przestrzeń. Sala posiada antresolę idealną na strefę chillout oraz bezpośrednie wyjście na prywatne patio.",
    features: ["Klimatyzacja", "Scena", "Barman", "Oświetlenie", "Projektor"]
  },
  {
    id: "v3",
    name: "Pałac nad Jeziorem",
    city: "Gdańsk",
    capacity: 220,
    pricePerPerson: 410,
    rating: 4.9,
    tags: ["pałac", "nad wodą", "plener"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Klasyczny pałac z widokiem na jezioro, własnym molo i lądowiskiem dla helikopterów. To miejsce dla par szukających absolutnego prestiżu. Ceremonia zaślubin może odbyć się na pomoście przy zachodzie słońca. Wnętrza zdobione kryształowymi żyrandolami i marmurem.",
    features: ["Widok na wodę", "Molo", "Noclegi luxury", "Fajerwerki", "Parking VIP"]
  },
   {
    id: "v4",
    name: "Folwark Słoneczne Wzgórza",
    city: "Wrocław",
    capacity: 90,
    pricePerPerson: 240,
    rating: 4.5,
    tags: ["folwark", "rustic", "namiot"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Sielski folwark z opcją namiotu. Idealny dla mniejszych wesel, parkiet na świeżym powietrzu.",
    features: ["Plener", "Ognisko", "Zwierzęta mile widziane"]
  },
  {
    id: "v5",
    name: "Oranżeria Magnolia",
    city: "Poznań",
    capacity: 150,
    pricePerPerson: 320,
    rating: 4.6,
    tags: ["oranżeria", "ogród", "boho"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Szklana oranżeria otoczona zielenią. Idealna na śluby boho, dodatkowa strefa chillout.",
    features: ["Przeszklony dach", "Ogród zimowy", "Klimatyzacja"]
  },
  {
    id: "v6",
    name: "Barn Forty Three",
    city: "Łódź",
    capacity: 130,
    pricePerPerson: 275,
    rating: 4.7,
    tags: ["stodoła", "rustykalna", "dancefloor"],
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
    description: "Nowoczesna stodoła z wysokim sufitem i widoczną więźbą, efektowne światła i duży parkiet.",
    features: ["Nagłośnienie", "Światła", "Duży parkiet"]
  },
   {
    id: "v7",
    name: "Villa Różana",
    city: "Sopot",
    capacity: 100,
    pricePerPerson: 360,
    rating: 4.8,
    tags: ["villa", "blisko morza", "noclegi"],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
    description: "Kamienica w kurortowym stylu, 10 minut spacerem od plaży, taras na aperitivo.",
    features: ["Blisko plaży", "Taras", "Pokoje"]
  },
  {
    id: "v8",
    name: "Nowa Fabryka Eventów",
    city: "Katowice",
    capacity: 200,
    pricePerPerson: 300,
    rating: 4.6,
    tags: ["industrial", "loft", "scena"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    description: "Postindustrialna przestrzeń z antresolą i sceną dla zespołu, możliwość dojazdu food trucków.",
    features: ["Food trucki", "Scena", "Wysokie wnętrza"]
  },
  {
    id: "v9",
    name: "Dworek Winny Zakątek",
    city: "Zielona Góra",
    capacity: 140,
    pricePerPerson: 285,
    rating: 4.7,
    tags: ["dworek", "winnica", "plener"],
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    description: "Dworek pośród winorośli z altaną ślubną i widokiem na wzgórza winnicy, regionalne menu.",
    features: ["Wino z winnicy", "Altana", "Kuchnia regionalna"]
  },
];

export type PhotographerItem = {
  id: string;
  name: string;
  city: string;
  priceFrom: number;
  img: string;
  desc: string;
};

export const PHOTOGRAPHERS: PhotographerItem[] = [
  { id: "p1", name: "Light & Love", city: "Kraków", priceFrom: 4200,
    img: "https://plus.unsplash.com/premium_photo-1661311863448-cd25776ea31e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    desc: "Reportaż + mini sesja plenerowa." },
  { id: "p2", name: "Moments Studio", city: "Warszawa", priceFrom: 4800,
    img: "https://images.unsplash.com/photo-1623783356340-95375aac85ce?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    desc: "Klasyka i naturalne światło." },
  { id: "p3", name: "Frame & Feel", city: "Gdańsk", priceFrom: 4500,
    img: "https://images.unsplash.com/photo-1611550287705-7ff8b459c8eb?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    desc: "Reportaż pełen emocji." },
  { id: "p4", name: "Golden Hour", city: "Wrocław", priceFrom: 5200,
    img: "https://plus.unsplash.com/premium_photo-1661432712193-4f4726bbe6ec?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    desc: "Sesje o zachodzie słońca." },
  { id: "p5", name: "Candid Stories", city: "Poznań", priceFrom: 4400,
    img: "https://images.unsplash.com/photo-1506355639690-a1f2a100689e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    desc: "Naturalne, nienachalne kadry." },
  { id: "p6", name: "White Lens", city: "Łódź", priceFrom: 4600,
    img: "https://images.unsplash.com/photo-1503525443530-339273ca8a86?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    desc: "Pakiet z albumem premium." },
];

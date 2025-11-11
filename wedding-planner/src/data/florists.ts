export type FloristItem = {
  id: string;
  companyName: string;
  city: string;
  title: string;
  desc: string;
  image: string;
  priceFrom: number;
};

export const FLORISTS: FloristItem[] = [
  { id: "f1", companyName: "Company Name", city: "Kraków", title: "Bukiet ślubny – peonie", desc: "Pastelowe peonie z delikatną zielenią.", priceFrom: 3500,
    image: "https://media.istockphoto.com/id/1713012513/photo/floral-decorative-details-of-the-centerpiece-of-a-wedding-restaurant-in-retro-day-style.webp?a=1&s=612x612&w=0&k=20&c=buGzysxfTDO3SpFP-WyeIBFYYGwHmRB7dQk2b3e1Kqw=" },
  { id: "f2", companyName: "Company Name", city: "Kraków", title: "Bukiet panny młodej – biel", desc: "Białe róże i eustoma, klasyczna elegancja.", priceFrom: 3500,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070" },
  { id: "f3", companyName: "Company Name", city: "Kraków", title: "Dekoracja stołu – centerpiece", desc: "Niska kompozycja na stół weselny.", priceFrom: 3500,
    image: "https://media.istockphoto.com/id/1659238930/photo/beautiful-fresh-flower-table-decoration-special-table-set-up-for-a-wedding-party.webp?a=1&s=612x612&w=0&k=20&c=0jKlRH0FsYpksvARr6rTCUxRloJ3xKrEgNtbNmJ4TyU=" },
  { id: "f4", companyName: "Company Name", city: "Kraków", title: "Łuk ślubny – ceremonia", desc: "Zieleń i kwiaty na tle pleneru.", priceFrom: 3500,
    image: "https://images.unsplash.com/photo-1595467959554-9ffcbf37f10f?auto=format&fit=crop&q=60&w=600" },
  { id: "f5", companyName: "Company Name", city: "Kraków", title: "Butonierka pana młodego", desc: "Minimalistyczna róża z zielenią.", priceFrom: 3500,
    image: "https://images.unsplash.com/photo-1603026198288-6a94fa57e2af?auto=format&fit=crop&q=60&w=600" },
  { id: "f6", companyName: "Company Name", city: "Kraków", title: "Dekoracja alejki", desc: "Kwiaty przy krzesłach wzdłuż przejścia.", priceFrom: 3500,
    image: "https://images.unsplash.com/photo-1521129866021-4313ccf20e9e?auto=format&fit=crop&q=60&w=600" },
];

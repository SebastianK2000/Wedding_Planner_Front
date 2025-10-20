export type FloristItem = {
  id: string;
  title: string;
  desc: string;
  image: string;
};

export const FLORISTS: FloristItem[] = [
  { id: "f1", title: "Bukiet ślubny – peonie", desc: "Pastelowe peonie z delikatną zielenią.",
    image: "https://media.istockphoto.com/id/1713012513/photo/floral-decorative-details-of-the-centerpiece-of-a-wedding-restaurant-in-retro-day-style.webp?a=1&s=612x612&w=0&k=20&c=buGzysxfTDO3SpFP-WyeIBFYYGwHmRB7dQk2b3e1Kqw=" },
  { id: "f2", title: "Bukiet panny młodej – biel", desc: "Białe róże i eustoma, klasyczna elegancja.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070" },
  { id: "f3", title: "Dekoracja stołu – centerpiece", desc: "Niska kompozycja na stół weselny.",
    image: "https://media.istockphoto.com/id/1659238930/photo/beautiful-fresh-flower-table-decoration-special-table-set-up-for-a-wedding-party.webp?a=1&s=612x612&w=0&k=20&c=0jKlRH0FsYpksvARr6rTCUxRloJ3xKrEgNtbNmJ4TyU=" },
  { id: "f4", title: "Łuk ślubny – ceremonia", desc: "Zieleń i kwiaty na tle pleneru.",
    image: "https://images.unsplash.com/photo-1595467959554-9ffcbf37f10f?auto=format&fit=crop&q=60&w=600" },
  { id: "f5", title: "Butonierka pana młodego", desc: "Minimalistyczna róża z zielenią.",
    image: "https://images.unsplash.com/photo-1603026198288-6a94fa57e2af?auto=format&fit=crop&q=60&w=600" },
  { id: "f6", title: "Dekoracja alejki", desc: "Kwiaty przy krzesłach wzdłuż przejścia.",
    image: "https://images.unsplash.com/photo-1521129866021-4313ccf20e9e?auto=format&fit=crop&q=60&w=600" },
];

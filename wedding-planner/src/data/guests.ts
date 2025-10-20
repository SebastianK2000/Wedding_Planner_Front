export type GuestStatus = "potwierdzone" | "oczekuje" | "odmowa";
export type Diet = "standard" | "wegetariańska" | "bezglutenowa" | "wegańska";

export type Guest = {
  id: string;
  name: string;
  side: "panna młoda" | "pan młody";
  status: GuestStatus;
  table?: number | null;
  diet: Diet;
  plusOne: boolean;
  email?: string;
  phone?: string;
  notes?: string;
};

const rawNames = [
  "Anna Nowak","Jan Kowalski","Katarzyna Malinowska","Piotr Wiśniewski","Agnieszka Zielińska","Tomasz Kamiński",
  "Magdalena Wójcik","Michał Lewandowski","Ewa Szymańska","Paweł Dąbrowski","Joanna Kozłowska","Krzysztof Jankowski",
  "Natalia Mazur","Łukasz Wojciechowski","Karolina Kwiatkowska","Mateusz Krawczyk","Justyna Piotrowska","Adam Grabowski",
  "Aleksandra Pawlak","Marcin Zając","Patrycja Michalska","Rafał Król","Monika Wieczorek","Damian Wróbel",
  "Weronika Rutkowska","Bartosz Dudek","Sylwia Szczepańska","Sebastian Barański","Paulina Głowacka","Jakub Lis",
  "Dominika Nowicka","Konrad Sokołowski","Dagmara Czarnecka","Marek Pawłowski","Klaudia Bąk","Filip Chmielewski",
  "Zuzanna Sawicka","Arkadiusz Jaworski","Emilia Pawlik","Norbert Piasecki","Marta Krupa","Patryk Cieślak",
  "Alicja Mróz","Kamil Kalinowski","Julia Wójcik","Grzegorz Stępień","Oliwia Malec","Szymon Urban",
  "Iga Borkowska","Mikołaj Olszewski","Helena Fabiańska","Wojciech Musiał","Nina Radecka","Igor Sobczak",
  "Gabriela Borowska","Oskar Kaczmarek","Lena Tomczyk","Miłosz Bednarek","Amelia Łuczak","Tymoteusz Wilk"
];

const statuses: GuestStatus[] = ["potwierdzone","oczekuje","odmowa"];
const diets: Diet[] = ["standard","wegetariańska","bezglutenowa","wegańska"];

const slug = (s: string) =>
  s.toLowerCase()
   .normalize("NFD").replace(/\p{Diacritic}/gu,"")
   .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export const GUESTS: Guest[] = rawNames.map((name, i) => {
  const status = statuses[i % statuses.length];
  const diet = diets[i % diets.length];
  const side = i % 2 === 0 ? "panna młoda" : "pan młody";
  const table = status === "odmowa" ? null : ((i % 10) + 1);
  return {
    id: `g${i+1}`,
    name,
    side,
    status,
    table,
    diet,
    plusOne: i % 5 === 0,
    email: `${slug(name)}@example.com`,
    phone: `+48 600 00 ${String(10 + (i % 90)).padStart(2,"0")}`,
    notes: i % 7 === 0 ? "Preferencje: miejsce blisko parkietu." : undefined,
  };
});

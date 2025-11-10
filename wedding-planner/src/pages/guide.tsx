import { Link } from "react-router-dom";

export default function Guide() {
  const baseCard = "bg-white rounded-2xl shadow border border-stone-200/60 p-5";

  const btnPrimary =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium " +
    "bg-accent-500 text-white hover:bg-accent-600 transition-colors";
  const btnGhost =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium " +
    "border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200 transition-colors";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3">
        <div className={`${baseCard} sticky top-24`}>
          <h2 className="text-base font-semibold mb-3">Przewodnik</h2>
          <ul className="space-y-2 text-sm">
            {[
              ["strategia", "1. Strategia i cele"],
              ["harmonogram", "2. Harmonogram"],
              ["budzet", "3. Budżet i koszty"],
              ["dostawcy", "4. Pytania do dostawców"],
              ["dzien-slubu", "5. Dzień ślubu"],
              ["plan-b", "6. Plan awaryjny"],
              ["komunikacja", "7. Komunikacja i RSVP"],
              ["stylistyka", "8. Stylistyka i paleta"],
              ["checklisty", "9. Checklisty"],
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block rounded-xl px-3 py-2 hover:bg-stone-50 text-stone-700"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Link to="/zadania" className={btnPrimary}>Przenieś do Zadań</Link>
            <Link to="/budzet" className={btnGhost}>Budżet</Link>
          </div>
        </div>
      </aside>

      <main className="col-span-12 md:col-span-9 space-y-6">
        <section className={`${baseCard} bg-brand-50/60`}>
          <h1 className="text-2xl font-semibold">Planowanie wesela – przewodnik krok po kroku</h1>
          <p className="text-stone-600 mt-2">
            Spójna strategia, realny budżet i jasne role. Poniżej znajdziesz harmonogram,
            listy kontrolne oraz pytania do dostawców – gotowe do skopiowania.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl bg-brand-100 text-stone-700 text-xs">#ECE2D0 — kolor bazowy</span>
            <span className="px-3 py-1 rounded-xl bg-accent-500 text-white text-xs">Akcent CTA</span>
          </div>
        </section>

        <section id="strategia" className={baseCard}>
          <h3 className="text-lg font-semibold">1. Strategia i cele</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <div className="rounded-xl border border-brand-200 bg-brand-100/60 p-4">
              <p className="font-medium mb-2">Ustalcie priorytety</p>
              <ul className="list-disc pl-5 text-stone-700 text-sm space-y-1">
                <li>Klimat: rustykalny / klasyczny / modern</li>
                <li>Widełki gości i budżetu</li>
                <li>Must-have vs nice-to-have</li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 p-4">
              <p className="font-medium mb-2">Zakres i odpowiedzialności</p>
              <ul className="list-disc pl-5 text-stone-700 text-sm space-y-1">
                <li>Ślub cywilny/kościelny, przyjęcie, poprawiny?</li>
                <li>Decydenci i sposób akceptacji wydatków</li>
                <li>Jeden koordynator kontaktu w dniu ślubu</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="harmonogram" className={baseCard}>
          <h3 className="text-lg font-semibold">2. Harmonogram (12 miesięcy → 0)</h3>
          <ol className="mt-3 space-y-6">
            {[
              {
                title: "12–9 miesięcy przed",
                items: [
                  "Określenie budżetu i wstępnej listy gości.",
                  <>Rezerwacja <Link className="underline" to="/sala-weselna">sali weselnej</Link> (data, zaliczka, umowa).</>,
                  <>Wybór <Link className="underline" to="/fotograf">fotografa</Link> i <Link className="underline" to="/muzyka">muzyki</Link> (portfolio, umowy).</>,
                  "Moodboard i paleta kolorów.",
                ],
              },
              {
                title: "9–6 miesięcy przed",
                items: [
                  "Florysta i dekoracje, wstępny plan stołów, menu.",
                  "Transport dla gości i pary młodej.",
                  "Sesja narzeczeńska (opcjonalnie).",
                  "Save-the-date do gości.",
                ],
              },
              {
                title: "6–3 miesiące przed",
                items: [
                  "Finalizacja menu i tortu, preferencje dietetyczne.",
                  "Plan atrakcji: pierwszy taniec, podziękowania, fotobudka.",
                  "Technikalia z zespołem/DJ: repertuar, przerwy, sprzęt.",
                ],
              },
              {
                title: "3–1 miesiąc przed",
                items: [
                  "Rozsadzenie gości i układ sali, tablica stołów.",
                  "Harmonogram dnia rozesłany do dostawców.",
                  "Potwierdzenia RSVP i potrzeby specjalne.",
                  "Plan B (pogoda, opóźnienia, awarie).",
                ],
              },
              {
                title: "T-30 → T-0",
                items: [
                  "Potwierdzenie godzin i kontaktów z dostawcami.",
                  "Przekazanie numeru do koordynatora.",
                  "Pakiet „dzień ślubu”: dokumenty, obrączki, awaryjna kosmetyczka, apteczka.",
                ],
              },
            ].map(({ title, items }, idx) => (
              <li key={idx} className="relative pl-6 border-l-2 border-brand-200">
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-accent-500" />
                <p className="font-medium">{title}</p>
                <ul className="list-disc pl-5 text-sm text-stone-700 mt-1 space-y-1">
                  {items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="budzet" className={baseCard}>
          <h3 className="text-lg font-semibold">3. Budżet i koszty</h3>
          <p className="text-stone-600">
            Śledź wydatki i zostaw bufor 10–15%. Rozdziel <em>planowane</em> vs <em>rzeczywiste</em>.
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500">
                  <th className="py-2">Pozycja</th>
                  <th className="py-2">Widełki</th>
                  <th className="py-2">Uwagi</th>
                </tr>
              </thead>
              <tbody className="[&>tr:not(:last-child)]:border-b [&>tr]:border-stone-200/60">
                <tr><td className="py-2">Sala (z menu)</td><td>240–420 zł / os.</td><td>Wliczone napoje? Korek?</td></tr>
                <tr><td className="py-2">Muzyka (DJ/zespół)</td><td>3.5–8 tys. zł</td><td>Sprzęt i światło w cenie?</td></tr>
                <tr><td className="py-2">Fotograf</td><td>4–7 tys. zł</td><td>Album, liczba zdjęć, termin oddania.</td></tr>
                <tr><td className="py-2">Florystyka</td><td>2–8 tys. zł</td><td>Sezonowość kwiatów, zakres dekoracji.</td></tr>
                <tr><td className="py-2">Transport</td><td>1–3 tys. zł</td><td>Liczba kursów, trasy.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <Link to="/budzet" className={btnPrimary}>Otwórz moduł Budżet</Link>
          </div>
        </section>

        <section id="dostawcy" className={baseCard}>
          <h3 className="text-lg font-semibold">4. Pytania do dostawców</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            {[
              ["Sala weselna", ["Co obejmuje cena (menu, napoje, dekor)?", "Godziny i limity głośności.", "Korkowe/tort – opłaty serwisowe.", "Back-up prądu/klimatyzacji."]],
              ["Muzyka", ["Skład, przerwy, logistyka sprzętu.", "Repertuar must/never play.", "Kontakt z salą dot. zasilania."]],
              ["Fotograf", ["Liczba godzin i zdjęć, termin oddania.", "Backup plików, prawa do publikacji.", "Albumy/odbitki w cenie?"]],
              ["Florysta", ["Zakres (bukiet, łuk, ścianka, stoły).", "Sezonowość i alternatywy.", "Czas montażu/demontażu."]],
              ["Transport", ["Sloty czasowe, liczba kursów.", "Miejsca zbiórek i oznaczenia."]],
            ].map(([head, list], i) => (
              <div key={`${head}-${i}`} className="rounded-xl border border-stone-200 p-4">
                <p className="font-medium mb-1">{head as string}</p>
                <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
                  {(list as string[]).map((li, k) => <li key={k}>{li}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="dzien-slubu" className={baseCard}>
          <h3 className="text-lg font-semibold">5. Dzień ślubu – minute plan</h3>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-stone-700 mt-3">
            <li className="rounded-xl border border-stone-200 p-3"><strong>08:00–11:00</strong> Fryzura, makijaż, detale.</li>
            <li className="rounded-xl border border-stone-200 p-3"><strong>11:00–13:00</strong> Ubieranie, first look, portrety.</li>
            <li className="rounded-xl border border-stone-200 p-3"><strong>14:00</strong> Ceremonia (+15 min bufor).</li>
            <li className="rounded-xl border border-stone-200 p-3"><strong>16:00</strong> Przyjazd, toast, obiad.</li>
            <li className="rounded-xl border border-stone-200 p-3"><strong>18:00</strong> Pierwszy taniec, blok taneczny.</li>
            <li className="rounded-xl border border-stone-200 p-3"><strong>20:00</strong> Tort, podziękowania, zabawa.</li>
          </ul>
        </section>

        <section id="plan-b" className={baseCard}>
          <h3 className="text-lg font-semibold">6. Plan awaryjny</h3>
          <div className="rounded-xl border-l-4 border-accent-500 bg-brand-100/60 p-4 text-sm text-stone-700">
            <p className="font-medium mb-1">Ryzyka i zabezpieczenia</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pogoda: namioty/parasole, alternatywa dla pleneru.</li>
              <li>Opóźnienia: bufory 10–15 min między punktami.</li>
              <li>Zdrowie: apteczka, zestaw do szycia, zapasowe buty.</li>
              <li>Sprzęt: zapasowy mikrofon, przedłużacze, powerbanki.</li>
            </ul>
          </div>
        </section>

        <section id="komunikacja" className={baseCard}>
          <h3 className="text-lg font-semibold">7. Komunikacja i RSVP</h3>
          <div className="grid sm:grid-cols-3 gap-4 mt-3 text-sm text-stone-700">
            <div className="rounded-xl border border-stone-200 p-4">
              <p className="font-medium mb-1">Save-the-date</p>
              <p>Wysyłka 6–9 mies. przed.</p>
            </div>
            <div className="rounded-xl border border-stone-200 p-4">
              <p className="font-medium mb-1">Zaproszenia</p>
              <p>3–4 mies. przed • RSVP do T-60.</p>
            </div>
            <div className="rounded-xl border border-stone-200 p-4">
              <p className="font-medium mb-1">Informacje dla gości</p>
              <p>Mapa dojazdu, noclegi, dress code, prezenty.</p>
            </div>
          </div>
        </section>

        <section id="stylistyka" className={baseCard}>
          <h3 className="text-lg font-semibold">8. Stylistyka i paleta</h3>
          <p className="text-stone-600">Spójność w papeterii, kwiatach, oświetleniu i dekorze.</p>
          <div className="mt-3 flex gap-3">
            <span className="inline-block w-10 h-10 rounded-xl" style={{ background: "#ECE2D0" }} />
            <span className="inline-block w-10 h-10 rounded-xl" style={{ background: "#CFA37A" }} />
            <span className="inline-block w-10 h-10 rounded-xl bg-stone-700" />
            <span className="inline-block w-10 h-10 rounded-xl bg-stone-200" />
          </div>
        </section>

        <section id="checklisty" className={baseCard}>
          <h3 className="text-lg font-semibold">9. Checklisty do odhaczania</h3>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <div className="rounded-xl border border-stone-200 p-4">
              <p className="font-medium mb-1">Przed ślubem (T-30)</p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
                <li>RSVP i diety specjalne</li>
                <li>Harmonogram u dostawców</li>
                <li>Lista kontaktów alarmowych</li>
                <li>Terminy płatności i zaliczek</li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 p-4">
              <p className="font-medium mb-1">Go-bag (dzień ślubu)</p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
                <li>Ładowarka/powerbank</li>
                <li>Igła, nitka, plastry</li>
                <li>Bibułki, lakier, chusteczki</li>
                <li>Woda i przekąska</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Link to="/zadania" className={btnPrimary}>Dodaj do Zadań</Link>
            <Link to="/goscie" className={btnGhost}>Zarządzaj gośćmi</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

import { useMemo, useState } from "react";
import { GUESTS, type Guest, type GuestStatus } from "@/data/guests";


const baseBtn =
  "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2 hover:bg-brand-200";

const btnFilter =
  "bg-brand-100 px-3 py-2 rounded-xl border text-sm border-stone-200 text-stone-700 hover:bg-brand-200";

  const btnFilterActive =
  "px-3 py-2 rounded-xl text-sm border-brand-300 bg-brand-100 text-stone-900 shadow-inner hover:bg-brand-200";

const btnMicro =
  "text-xs px-2 py-1 rounded-xl border border-brand-200 bg-brand-100 text-stone-700 hover:bg-brand-200";


const statusLabels: Record<GuestStatus, string> = {
  potwierdzone: "Potwierdzone",
  oczekuje: "Oczekuje",
  odmowa: "Odmowa",
};

const btnPrimary = baseBtn + " bg-accent-600 text-white hover:bg-yellow-700";
const btnSecondary = baseBtn + " border border-brand-200 bg-brand-200 text-stone-700";

export default function Guests() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuestStatus | "wszyscy">("wszyscy");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [local, setLocal] = useState<Guest[]>(GUESTS);

  const counts = useMemo(() => {
    return local.reduce(
      (acc, g) => {
        acc.total++;
        acc[g.status]++;
        return acc;
      },
      { total: 0, potwierdzone: 0, oczekuje: 0, odmowa: 0 } as Record<string, number>
    );
  }, [local]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return local.filter((g) => {
      const okStatus = statusFilter === "wszyscy" ? true : g.status === statusFilter;
      const okQuery =
        q.length === 0 ||
        g.name.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q) ||
        String(g.table ?? "").includes(q);
      return okStatus && okQuery;
    });
  }, [local, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function cycleStatus(g: Guest) {
    const next: GuestStatus =
      g.status === "potwierdzone" ? "oczekuje" : g.status === "oczekuje" ? "odmowa" : "potwierdzone";
    setLocal((prev) => prev.map((x) => (x.id === g.id ? { ...x, status: next, table: next === "odmowa" ? null : x.table } : x)));
  }

  function updateTable(g: Guest, table: number | null) {
    setLocal((prev) => prev.map((x) => (x.id === g.id ? { ...x, table } : x)));
  }

  function downloadCSV() {
    const header = ["id","name","side","status","table","diet","plusOne","email","phone","notes"];
    const rows = filtered.map((g) => [
      g.id, g.name, g.side, g.status, g.table ?? "", g.diet, g.plusOne ? "1" : "0", g.email ?? "", g.phone ?? "", g.notes ?? ""
    ]);
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "goscie.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">Goście</h2>
          <p className="text-stone-600">Lista gości, RSVP i stoliki (mock).</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={downloadCSV}>Eksport CSV</button>
          <button
            className={btnPrimary}
            onClick={() => setLocal(GUESTS)}
            title="Przywróć dane przykładowe"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <StatCard label="Razem" value={counts.total} />
        <StatCard label="Potwierdzone" value={counts.potwierdzone} tone="ok" />
        <StatCard label="Oczekuje" value={counts.oczekuje} tone="warn" />
        <StatCard label="Odmowa" value={counts.odmowa} tone="bad" />
      </div>

      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-stone-500 mb-1">Szukaj</label>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="imię, email, stolik…"
              className="bg-brand-100 w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
            <div className="flex gap-2 items-end">
              {(["wszyscy","potwierdzone","oczekuje","odmowa"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={statusFilter === s ? btnFilterActive : btnFilter}
                >
                  {s === "wszyscy" ? "Wszyscy" : statusLabels[s]}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Lista gości */}
      <div className="bg-white rounded-2xl shadow border border-stone-200/60 p-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {pageItems.map((g) => (
            <div key={g.id} className="p-3 rounded-xl border border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{g.name}</div>
                <span
                  className={
                    "text-xs px-2 py-1 rounded-full " +
                    (g.status === "potwierdzone"
                      ? "bg-green-100 text-green-700"
                      : g.status === "oczekuje"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700")
                  }
                >
                  {statusLabels[g.status]}
                </span>
              </div>

              <div className="text-stone-600 flex flex-wrap gap-x-4 gap-y-1">
                <span>Strona: <strong className="text-stone-800">{g.side}</strong></span>
                <span>Dieta: <strong className="text-stone-800">{g.diet}</strong></span>
                {g.plusOne && <span>+1</span>}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500">Stolik</label>
                <select
                  value={g.table ?? ""}
                  onChange={(e) => updateTable(g, e.target.value ? Number(e.target.value) : null)}
                  className="bg-brand-100 rounded-lg border border-stone-300 px-2 py-1"
                >
                  <option value="">—</option>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>

                  <button
                    className={"ml-auto " + btnMicro}
                    onClick={() => cycleStatus(g)}
                    title="Zmień status (potwierdzone → oczekuje → odmowa)"
                  >
                    Zmień status
                  </button>

              </div>

              {g.email && (
                <div className="text-xs text-stone-500">
                  <span className="mr-3">{g.email}</span>
                  <span>{g.phone}</span>
                </div>
              )}

              {g.notes && <div className="text-xs text-stone-600 italic">{g.notes}</div>}
            </div>
          ))}
        </div>

        {/* Paginacja */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            className="bg-brand-100 px-3 py-2 rounded-xl border border-stone-200 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          <span className=" text-sm text-stone-600">
            Strona <strong>{page}</strong> / {totalPages}
          </span>
          <button
            className="bg-brand-100 px-3 py-2 rounded-xl border border-stone-200 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: "ok"|"warn"|"bad" }) {
  const toneCls =
    tone === "ok" ? "bg-green-50 border-green-200 text-green-800" :
    tone === "warn" ? "bg-amber-50 border-amber-200 text-amber-800" :
    tone === "bad" ? "bg-rose-50 border-rose-200 text-rose-800" :
    "bg-brand-50 border-brand-200 text-stone-800";
  return (
    <div className={`rounded-2xl border p-4 ${toneCls}`}>
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-semibold leading-tight">{value}</div>
    </div>
  );
}

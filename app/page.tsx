"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DASHBOARD_PASSWORD = "OceanFlow2024";

type DayStat = {
  date: string;
  visitors: number;
  pageViews: number;
  whatsapp: number;
  bookings: number;
};

const trafficData: DayStat[] = [
  { date: "29 aug", visitors: 41, pageViews: 96, whatsapp: 5, bookings: 1 },
  { date: "30 aug", visitors: 58, pageViews: 132, whatsapp: 8, bookings: 2 },
  { date: "31 aug", visitors: 72, pageViews: 165, whatsapp: 11, bookings: 3 },
  { date: "1 sep", visitors: 35, pageViews: 81, whatsapp: 4, bookings: 1 },
  { date: "2 sep", visitors: 64, pageViews: 149, whatsapp: 9, bookings: 2 },
  { date: "3 sep", visitors: 89, pageViews: 203, whatsapp: 14, bookings: 4 },
  { date: "4 sep", visitors: 76, pageViews: 178, whatsapp: 10, bookings: 3 },
];

const trafficSources = [
  { source: "Google", visitors: 168 },
  { source: "Instagram", visitors: 121 },
  { source: "Direct", visitors: 94 },
  { source: "WhatsApp", visitors: 52 },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("nl-NL").format(value);
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const kpis = useMemo(() => {
    const visitors = trafficData.reduce((sum, day) => sum + day.visitors, 0);
    const pageViews = trafficData.reduce((sum, day) => sum + day.pageViews, 0);
    const whatsapp = trafficData.reduce((sum, day) => sum + day.whatsapp, 0);
    const bookings = trafficData.reduce((sum, day) => sum + day.bookings, 0);
    const conversion = visitors === 0 ? 0 : (bookings / visitors) * 100;
    return { visitors, pageViews, whatsapp, conversion };
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!authenticated) {
    return (
      <div className="flex flex-1 items-center justify-center bg-ocean-light px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-ocean-dark">Ocean Flow</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Log in om het dashboard te bekijken
          </p>
          <label className="mt-6 block text-sm font-medium text-ocean-dark">
            Wachtwoord
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(false);
              }}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-ocean-accent focus:ring-2 focus:ring-ocean-accent/30"
              placeholder="********"
              autoFocus
            />
          </label>
          {error && (
            <p className="mt-2 text-sm text-red-500">Onjuist wachtwoord</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-ocean-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-accent/90"
          >
            Inloggen
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ocean-light">
      <header className="bg-ocean-dark px-6 py-6 text-white sm:px-10">
        <h1 className="text-2xl font-bold">Ocean Flow Dashboard</h1>
        <p className="text-sm text-white/70">
          Webtraffic &amp; Booking Analytics — Curaçao
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Bezoekers" value={formatNumber(kpis.visitors)} />
          <KpiCard label="Page Views" value={formatNumber(kpis.pageViews)} />
          <KpiCard
            label="WhatsApp Clicks"
            value={formatNumber(kpis.whatsapp)}
          />
          <KpiCard label="Conversie" value={`${kpis.conversion.toFixed(1)}%`} />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Traffic trend (7 dagen)">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F4F8" />
                <XAxis dataKey="date" stroke="#1B3557" fontSize={12} />
                <YAxis stroke="#1B3557" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  name="Bezoekers"
                  stroke="#20C9A6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke="#1B3557"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Traffic sources">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trafficSources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F4F8" />
                <XAxis dataKey="source" stroke="#1B3557" fontSize={12} />
                <YAxis stroke="#1B3557" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="visitors"
                  name="Bezoekers"
                  fill="#20C9A6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="border-b border-zinc-100 px-6 py-4 text-lg font-semibold text-ocean-dark">
            Dagelijks overzicht
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ocean-light text-ocean-dark">
                <tr>
                  <th className="px-6 py-3 font-semibold">Datum</th>
                  <th className="px-6 py-3 font-semibold">Bezoekers</th>
                  <th className="px-6 py-3 font-semibold">Page Views</th>
                  <th className="px-6 py-3 font-semibold">WhatsApp</th>
                  <th className="px-6 py-3 font-semibold">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {trafficData.map((day) => (
                  <tr
                    key={day.date}
                    className="border-b border-zinc-50 last:border-0"
                  >
                    <td className="px-6 py-3">{day.date}</td>
                    <td className="px-6 py-3">{day.visitors}</td>
                    <td className="px-6 py-3">{day.pageViews}</td>
                    <td className="px-6 py-3">{day.whatsapp}</td>
                    <td className="px-6 py-3">{day.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ocean-dark">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-ocean-dark">{title}</h2>
      {children}
    </div>
  );
}

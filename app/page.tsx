"use client";

import { Fragment, useMemo, useState, type FormEvent } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DASHBOARD_PASSWORD = "OceanFlow2024";

type Timeframe = "today" | "week" | "month";

const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: "today", label: "Vandaag" },
  { key: "week", label: "Deze week" },
  { key: "month", label: "Deze maand" },
];

const FUNNEL_DATA: Record<
  Timeframe,
  { visitors: number; clicks: number; bookings: number }
> = {
  today: { visitors: 89, clicks: 22, bookings: 6 },
  week: { visitors: 434, clicks: 109, bookings: 30 },
  month: { visitors: 412, clicks: 101, bookings: 28 },
};

const SOURCES = [
  "Facebook",
  "Instagram",
  "TikTok",
  "Viator",
  "TripAdvisor",
  "Direct",
] as const;

type Source = (typeof SOURCES)[number];

const SOURCE_COLORS: Record<Source, string> = {
  Facebook: "#1B3557",
  Instagram: "#20C9A6",
  TikTok: "#4F86C6",
  Viator: "#F2A65A",
  TripAdvisor: "#6FCF97",
  Direct: "#8FA6BF",
};

const SOURCE_DATA: Record<Timeframe, Record<Source, number>> = {
  today: {
    Facebook: 35,
    Instagram: 25,
    TikTok: 15,
    Viator: 15,
    TripAdvisor: 8,
    Direct: 2,
  },
  week: {
    Facebook: 32,
    Instagram: 27,
    TikTok: 18,
    Viator: 12,
    TripAdvisor: 7,
    Direct: 4,
  },
  month: {
    Facebook: 30,
    Instagram: 24,
    TikTok: 20,
    Viator: 14,
    TripAdvisor: 9,
    Direct: 3,
  },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("nl-NL").format(value);
}

function stepWidth(value: number, base: number) {
  if (base === 0) return 40;
  return Math.max(40, Math.min(100, 40 + 60 * (value / base)));
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>("today");

  const funnel = FUNNEL_DATA[timeframe];
  const sources = SOURCE_DATA[timeframe];

  const ctr = useMemo(
    () => (funnel.visitors === 0 ? 0 : (funnel.clicks / funnel.visitors) * 100),
    [funnel],
  );

  const steps = useMemo(
    () => [
      {
        key: "visitors",
        label: "Bezoekers",
        value: funnel.visitors,
        widthPct: 100,
        sub: "100%",
        color: "#1B3557",
      },
      {
        key: "clicks",
        label: "Clicks",
        value: funnel.clicks,
        widthPct: stepWidth(funnel.clicks, funnel.visitors),
        sub: `${((funnel.clicks / funnel.visitors) * 100).toFixed(1)}%`,
        color: "#20C9A6",
      },
      {
        key: "bookings",
        label: "Bookings",
        value: funnel.bookings,
        widthPct: stepWidth(funnel.bookings, funnel.visitors),
        sub: `${((funnel.bookings / funnel.clicks) * 100).toFixed(0)}% van clicks`,
        color: "#4F86C6",
      },
    ],
    [funnel],
  );

  const sourceChartData = useMemo(
    () => [{ name: "Bronnen", ...sources }],
    [sources],
  );

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
        <h1 className="text-2xl font-bold">🐢 Ocean Flow Dashboard</h1>
        <p className="text-sm text-white/70">
          Webtraffic &amp; Booking Analytics — Curaçao
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              type="button"
              onClick={() => setTimeframe(tf.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                timeframe === tf.key
                  ? "bg-ocean-accent text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-sm font-semibold text-ocean-dark">
            Funnel
          </h2>
          <div className="mx-auto flex max-w-md flex-col items-center gap-2">
            {steps.map((step, index) => (
              <Fragment key={step.key}>
                <div
                  style={{
                    width: `${step.widthPct}%`,
                    backgroundColor: step.color,
                  }}
                  className="rounded-xl py-4 text-center text-white shadow-sm"
                >
                  <p className="text-2xl font-bold">
                    {formatNumber(step.value)}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    {step.label}
                  </p>
                </div>
                <p className="text-xs font-medium text-zinc-500">
                  ({step.sub})
                </p>
                {index < steps.length - 1 && (
                  <span className="text-lg text-ocean-accent">▼</span>
                )}
              </Fragment>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-sm font-semibold text-ocean-dark">
            Traffic bron breakdown
          </h2>
          <ResponsiveContainer width="100%" height={70}>
            <BarChart
              data={sourceChartData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip formatter={(value) => `${value}%`} />
              {SOURCES.map((source, index) => (
                <Bar
                  key={source}
                  dataKey={source}
                  stackId="sources"
                  fill={SOURCE_COLORS[source]}
                  radius={
                    index === 0
                      ? [8, 0, 0, 8]
                      : index === SOURCES.length - 1
                        ? [0, 8, 8, 0]
                        : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {SOURCES.map((source) => (
              <div key={source} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: SOURCE_COLORS[source] }}
                />
                <span className="text-zinc-600">{source}</span>
                <span className="ml-auto font-semibold text-ocean-dark">
                  {sources[source]}%
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Bezoekers" value={formatNumber(funnel.visitors)} />
          <KpiCard label="CTR (%)" value={`${ctr.toFixed(1)}%`} />
          <KpiCard label="Bookings" value={formatNumber(funnel.bookings)} />
        </section>
      </main>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ocean-dark">{value}</p>
    </div>
  );
}

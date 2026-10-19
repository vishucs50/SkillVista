"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Github,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const cards = [
  { key: "totalUsers", label: "Total users", icon: Users, color: "text-cyan-500" },
  { key: "recentUsers", label: "New in range", icon: Activity, color: "text-emerald-500" },
  { key: "githubUsers", label: "GitHub connected", icon: Github, color: "text-violet-500" },
  { key: "assessments", label: "Assessments", icon: CheckCircle2, color: "text-amber-500" },
  { key: "skillGaps", label: "Skill-gap analyses", icon: BarChart3, color: "text-rose-500" },
  { key: "attempts", label: "Mental attempts", icon: Clock3, color: "text-blue-500" },
];

function StatCard({ item, value }) {
  const Icon = item.icon;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{item.label}</span>
        <Icon className={`size-5 ${item.color}`} />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value ?? 0}</p>
    </div>
  );
}

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value || 0);
}

function formatDuration(value) {
  if (!value) return "0 ms";
  return `${formatNumber(value, 0)} ms`;
}

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/overview?days=${days}`);
      const payload = await response.json();
      if (response.status === 403) {
        setError(
          `Admin access denied. Session email found: ${payload.diagnostics?.hasSessionEmail ? "yes" : "no"}. Configured admin emails: ${payload.diagnostics?.configuredAdminCount ?? 0}. Match: ${payload.diagnostics?.emailMatches ? "yes" : "no"}.`,
        );
        return;
      }
      if (!response.ok) throw new Error(payload.error || "Could not load admin data");
      setData(payload);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [days, router]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated") load();
  }, [status, router, load]);

  if (status === "loading" || loading && !data) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading admin console...</div>;
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
              <ShieldAlert className="size-4" /> Admin console
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Application health</h1>
            <p className="mt-2 text-muted-foreground">Monitor growth, engagement, integrations, and runtime health.</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted" disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </header>

        {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => <StatCard key={item.key} item={item} value={data?.metrics[item.key]} />)}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <div><h2 className="font-semibold">User growth</h2><p className="text-sm text-muted-foreground">New registrations by day</p></div>
              <BarChart3 className="size-5 text-muted-foreground" />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailyUsers || []}>
                  <defs><linearGradient id="users" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(value) => value.slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="url(#users)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Authentication providers</h2>
            <p className="mb-6 text-sm text-muted-foreground">How users sign in</p>
            <div className="space-y-4">
              {(data?.providers || []).map((provider) => (
                <div key={provider.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-3">
                  <span className="capitalize">{provider.name}</span><span className="font-semibold">{provider.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2"><Activity className="size-5 text-emerald-500" /></div>
            <div><h2 className="font-semibold">CloudWatch runtime metrics</h2><p className="text-sm text-muted-foreground">AWS Lambda metrics for the selected period</p></div>
          </div>
          {!data?.cloudWatch?.configured ? (
            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">CloudWatch is not configured. Add the read-only CloudWatch permission to the server IAM identity.</p>
          ) : data.cloudWatch.error ? (
                <p className="rounded-lg bg-amber-500/10 p-4 text-sm text-amber-700">{data.cloudWatch.error}</p>
          ) : (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Invocations</p>
                      <p className="mt-2 text-2xl font-semibold">{formatNumber(data.cloudWatch.summary?.invocations)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Total Lambda requests</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Errors</p>
                      <p className="mt-2 text-2xl font-semibold text-rose-500">{formatNumber(data.cloudWatch.summary?.errors)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatNumber(data.cloudWatch.summary?.errorRate, 2)}% error rate</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Duration</p>
                      <p className="mt-2 text-2xl font-semibold">{formatDuration(data.cloudWatch.summary?.averageDuration)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Average execution time</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Peak concurrency</p>
                      <p className="mt-2 text-2xl font-semibold">{formatNumber(data.cloudWatch.summary?.peakConcurrency)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatNumber(data.cloudWatch.summary?.throttles)} throttles</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {(data.cloudWatch.metrics || [])
                      .filter((metric) => !["invocations", "errors", "durationAverage", "concurrency"].includes(metric.id))
                      .map((metric) => (
                        <div key={metric.id} className="rounded-xl border border-border/60 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              {metric.id === "durationMaximum" ? "Maximum duration" : "Throttles"}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {metric.id === "durationMaximum" ? "peak" : "total"}
                            </span>
                          </div>
                          <p className="mt-2 text-xl font-semibold">
                            {metric.id === "durationMaximum"
                              ? formatDuration(Math.max(...(metric.values || [0])))
                              : formatNumber((metric.values || []).reduce((sum, value) => sum + value, 0))}
                          </p>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Values are aggregated from the AWS/Lambda metrics available to the configured CloudWatch identity for the selected period.
                  </p>
                </div>
          )}
        </section>
      </div>
    </main>
  );
}

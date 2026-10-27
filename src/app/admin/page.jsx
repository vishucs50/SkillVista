"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cpu,
  Database,
  Download,
  Filter,
  Github,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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

const statCards = [
  { key: "totalUsers", label: "Total Registered Users", icon: Users, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { key: "recentUsers", label: "Registered in Range", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "assessments", label: "Assessments Completed", icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "githubUsers", label: "GitHub Connected", icon: Github, color: "text-violet-500", bg: "bg-violet-500/10" },
  { key: "skillGaps", label: "Skill Gap Analyses", icon: BarChart3, color: "text-rose-500", bg: "bg-rose-500/10" },
  { key: "attempts", label: "Mental Ability Tests", icon: Clock3, color: "text-blue-500", bg: "bg-blue-500/10" },
];

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value || 0);
}

function formatDuration(value) {
  if (!value) return "0 ms";
  return `${formatNumber(value, 1)} ms`;
}

function formatDate(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return isoString;
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "users" | "architecture"
  const [days, setDays] = useState("all");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // User directory table state
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [assessmentFilter, setAssessmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/overview?days=${days}`);
      const payload = await response.json();
      if (response.status === 403) {
        setError(
          `Admin access denied. Session email: ${session?.user?.email || "none"}. Configured admin emails: ${payload.diagnostics?.configuredAdminCount ?? 0}.`,
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
  }, [days, session]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated") load();
  }, [status, router, load]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((u) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.targetRole?.toLowerCase().includes(q) ||
        u.college?.toLowerCase().includes(q);

      // Provider filter
      const matchesProvider =
        providerFilter === "all" ||
        u.authProvider?.toLowerCase() === providerFilter.toLowerCase();

      // Assessment filter
      const matchesAssessment =
        assessmentFilter === "all" ||
        (assessmentFilter === "completed" && u.hasAssessment) ||
        (assessmentFilter === "pending" && !u.hasAssessment);

      return matchesSearch && matchesProvider && matchesAssessment;
    });
  }, [data?.users, searchQuery, providerFilter, assessmentFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, providerFilter, assessmentFilter]);

  // Registration chart data (ensure single-point data still renders nicely)
  const chartData = useMemo(() => {
    const daily = data?.dailyUsers || [];
    if (daily.length === 1) {
      // Pad single point with a 0 point so area chart draws correctly
      return [
        { date: daily[0].date, count: daily[0].count },
        { date: daily[0].date + " ", count: daily[0].count },
      ];
    }
    return daily;
  }, [data?.dailyUsers]);

  // CSV Export handler
  const handleExportCSV = () => {
    if (!data?.users || data.users.length === 0) return;
    const headers = [
      "ID",
      "Name",
      "Email",
      "Auth Provider",
      "GitHub Connected",
      "Target Role",
      "College",
      "Degree",
      "Employability Index (%)",
      "Aptitude Score",
      "Skills Count",
      "Joined Date",
    ];

    const rows = filteredUsers.map((u) => [
      `"${u.id}"`,
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      `"${u.authProvider || ""}"`,
      u.githubConnected ? "Yes" : "No",
      `"${(u.targetRole || "Not specified").replace(/"/g, '""')}"`,
      `"${(u.college || "—").replace(/"/g, '""')}"`,
      `"${(u.degree || "—").replace(/"/g, '""')}"`,
      u.employabilityIndex != null ? u.employabilityIndex : "N/A",
      u.aptitudeScore != null ? u.aptitudeScore : "N/A",
      u.skillsCount || 0,
      `"${u.joinedAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `skillvista-users-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === "loading" || (loading && !data)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <RefreshCw className="size-6 animate-spin text-primary" />
        <span>Loading SkillVista Admin Console...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" /> SkillVista Admin Console
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                Production Live
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Platform Operations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time candidate telemetry, cloud infrastructure health, and platform analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm transition hover:border-primary/50 focus:outline-none"
            >
              <option value="all">All time</option>
              <option value="180">Last 6 months</option>
              <option value="90">Last 90 days</option>
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
            </select>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition hover:bg-muted active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin text-primary" : ""}`} />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <p className="font-semibold">Access Alert</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="flex space-x-2 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-4" /> Overview &amp; Cloud Health
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            <Users className="size-4" /> User Directory
            {data?.users && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {data.users.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "architecture"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            <Layers className="size-4" /> Cloud Architecture &amp; Security
          </button>
        </nav>

        {/* TAB 1: OVERVIEW & CLOUD HEALTH */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map((item) => {
                const Icon = item.icon;
                const val = data?.metrics?.[item.key] ?? 0;
                return (
                  <div
                    key={item.key}
                    className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                      <div className={`rounded-xl p-2.5 ${item.bg}`}>
                        <Icon className={`size-5 ${item.color}`} />
                      </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold tracking-tight">{formatNumber(val)}</p>
                  </div>
                );
              })}
            </section>

            {/* Cloud Services Status Monitor */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Server className="size-5 text-primary" /> Live Cloud Services Monitor
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Connected AWS services, database clusters, and AI model health
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Continuous Health Check
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(data?.services || []).map((srv) => {
                  const isHealthy = srv.status === "healthy" || srv.status === "connected";
                  const isCostSaved = srv.status === "cost_optimized";

                  let badgeClass = "bg-amber-500/10 text-amber-500";
                  let dotClass = "bg-amber-500";
                  let statusText = "Fallback";

                  if (isHealthy) {
                    badgeClass = "bg-emerald-500/10 text-emerald-500";
                    dotClass = "bg-emerald-500";
                    statusText = "Operational";
                  } else if (isCostSaved) {
                    badgeClass = "bg-cyan-500/10 text-cyan-500";
                    dotClass = "bg-cyan-500";
                    statusText = "Paused ($0/mo)";
                  }

                  return (
                    <div
                      key={srv.id}
                      className="flex flex-col justify-between rounded-xl border border-border/70 bg-muted/30 p-4 transition hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{srv.name}</p>
                          <span className="text-xs text-muted-foreground">{srv.type}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}
                        >
                          <span className={`size-1.5 rounded-full ${dotClass}`} />
                          {statusText}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate pr-2">{srv.details}</span>
                        {srv.latencyMs != null && (
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">
                            {srv.latencyMs}ms
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Platform Analytics & Diagnostic Gaps */}
            <section className="grid gap-6 lg:grid-cols-3">
              {/* Average Readiness Index */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Employability Readiness</h3>
                    <p className="text-xs text-muted-foreground">Platform-wide candidate average</p>
                  </div>
                  <Sparkles className="size-5 text-amber-500" />
                </div>
                <div className="my-6 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-primary">
                    {data?.analytics?.avgEmployability ?? "—"}%
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Index across {data?.analytics?.totalEvaluated || 0} evaluated candidates
                  </span>
                </div>
                <div className="space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Average Aptitude Diagnostic:</span>
                    <span className="font-semibold text-foreground">
                      {data?.analytics?.avgAptitude ?? "—"} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Target Roles Mapped:</span>
                    <span className="font-semibold text-foreground">
                      {data?.analytics?.topRoles?.length || 0} unique domains
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Target Roles */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Top Target Roles</h3>
                    <p className="text-xs text-muted-foreground">Candidate career aspirations</p>
                  </div>
                  <Briefcase className="size-5 text-cyan-500" />
                </div>
                <div className="mt-4 space-y-3">
                  {(!data?.analytics?.topRoles || data.analytics.topRoles.length === 0) ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">No roles recorded yet</p>
                  ) : (
                    data.analytics.topRoles.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="truncate pr-2">{item.role}</span>
                          <span className="font-semibold text-primary">{item.count}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-cyan-500"
                            style={{
                              width: `${Math.min(100, (item.count / Math.max(1, data.metrics.assessments)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Critical Skill Gaps */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Top Critical Skill Gaps</h3>
                    <p className="text-xs text-muted-foreground">Most flagged learning deficiencies</p>
                  </div>
                  <GraduationCap className="size-5 text-rose-500" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(!data?.analytics?.topSkillGaps || data.analytics.topSkillGaps.length === 0) ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">No skill gap data recorded</p>
                  ) : (
                    data.analytics.topSkillGaps.map((gap, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
                      >
                        {gap.skill}
                        <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold">
                          {gap.count}
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Growth Chart & Auth Breakdown */}
            <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">User Registrations</h2>
                    <p className="text-sm text-muted-foreground">Candidate onboarding velocity over time</p>
                  </div>
                  <BarChart3 className="size-5 text-muted-foreground" />
                </div>

                {chartData.length === 0 ? (
                  <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center">
                    <Users className="size-8 text-muted-foreground/50" />
                    <p className="font-semibold text-foreground">No registrations in this time period</p>
                    <p className="text-xs text-muted-foreground">Switch to &apos;All time&apos; to view existing registrations</p>
                    {days !== "all" && (
                      <button
                        onClick={() => setDays("all")}
                        className="mt-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                      >
                        View All Time Registrations
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(val) => val.trim().slice(5)} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#06b6d4"
                          fill="url(#usersGradient)"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#06b6d4" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-bold">Authentication Providers</h2>
                <p className="mb-6 text-sm text-muted-foreground">Sign-in breakdown across candidates</p>
                <div className="space-y-4">
                  {(data?.providers || []).map((provider) => {
                    const total = data?.metrics?.totalUsers || 1;
                    const pct = Math.round((provider.count / total) * 100);
                    return (
                      <div key={provider.name} className="rounded-xl border border-border/60 bg-muted/40 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{provider.name}</span>
                          <span className="font-bold">{provider.count} ({pct}%)</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* CloudWatch Telemetry */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2.5">
                  <Activity className="size-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="font-bold">AWS CloudWatch Serverless Telemetry</h2>
                  <p className="text-sm text-muted-foreground">
                    Live compute traffic, latency, and error tracking from CloudWatch (Namespace: AWS/AmplifyHosting)
                  </p>
                </div>
              </div>

              {!data?.cloudWatch?.configured ? (
                <p className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                  CloudWatch telemetry is awaiting read IAM permissions on AWS.
                </p>
              ) : data.cloudWatch.error ? (
                <p className="rounded-xl bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
                  {data.cloudWatch.error}
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Requests</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatNumber(data.cloudWatch.summary?.requests || data.cloudWatch.summary?.invocations)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Amplify Hosting HTTP requests</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">CDN Bandwidth</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatNumber((data.cloudWatch.summary?.bytesDownloaded || 0) / (1024 * 1024), 1)} MB
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Data served to candidates</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Average Latency</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatDuration(data.cloudWatch.summary?.averageLatency || data.cloudWatch.summary?.averageDuration)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Amplify response speed</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Error Rate</p>
                    <p className="mt-2 text-2xl font-bold text-rose-500">
                      {formatNumber(data.cloudWatch.summary?.errorRate, 2)}%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatNumber(data.cloudWatch.summary?.errors5xx)} (5xx) • {formatNumber(data.cloudWatch.summary?.errors4xx)} (4xx)
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY & CSV EXPORT */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Candidate Directory</h2>
                <p className="text-sm text-muted-foreground">
                  Browse, search, and export registered students and their diagnostic results
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95"
              >
                <Download className="size-4" />
                Export CSV ({filteredUsers.length})
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search candidate name, email, target role, or college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                  <Filter className="size-3.5" />
                  <span>Provider:</span>
                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="bg-transparent font-medium text-foreground focus:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="credentials">Credentials</option>
                    <option value="google">Google</option>
                    <option value="github">GitHub</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                  <span>Status:</span>
                  <select
                    value={assessmentFilter}
                    onChange={(e) => setAssessmentFilter(e.target.value)}
                    className="bg-transparent font-medium text-foreground focus:outline-none"
                  >
                    <option value="all">All Candidates</option>
                    <option value="completed">Assessed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-4 py-3.5">Auth</th>
                      <th className="px-4 py-3.5">Education / College</th>
                      <th className="px-4 py-3.5">Target Role</th>
                      <th className="px-4 py-3.5">Readiness Index</th>
                      <th className="px-4 py-3.5">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                          No candidates found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u) => {
                        const score = u.employabilityIndex;
                        let scoreBadgeClass = "bg-muted text-muted-foreground";
                        if (score != null) {
                          if (score >= 75) scoreBadgeClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                          else if (score >= 50) scoreBadgeClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold";
                          else scoreBadgeClass = "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold";
                        }

                        return (
                          <tr key={u.id} className="transition hover:bg-muted/30">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                  {(u.name?.[0] || u.email?.[0] || "U").toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-foreground">{u.name || "Anonymous"}</p>
                                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize">
                                {u.authProvider === "github" && <Github className="size-3" />}
                                {u.authProvider}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <p className="truncate text-xs font-medium text-foreground">{u.college || "—"}</p>
                              <p className="truncate text-[11px] text-muted-foreground">{u.degree || ""}</p>
                            </td>
                            <td className="px-4 py-4">
                              {u.targetRole ? (
                                <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                                  {u.targetRole}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {score != null ? (
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${scoreBadgeClass}`}>
                                  {score}% Index
                                </span>
                              ) : (
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                  Pending Diagnostic
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-xs text-muted-foreground">
                              {formatDate(u.joinedAt)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5 text-xs text-muted-foreground">
                <span>
                  Showing {Math.min(filteredUsers.length, (currentPage - 1) * pageSize + 1)} to{" "}
                  {Math.min(filteredUsers.length, currentPage * pageSize)} of {filteredUsers.length} candidates
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 font-medium hover:bg-muted disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5" /> Previous
                  </button>
                  <span className="font-semibold text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 font-medium hover:bg-muted disabled:opacity-40"
                  >
                    Next <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLOUD ARCHITECTURE & SECURITY */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Cloud Infrastructure &amp; Security Architecture</h2>
              <p className="text-sm text-muted-foreground">
                Overview of AWS cloud services and AI integrations powering SkillVista
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Server className="size-5 text-amber-500" />
                  <span>AWS Amplify Hosting</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Continuous integration and serverless Next.js 16 deployment running on AWS Lambda SSR compute in region <code>ap-south-1</code> (Mumbai).
                </p>
                <div className="mt-4 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground">
                  App ID: durajg8e4lg0n
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Lock className="size-5 text-emerald-500" />
                  <span>AWS Secrets Manager</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Hardware-encrypted (KMS) secret storage holding database credentials, OAuth client secrets, and Gemini keys with automatic SDK caching.
                </p>
                <div className="mt-4 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground">
                  Secret: skillvista/app-secrets
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <ShieldCheck className="size-5 text-rose-500" />
                  <span>AWS WAF Shield</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Edge layer defense on CloudFront. Enforces 2,000 req/5min rate limiting per IP, AWS Managed Common Rule Set, and protection against SQLi &amp; XSS.
                </p>
                <div className="mt-4 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground">
                  Status: Active on CloudFront
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Database className="size-5 text-cyan-500" />
                  <span>AWS S3 Object Storage</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Encrypted resume vault for candidate PDF, DOCX, and TXT uploads with signed URLs and automated lifecycle rules.
                </p>
                <div className="mt-4 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground">
                  Bucket: skillvista-resumes-storage
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Mail className="size-5 text-indigo-500" />
                  <span>AWS SES Transactional Email</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  High-deliverability email service delivering verified password reset links, Career Match reports, and diagnostic score summaries.
                </p>
                <div className="mt-4 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground">
                  Sender: vishujain.cse@gmail.com
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Cpu className="size-5 text-violet-500" />
                  <span>Google Gemini 1.5 Flash AI</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Multi-modal LLM powering Career Match evaluations, resume text parsing, and personalized skill gap action plans with backoff retry resilience.
                </p>
                <div className="mt-4 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground">
                  Engine: gemini-1.5-flash
                </div>
              </div>
            </div>

            {/* Admin Security Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm">
              <h3 className="flex items-center gap-2 font-bold text-primary">
                <ShieldAlert className="size-4" /> Role-Based Access Control (RBAC)
              </h3>
              <p className="mt-2 text-muted-foreground">
                Admin routes are safeguarded by <code>ADMIN_EMAILS</code> authorization checks. Unauthorized requests automatically receive 403 Forbidden with diagnostic logging to CloudWatch.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
                <div>
                  <span className="text-muted-foreground">Active Admin: </span>
                  <span className="font-mono text-foreground">{session?.user?.email || "Authenticated Admin"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Region: </span>
                  <span className="font-mono text-foreground">ap-south-1 (Mumbai)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

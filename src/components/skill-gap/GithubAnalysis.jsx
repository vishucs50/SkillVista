"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ExternalLink,
  GitBranch,
  Github,
  RefreshCw,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatNumber = (value) => new Intl.NumberFormat("en", {
  notation: value > 999 ? "compact" : "standard",
  maximumFractionDigits: 1,
}).format(value || 0);

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon size={15} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function ContributionLevel({ level }) {
  const config = {
    high: { value: 90, label: "High activity", color: "bg-emerald-500" },
    medium: { value: 55, label: "Growing activity", color: "bg-amber-400" },
    low: { value: 25, label: "Early activity", color: "bg-rose-400" },
  };
  const current = config[level] || config.low;

  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Recent activity</span>
        <span className="text-xs font-semibold">{current.label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div className={`h-full rounded-full ${current.color}`} style={{ width: `${current.value}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Based on repositories updated in the last six months
      </p>
    </div>
  );
}

function RepositoryCard({ repository }) {
  return (
    <a
      href={repository.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-border/70 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate font-semibold group-hover:text-primary">{repository.name}</h4>
          <p className="mt-1 line-clamp-2 min-h-10 text-xs text-muted-foreground">
            {repository.description || "No repository description"}
          </p>
        </div>
        <ExternalLink size={15} className="shrink-0 text-muted-foreground" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {repository.language && <span className="font-medium text-foreground">{repository.language}</span>}
        <span className="flex items-center gap-1"><Star size={13} />{formatNumber(repository.stars)}</span>
        <span className="flex items-center gap-1"><GitBranch size={13} />{formatNumber(repository.forks)}</span>
      </div>
    </a>
  );
}

export default function GitHubAnalysis({
  data,
  comparison = [],
  onRefresh,
  isRefreshing = false,
  compact = false,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [query, setQuery] = useState("");
  const languageStats = data?.languageStats?.length
    ? data.languageStats
    : (data?.topLanguages || []).map((name, index, languages) => ({
        name,
        repositories: 1,
        percentage: Math.round(100 / languages.length) || (index === 0 ? 100 : 0),
      }));
  const filteredRepositories = useMemo(
    () => (data?.repositoryList || []).filter((repository) =>
      `${repository.name} ${repository.description || ""} ${repository.language || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
    [data?.repositoryList, query],
  );
  if (!data) return null;

  const missingSkills = comparison.filter((item) => item.userHas === false).slice(0, 4);
  const profileUrl = data.profileUrl || (data.username ? `https://github.com/${data.username}` : null);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="sea-green-gradient p-6 text-white">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt="" className="size-16 rounded-2xl border-2 border-white/30 object-cover" />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15"><Github size={30} /></div>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/70">GitHub profile</p>
                <h2 className="mt-1 text-2xl font-bold">{data.username ? `@${data.username}` : "Developer profile"}</h2>
                <p className="mt-1 max-w-xl text-sm text-white/80">{data.bio || "Your code activity, skills, and project evidence in one place."}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileUrl && <Button asChild variant="secondary" size="sm"><a href={profileUrl} target="_blank" rel="noopener noreferrer">View profile <ExternalLink size={14} /></a></Button>}
              {onRefresh && <Button onClick={onRefresh} disabled={isRefreshing} variant="secondary" size="sm"><RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Refresh</Button>}
            </div>
          </div>
        </div>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat icon={GitBranch} label="Repositories" value={formatNumber(data.repositories)} />
          <Stat icon={Users} label="Followers" value={formatNumber(data.followers)} />
          <Stat icon={Star} label="Total stars" value={formatNumber(data.totalStars)} />
          <Stat icon={Activity} label="Active projects" value={formatNumber(data.activeRepositories ?? data.contributions)} />
          <ContributionLevel level={data.contributionLevel} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>GitHub evidence</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Explore the skills and projects behind your profile.</p>
          </div>
          <div className="flex rounded-lg bg-muted p-1">
            {["overview", "repositories"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "overview" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Language focus</h3>
                  <span className="text-xs text-muted-foreground">by repositories</span>
                </div>
                <div className="space-y-4">
                  {languageStats.slice(0, 6).map((language, index) => (
                    <motion.div key={language.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-muted-foreground">{language.percentage}% · {language.repositories} {language.repositories === 1 ? "repo" : "repos"}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="sea-green-gradient h-2 rounded-full" style={{ width: `${Math.max(language.percentage, 3)}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold">Detected strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {(data.strengthAreas || []).map((area) => <Badge key={area} variant="secondary" className="px-3 py-1.5">{area}</Badge>)}
                </div>
                {missingSkills.length > 0 && (
                  <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                    <p className="text-sm font-semibold">Good next opportunities</p>
                    <p className="mt-1 text-xs text-muted-foreground">These role skills are not yet represented in your GitHub evidence.</p>
                    <div className="mt-3 flex flex-wrap gap-2">{missingSkills.map((item) => <Badge key={item.skill} variant="outline">{item.skill}</Badge>)}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="relative mb-4 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search repositories..." className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring" />
                {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X size={15} /></button>}
              </div>
              {filteredRepositories.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filteredRepositories.map((repository) => <RepositoryCard key={repository.name} repository={repository} />)}</div>
              ) : (
                <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No repositories match your search.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

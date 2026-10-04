import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Language to skill category mapping
const LANGUAGE_SKILLS = {
  JavaScript: { name: "JavaScript", category: "frontend" },
  TypeScript: { name: "TypeScript", category: "frontend" },
  Python: { name: "Python", category: "backend" },
  Java: { name: "Java", category: "backend" },
  "C++": { name: "C++", category: "backend" },
  "C#": { name: "C#", category: "backend" },
  Go: { name: "Go", category: "backend" },
  Rust: { name: "Rust", category: "backend" },
  PHP: { name: "PHP", category: "backend" },
  Ruby: { name: "Ruby", category: "backend" },
  CSS: { name: "CSS", category: "frontend" },
  HTML: { name: "HTML", category: "frontend" },
  SQL: { name: "SQL", category: "tools" },
  Shell: { name: "Shell/Bash", category: "tools" },
};

// Framework detection patterns
const FRAMEWORK_PATTERNS = {
  React: /react|jsx/i,
  Vue: /vue/i,
  Angular: /angular/i,
  Express: /express/i,
  Flask: /flask/i,
  Django: /django/i,
  Spring: /spring/i,
  FastAPI: /fastapi/i,
  Next: /next\.js|nextjs|next/i,
  Svelte: /svelte/i,
  NestJS: /nestjs/i,
  Rails: /rails/i,
  Laravel: /laravel/i,
  Node: /node\.js|nodejs/i,
  Docker: /docker/i,
  Kubernetes: /kubernetes|k8s/i,
  AWS: /aws|amazon/i,
  GCP: /gcp|google cloud/i,
  MongoDB: /mongodb|mongo/i,
  PostgreSQL: /postgresql|postgres/i,
  MySQL: /mysql/i,
  Redis: /redis/i,
  GraphQL: /graphql/i,
  REST: /rest|restful/i,
  Git: /git/i,
};

export async function fetchGitHubData(username, accessToken) {
  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${accessToken}`,
    };

    // Fetch user info
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    if (!userRes.ok)
      throw new Error(`Failed to fetch user: ${userRes.statusText}`);

    const userInfo = await userRes.json();

    // Fetch all repositories (paginated)
    let allRepos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=100&sort=updated`,
        { headers }
      );

      if (!reposRes.ok) {
        hasMore = false;
        break;
      }

      const repos = await reposRes.json();
      if (repos.length === 0) {
        hasMore = false;
      } else {
        allRepos = [...allRepos, ...repos];
        page++;
      }
    }

    return {
      username,
      avatarUrl: userInfo.avatar_url,
      profileUrl: userInfo.html_url,
      followers: userInfo.followers,
      publicRepos: userInfo.public_repos,
      bio: userInfo.bio,
      company: userInfo.company,
      location: userInfo.location,
      repositories: allRepos,
    };
  } catch (err) {
    console.error("Failed to fetch GitHub data:", err);
    throw new Error("Failed to fetch GitHub profile");
  }
}

export async function analyzeGitHubProfile(userId, accessToken) {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user || !user.githubUsername) {
      console.error("User or GitHub username not found");
      return null;
    }

    // Fetch GitHub data
    const githubData = await fetchGitHubData(user.githubUsername, accessToken);

    // Analyze languages and frameworks
    const languages = new Set();
    const frameworks = new Set();
    const languageCounts = {};

    githubData.repositories.forEach((repo) => {
      if (repo.language) {
        languages.add(repo.language);
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }

      // Detect frameworks from repo content
      const description = `${repo.name} ${repo.description || ""}`.toLowerCase();
      Object.entries(FRAMEWORK_PATTERNS).forEach(([framework, pattern]) => {
        if (pattern.test(description)) {
          frameworks.add(framework);
        }
      });
    });

    const languageStats = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, repositories]) => ({
        name,
        repositories,
        percentage: Math.round((repositories / Math.max(githubData.repositories.length, 1)) * 100),
      }));

    const topLanguages = languageStats
      .slice(0, 5)
      .map(({ name }) => name);

    const totalRepositories = githubData.repositories.length;
    const activeRepositories = githubData.repositories.filter((repo) => {
      const updatedAt = new Date(repo.updated_at);
      return !Number.isNaN(updatedAt.getTime()) &&
        Date.now() - updatedAt.getTime() <= 180 * 24 * 60 * 60 * 1000;
    }).length;
    const avgStars =
      githubData.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) /
      Math.max(totalRepositories, 1);

    let contributionLevel = "low";
    if (activeRepositories >= 5) {
      contributionLevel = "high";
    } else if (activeRepositories >= 2) {
      contributionLevel = "medium";
    }

    // Identify strength areas from frameworks and languages
    const strengthAreas = [];
    topLanguages.forEach((lang) => {
      if (LANGUAGE_SKILLS[lang]) {
        strengthAreas.push(`${lang} Development`);
      }
    });
    [...frameworks].slice(0, 5).forEach((fw) => {
      strengthAreas.push(`${fw} Framework`);
    });

    const analyzedData = {
      username: githubData.username,
      avatarUrl: githubData.avatarUrl,
      bio: githubData.bio,
      profileUrl: githubData.profileUrl,
      topLanguages: topLanguages.length > 0 ? topLanguages : Array.from(languages).slice(0, 5),
      languageStats,
      detectedFrameworks: Array.from(frameworks).slice(0, 8),
      repositories: totalRepositories,
      repositoryList: githubData.repositories
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 24)
        .map((repo) => ({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
          topics: repo.topics || [],
        })),
      totalStars: githubData.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: githubData.repositories.reduce((sum, repo) => sum + repo.forks_count, 0),
      activeRepositories,
      followers: githubData.followers,
      contributions: activeRepositories,
      contributionLevel,
      strengthAreas: strengthAreas.slice(0, 8),
      fetchedAt: new Date(),
    };

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { githubData: analyzedData },
      { new: true }
    );

    return analyzedData;
  } catch (err) {
    console.error("GitHub profile analysis failed:", err);
    return null;
  }
}

export async function getGitHubSkills(githubData) {
  const skills = [];

  if (githubData?.topLanguages) {
    githubData.topLanguages.forEach((lang) => {
      if (LANGUAGE_SKILLS[lang]) {
        skills.push({
          name: lang,
          category: LANGUAGE_SKILLS[lang].category,
          source: "github",
        });
      }
    });
  }

  if (githubData?.detectedFrameworks) {
    githubData.detectedFrameworks.forEach((fw) => {
      skills.push({
        name: fw,
        category: "tools",
        source: "github",
      });
    });
  }

  return skills;
}

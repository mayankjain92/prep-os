import { redis } from "../lib/redisClient.js";

const CACHE_TTL_SECONDS = 3600; // 1 hour

export interface LeetCodeSolvedProblem {
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "solved";
  url: string;
}

export interface LeetCodeProfileStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  userAvatar?: string;
}

export interface LeetCodeUserDataResult {
  profile: LeetCodeProfileStats;
  solvedProblems: LeetCodeSolvedProblem[];
}

async function fetchFromExternalLeetCode(username: string): Promise<LeetCodeUserDataResult> {
  let profileStats: LeetCodeProfileStats = {
    username,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
  };
  let solvedProblems: LeetCodeSolvedProblem[] = [];

  try {
    const query = `
      query userFullProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            realName
            userAvatar
            ranking
          }
        }
        recentAcSubmissionList(username: $username, limit: 100) {
          title
          titleSlug
        }
      }
    `;
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://leetcode.com",
        "Origin": "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data?.data?.matchedUser;
      if (user) {
        profileStats.ranking = user.profile?.ranking || 0;
        profileStats.userAvatar = user.profile?.userAvatar || "";
        const acStats = user.submitStats?.acSubmissionNum || [];
        for (const stat of acStats) {
          if (stat.difficulty === "All") profileStats.totalSolved = stat.count;
          if (stat.difficulty === "Easy") profileStats.easySolved = stat.count;
          if (stat.difficulty === "Medium") profileStats.mediumSolved = stat.count;
          if (stat.difficulty === "Hard") profileStats.hardSolved = stat.count;
        }
      }

      const submissions = data?.data?.recentAcSubmissionList || [];
      if (Array.isArray(submissions) && submissions.length > 0) {
        const seen = new Set<string>();
        for (const s of submissions) {
          if (!seen.has(s.titleSlug)) {
            seen.add(s.titleSlug);
            solvedProblems.push({
              title: s.title,
              titleSlug: s.titleSlug,
              difficulty: "Medium",
              status: "solved",
              url: `https://leetcode.com/problems/${s.titleSlug}/`,
            });
          }
        }
      }
    }
  } catch (err: any) {
    console.warn("[leetcodeService] Direct LeetCode GraphQL fetch failed:", err.message);
  }

  // Fallback to Alfa LeetCode API if totalSolved is still 0
  if (profileStats.totalSolved === 0) {
    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.totalSolved === "number") {
          profileStats.totalSolved = data.totalSolved;
          profileStats.easySolved = data.easySolved || 0;
          profileStats.mediumSolved = data.mediumSolved || 0;
          profileStats.hardSolved = data.hardSolved || 0;
          profileStats.ranking = data.ranking || 0;
        }
        if (solvedProblems.length === 0 && Array.isArray(data?.recentSubmissions)) {
          const seen = new Set<string>();
          for (const sub of data.recentSubmissions) {
            if (sub.statusDisplay === "Accepted" && sub.titleSlug && !seen.has(sub.titleSlug)) {
              seen.add(sub.titleSlug);
              solvedProblems.push({
                title: sub.title || sub.titleSlug,
                titleSlug: sub.titleSlug,
                difficulty: "Medium",
                status: "solved",
                url: `https://leetcode.com/problems/${sub.titleSlug}/`,
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.warn("[leetcodeService] Alfa solved stats fallback failed:", err.message);
    }
  }

  return { profile: profileStats, solvedProblems };
}

export async function getLeetCodeUserData(userId: string, username: string = "demo"): Promise<LeetCodeUserDataResult> {
  const cacheKey = `leetcode:${userId}:${username}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[cache hit] ${cacheKey}`);
      return JSON.parse(cached);
    }
  } catch (err: any) {
    console.warn(`[cache warn] Redis read failed for ${cacheKey}:`, err.message);
  }

  console.log(`[cache miss] Fetching LeetCode profile stats for user ${username}...`);
  const freshData = await fetchFromExternalLeetCode(username);

  try {
    await redis.set(cacheKey, JSON.stringify(freshData), "EX", CACHE_TTL_SECONDS);
  } catch (err: any) {
    console.warn(`[cache warn] Redis write failed for ${cacheKey}:`, err.message);
  }

  return freshData;
}

export async function invalidateLeetCodeCache(userId: string, username: string = "demo"): Promise<void> {
  const cacheKey = `leetcode:${userId}:${username}`;
  try {
    await redis.del(cacheKey);
    console.log(`[cache invalidate] Deleted ${cacheKey}`);
  } catch (err: any) {
    console.warn(`[cache warn] Invalidation failed for ${cacheKey}:`, err.message);
  }
}

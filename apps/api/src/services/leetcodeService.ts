import { redis } from "../lib/redisClient.js";

const CACHE_TTL_SECONDS = 3600; // 1 hour

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
  fromCache?: boolean;
}

async function fetchFromExternalLeetCode(
  username: string,
): Promise<LeetCodeUserDataResult> {
  let profileStats: LeetCodeProfileStats = {
    username,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
  };

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
      }
    `;
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://leetcode.com",
        Origin: "https://leetcode.com",
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
          if (stat.difficulty === "Medium")
            profileStats.mediumSolved = stat.count;
          if (stat.difficulty === "Hard") profileStats.hardSolved = stat.count;
        }
      }
    }
  } catch (err: any) {
    console.warn(
      "[leetcodeService] Direct LeetCode GraphQL fetch failed:",
      err.message,
    );
  }

  // Fallback to Alfa LeetCode API if totalSolved is still 0
  if (profileStats.totalSolved === 0) {
    try {
      const res = await fetch(
        `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.totalSolved === "number") {
          profileStats.totalSolved = data.totalSolved;
          profileStats.easySolved = data.easySolved || 0;
          profileStats.mediumSolved = data.mediumSolved || 0;
          profileStats.hardSolved = data.hardSolved || 0;
          profileStats.ranking = data.ranking || 0;
        }
      }
    } catch (err: any) {
      console.warn(
        "[leetcodeService] Alfa solved stats fallback failed:",
        err.message,
      );
    }
  }

  return { profile: profileStats };
}

export async function getLeetCodeUserData(
  userId: string,
  username: string = "demo",
): Promise<LeetCodeUserDataResult> {
  const cacheKey = `leetcode:${userId}:${username}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[cache hit] ${cacheKey}`);
      const parsed = JSON.parse(cached);
      return { ...parsed, fromCache: true };
    }
  } catch (err: any) {
    console.warn(
      `[cache warn] Redis read failed for ${cacheKey}:`,
      err.message,
    );
  }

  console.log(
    `[cache miss] Fetching LeetCode profile stats for user ${username}...`,
  );
  const freshData = await fetchFromExternalLeetCode(username);

  try {
    await redis.set(
      cacheKey,
      JSON.stringify(freshData),
      "EX",
      CACHE_TTL_SECONDS,
    );
  } catch (err: any) {
    console.warn(
      `[cache warn] Redis write failed for ${cacheKey}:`,
      err.message,
    );
  }

  return { ...freshData, fromCache: false };
}

export async function invalidateLeetCodeCache(
  userId: string,
  username: string = "demo",
): Promise<void> {
  const cacheKey = `leetcode:${userId}:${username}`;
  try {
    await redis.del(cacheKey);
    console.log(`[cache invalidate] Deleted ${cacheKey}`);
  } catch (err: any) {
    console.warn(
      `[cache warn] Invalidation failed for ${cacheKey}:`,
      err.message,
    );
  }
}

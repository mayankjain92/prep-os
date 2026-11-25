import { redis } from "../config/redisClient.js";
import { User } from "../models/User.js";

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
  profile: LeetCodeProfileStats | null;
  fromCache?: boolean;
}

async function fetchFromExternalLeetCode(
  username: string,
): Promise<LeetCodeUserDataResult> {
  const profileStats: LeetCodeProfileStats = {
    username,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
  };
  let fetched = false;

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
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data?.data?.matchedUser;
      if (user) {
        fetched = true;
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

  // Fallback to Alfa LeetCode API if primary GraphQL did not return a user
  if (!fetched) {
    try {
      const res = await fetch(
        `https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(username)}`,
        { signal: AbortSignal.timeout(6000) },
      );
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.totalSolved === "number") {
          fetched = true;
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

  return { profile: fetched ? profileStats : null };
}

export async function getLeetCodeUserData(
  userId: string,
  username: string,
): Promise<LeetCodeUserDataResult> {
  if (!username) {
    return { profile: null };
  }
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

  if (freshData.profile) {
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
  }

  return { ...freshData, fromCache: false };
}

export async function invalidateLeetCodeCache(
  userId: string,
  username: string,
): Promise<void> {
  if (!username) return;
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

export async function syncUserLeetCodeProfile(
  userId: string,
  username?: string,
  force: boolean = false,
): Promise<{ profile: LeetCodeProfileStats; synced: boolean; error?: string }> {
  try {
    const user = await User.findById(userId);
    const targetUsername = username?.trim() || user?.leetcodeProfile?.username;
    if (!targetUsername) {
      return {
        profile: user?.leetcodeProfile || {
          username: "",
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          ranking: 0,
        },
        synced: false,
        error: "No LeetCode username provided or linked to profile.",
      };
    }

    if (force) {
      await invalidateLeetCodeCache(userId, targetUsername);
    }

    const dataResult = await getLeetCodeUserData(userId, targetUsername);

    if (dataResult?.profile) {
      await User.findByIdAndUpdate(userId, {
        leetcodeProfile: {
          ...dataResult.profile,
          syncedAt: new Date(),
        },
      });
      return {
        profile: dataResult.profile,
        synced: true,
      };
    }

    return {
      profile: user?.leetcodeProfile || {
        username: targetUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        ranking: 0,
      },
      synced: false,
      error: "Could not fetch LeetCode profile. Please check the username.",
    };
  } catch (err: any) {
    console.warn(`[syncUserLeetCodeProfile] Sync failed:`, err.message);
    const user = await User.findById(userId);
    return {
      profile: user?.leetcodeProfile || {
        username: "",
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        ranking: 0,
      },
      synced: false,
      error: err.message,
    };
  }
}


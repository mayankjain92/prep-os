"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import type { LoginInput, RegisterInput } from "@prep-os/shared";
import posthog from "posthog-js";

export interface UserStats {
  dsaSolved: number;
  theoryCompleted: number;
  projectsTotal: number;
  projectsCompleted: number;
}

export interface LeetCodeProfile {
  username?: string;
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  ranking?: number;
  userAvatar?: string;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  authProvider?: string;
  avatarUrl?: string;
  leetcodeProfile?: LeetCodeProfile;
  neetcodeProgress?: {
    solved: string[];
    starred: string[];
  };
  loginDates?: string[];
  currentStreak?: number;
  longestStreak?: number;
  lastLoginDate?: string;
  createdAt?: string;
  stats?: UserStats;
}

export interface OAuthInput {
  credential: string;
  provider?: "google";
}

interface AuthContextType {
  user: User | null;
  token?: string | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (credentials: RegisterInput) => Promise<void>;
  oauthLogin: (providerData: OAuthInput) => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveNeetcodeProgress: (solved: string[], starred: string[]) => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const data = await apiFetch<{ user: User }>("/api/auth/profile");
      if (data?.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const data = await apiFetch<{ user: User }>("/api/auth/profile");
        if (isMounted && data?.user) {
          setUser(data.user);
          if (data.user.id) {
            posthog.identify(data.user.id, { username: data.user.username });
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginInput) => {
    const data = await apiFetch<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    setUser(data.user);
    if (data.user.id) {
      posthog.identify(data.user.id, { username: data.user.username });
    }
    posthog.capture("user_logged_in", { login_method: "email" });
    router.push("/dashboard");
  };

  const register = async (credentials: RegisterInput) => {
    const data = await apiFetch<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    setUser(data.user);
    if (data.user.id) {
      posthog.identify(data.user.id, { username: data.user.username });
    }
    posthog.capture("user_registered");
    router.push("/dashboard");
  };

  const oauthLogin = async (providerData: OAuthInput) => {
    const data = await apiFetch<{ user: User }>("/api/auth/oauth", {
      method: "POST",
      body: JSON.stringify(providerData),
    });

    setUser(data.user);
    if (data.user.id) {
      posthog.identify(data.user.id, { username: data.user.username });
    }
    posthog.capture("user_oauth_logged_in", { provider: providerData.provider });
    router.push("/dashboard");
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const saveNeetcodeProgress = async (solved: string[], starred: string[]) => {
    try {
      const data = await apiFetch<{ message: string; neetcodeProgress: { solved: string[]; starred: string[] } }>(
        "/api/problems/neetcode-progress",
        {
          method: "PUT",
          body: JSON.stringify({ solved, starred }),
        }
      );

      if (data?.neetcodeProgress && user) {
        setUser({ ...user, neetcodeProgress: data.neetcodeProgress });
      }
    } catch (err) {
      console.error("Failed to save NeetCode progress to server:", err);
    }
  };

  const setUsername = async (newUsername: string) => {
    const data = await apiFetch<{ message: string; user: User }>("/api/auth/set-username", {
      method: "POST",
      body: JSON.stringify({ username: newUsername }),
    });

    if (data?.user) {
      setUser(data.user);
    }
  };

  const logout = async () => {
    posthog.capture("user_logged_out");
    posthog.reset();
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Failed to call logout endpoint:", err);
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        isLoading,
        login,
        register,
        oauthLogin,
        refreshProfile,
        saveNeetcodeProgress,
        setUsername,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

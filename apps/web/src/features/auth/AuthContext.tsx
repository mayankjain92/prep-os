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

interface OAuthInput {
  email: string;
  provider: "google" | "github";
  providerId?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (credentials: RegisterInput) => Promise<void>;
  oauthLogin: (providerData: OAuthInput) => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveNeetcodeProgress: (solved: string[], starred: string[]) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const data = await apiFetch<{ user: User }>("/api/auth/profile");
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      // eslint-disable-next-line
      setToken(savedToken);
      if (savedUser) {
        try {
          const parsed: User = JSON.parse(savedUser);
          setUser(parsed);
          posthog.identify(parsed.id, { username: parsed.username });
        } catch {
          localStorage.removeItem("user");
        }
      }
      fetchProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginInput) => {
    const data = await apiFetch<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    posthog.identify(data.user.id, { username: data.user.username });
    posthog.capture("user_logged_in", { login_method: "email" });
    fetchProfile();
    router.push("/dashboard");
  };

  const register = async (credentials: RegisterInput) => {
    const data = await apiFetch<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    posthog.identify(data.user.id, { username: data.user.username });
    posthog.capture("user_registered");
    fetchProfile();
    router.push("/dashboard");
  };

  const oauthLogin = async (providerData: OAuthInput) => {
    const data = await apiFetch<{ token: string; user: User }>("/api/auth/oauth", {
      method: "POST",
      body: JSON.stringify(providerData),
    });

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    posthog.identify(data.user.id, { username: data.user.username });
    posthog.capture("user_oauth_logged_in", { provider: providerData.provider });
    fetchProfile();
    router.push("/dashboard");
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const saveNeetcodeProgress = async (solved: string[], starred: string[]) => {
    try {
      const data = await apiFetch<{ message: string; neetcodeProgress: { solved: string[]; starred: string[] } }>(
        "/api/auth/neetcode-progress",
        {
          method: "PUT",
          body: JSON.stringify({ solved, starred }),
        }
      );

      if (data?.neetcodeProgress && user) {
        const updatedUser = { ...user, neetcodeProgress: data.neetcodeProgress };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to save NeetCode progress to server:", err);
    }
  };

  const logout = () => {
    posthog.capture("user_logged_out");
    posthog.reset();
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, oauthLogin, refreshProfile, saveNeetcodeProgress, logout }}
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

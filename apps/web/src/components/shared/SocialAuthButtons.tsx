"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 mr-2 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function SocialAuthButtons({ onError }: { onError?: (err: string) => void }) {
  const { oauthLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "526783459737-eb5t23vkogpqclauvc126sm93n7gkn4l.apps.googleusercontent.com";

    const initGoogleGSI = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential?: string }) => {
          if (response.credential) {
            setLoading(true);
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await oauthLogin({ credential: response.credential, provider: "google" } as any);
            } catch (err: unknown) {
              const error = err as Error;
              if (onError) onError(error.message || "Google Sign In failed");
            } finally {
              setLoading(false);
            }
          }
        },
      });

      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 380,
          text: "continue_with",
          shape: "pill",
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleGSI();
    } else {
      const script = document.createElement("script");
      script.id = "google-gsi-sdk";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogleGSI;
      document.head.appendChild(script);
    }
  }, [oauthLogin, onError]);

  const handleCustomGoogleClick = () => {
    setLoading(true);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "526783459737-eb5t23vkogpqclauvc126sm93n7gkn4l.apps.googleusercontent.com";

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential?: string }) => {
          if (response.credential) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await oauthLogin({ credential: response.credential, provider: "google" } as any);
            } catch (err: unknown) {
              const error = err as Error;
              if (onError) onError(error.message || "Google Sign In failed");
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        },
      });
      window.google.accounts.id.prompt();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center w-full">
        {/* Render Official Google GSI Button Container */}
        <div ref={googleBtnRef} className="hidden sm:block w-full flex justify-center" />

        {/* Fallback Custom Button */}
        <Button
          type="button"
          onClick={handleCustomGoogleClick}
          disabled={loading}
          variant="outline"
          className="sm:hidden w-full rounded-xl border-border bg-background hover:bg-card text-foreground font-bold text-sm h-11 shadow-xs"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon /> Continue with Google
            </>
          )}
        </Button>
      </div>

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          OR CONTINUE WITH EMAIL
        </span>
      </div>
    </div>
  );
}

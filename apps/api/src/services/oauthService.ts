import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export interface OAuthUserData {
  email: string;
  providerId: string;
  avatarUrl: string;
}

export async function verifyGoogleToken(
  credential: string,
): Promise<OAuthUserData> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error("Google OAuth is not configured on the server");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token payload");
  }

  return {
    email: payload.email,
    providerId: payload.sub,
    avatarUrl: payload.picture || "",
  };
}

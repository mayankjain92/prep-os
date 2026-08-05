import https from "https";
import http from "http";

export function startKeepAlive() {
  const url = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
  if (!url) {
    console.log("[Keep-Alive] No RENDER_EXTERNAL_URL or BACKEND_URL provided. Self-pinging disabled.");
    return;
  }

  // Render free tier sleeps after 15 min of inactivity. Ping every 10 minutes.
  const INTERVAL_MS = 10 * 60 * 1000;
  const baseUrl = url.replace(/\/$/, "");
  const healthUrl = `${baseUrl}/health`;

  console.log(`[Keep-Alive] Initialized self-ping service for: ${healthUrl}`);

  setInterval(() => {
    const protocol = healthUrl.startsWith("https") ? https : http;

    protocol.get(healthUrl, (res) => {
      console.log(`[Keep-Alive] Pinged ${healthUrl} - Status: ${res.statusCode}`);
    }).on("error", (err) => {
      console.error(`[Keep-Alive] Ping error: ${err.message}`);
    });
  }, INTERVAL_MS);
}

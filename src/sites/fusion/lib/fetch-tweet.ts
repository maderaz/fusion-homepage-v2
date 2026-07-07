/**
 * Build-time X (Twitter) syndication fetch.
 *
 * Pulls the *real* display name, avatar, verified badge and engagement counts
 * for a tweet at build time — no client-side JavaScript, no third-party widget,
 * no tracking pixels. The avatar is inlined as a `data:` URI so the rendered
 * card needs no external image permission (the existing `img-src 'self' data:`
 * CSP already covers it).
 *
 * This uses the same public syndication endpoint and token derivation as
 * Vercel's `react-tweet`. Every failure path degrades to `null`, so a network
 * hiccup or rate-limit during a deploy can never break the build — the article
 * renderer simply falls back to the authored tweet data.
 *
 * Note: some sandboxed/preview networks block `cdn.syndication.twimg.com`; in
 * that case this returns `null` locally and the real fetch happens on Vercel,
 * whose build network is unrestricted.
 */

export interface FetchedTweet {
  name: string;
  handle: string;
  verified: boolean;
  avatarDataUri: string | null;
  text: string;
  likes: number;
  replies: number;
  retweets: number;
  /** ISO timestamp of the tweet, if provided by the API. */
  createdAt: string;
}

/** react-tweet's token derivation (base-36 of id * PI, stripped of noise). */
function deriveToken(id: string): string {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, "");
}

/**
 * `fetch` with a hard timeout so a slow or hanging X endpoint can never stall
 * the build. On timeout the request is aborted and the caller's catch returns
 * the graceful fallback.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  ms = 8000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function toDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "image/jpeg";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// Memoise per build so the same tweet embedded in multiple places is fetched
// once.
const cache = new Map<string, Promise<FetchedTweet | null>>();

async function load(id: string): Promise<FetchedTweet | null> {
  try {
    const token = deriveToken(id);
    const url =
      `https://cdn.syndication.twimg.com/tweet-result?id=${id}` +
      `&token=${token}&lang=en`;
    const res = await fetchWithTimeout(url, {
      headers: {
        // The endpoint 404s without a browser-ish UA.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return null;
    const d: any = await res.json();
    if (!d || !d.user || d.__typename === "TweetTombstone") return null;

    const rawAvatar: string = d.user.profile_image_url_https || "";
    const hiResAvatar = rawAvatar.replace("_normal", "_400x400");

    return {
      name: d.user.name ?? "",
      handle: d.user.screen_name ?? "",
      verified: Boolean(
        d.user.verified || d.user.is_blue_verified || d.user.verified_type,
      ),
      avatarDataUri: hiResAvatar ? await toDataUri(hiResAvatar) : null,
      text: d.text ?? "",
      likes: Number(d.favorite_count ?? 0),
      replies: Number(d.conversation_count ?? 0),
      retweets: Number(d.retweet_count ?? 0),
      createdAt: d.created_at ?? "",
    };
  } catch {
    return null;
  }
}

export function fetchTweet(id: string): Promise<FetchedTweet | null> {
  let hit = cache.get(id);
  if (!hit) {
    hit = load(id);
    cache.set(id, hit);
  }
  return hit;
}

/** 1234 -> "1.2K", 1_500_000 -> "1.5M". */
export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

/** X's created_at ("Wed Oct 15 12:00:00 +0000 2025") -> "Oct 15, 2025". */
export function formatTweetDate(iso: string, fallback: string): string {
  if (!iso) return fallback;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return fallback;
  const d = new Date(t);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

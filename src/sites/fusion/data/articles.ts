/**
 * Ecosystem News content.
 *
 * Articles are authored in-repo as structured data so the hub page, the
 * standalone article page, and the homepage featured section all render from a
 * single typed source. Body content is modelled as a small set of block types
 * (rich enough for the tweet-thread style of these announcements) instead of
 * raw HTML, so rendering stays safe and consistent.
 */

export type ArticleBlock =
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "source"; label: string; url: string }
  | {
      type: "pullquote";
      text: string;
      author: string;
      title?: string;
    }
  | { type: "tweet"; tweet: Tweet };

export interface Tweet {
  author: string;
  handle: string;
  date: string;
  text: string;
  url?: string;
  /** An optional quote-tweet rendered nested inside this one. */
  quoted?: Omit<Tweet, "quoted">;
}

export interface Article {
  slug: string;
  title: string;
  /** One-line summary used on cards and meta descriptions. */
  excerpt: string;
  /** ISO date (YYYY-MM-DD) — used for sorting and <time>. */
  date: string;
  category: string;
  author: {
    name: string;
    handle: string;
  };
  /** Approximate reading time in minutes. */
  readingMinutes: number;
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "bitgo-institutional-access-tesseract-dedicated-client-vaults",
    title:
      "BitGo Opens Institutional Access to Tesseract's Dedicated Client Vaults Powered by Fusion",
    excerpt:
      "Eligible institutions can now allocate to Tesseract's Dedicated Client Vaults — powered by Fusion — directly from BitGo qualified custody, with assets staying inside the custodial perimeter.",
    date: "2026-06-09",
    category: "Ecosystem",
    author: { name: "Fusion (by IPOR)", handle: "ipor_io" },
    readingMinutes: 4,
    body: [
      {
        type: "lead",
        text: "Fusion congratulates Tesseract Investment Oy (@tesseractcrypto), the Helsinki-based MiCA-authorised CASP, on its integration with BitGo Bank & Trust, N.A. (“BitGo Bank & Trust”), an OCC-regulated digital asset trust bank and subsidiary of BitGo Holdings, Inc. (NYSE: BTGO) (“BitGo”).",
      },
      {
        type: "source",
        label:
          "BitGo Launches Institutional DeFi Access to Aave, Spark and Tesseract Through Narval Integration",
        url: "https://www.businesswire.com/news/home/20260609049680/en/BitGo-Launches-Institutional-DeFi-Access-to-Aave-Spark-and-Tesseract-Through-Narval-Integration",
      },
      {
        type: "paragraph",
        text: "Eligible institutions can now allocate to Tesseract's Dedicated Client Vaults, powered by Fusion's vault infrastructure, directly from BitGo qualified custody, while their assets stay inside the custodial perimeter.",
      },
      {
        type: "paragraph",
        text: "Each Dedicated Client Vault is individually assigned to a single client, with its own risk parameters, approved protocol integrations, and compliance configuration, while Tesseract operates under MiCA authorisation for certain crypto-asset services.",
      },
      {
        type: "paragraph",
        text: "Access now runs through BitGo's qualified custody and Narval's DeFi gateway, which, per BitGo's announcement, verifies each transaction before it reaches the custody approval workflow.",
      },
      { type: "heading", text: "Context" },
      {
        type: "paragraph",
        text: "In March 2026, Tesseract announced it had selected Fusion to power its Dedicated Client Vaults for institutional onchain yield, with 21Shares among the pilot partners.",
      },
      {
        type: "tweet",
        tweet: {
          author: "Fusion (by IPOR)",
          handle: "ipor_io",
          date: "Mar 31",
          text: "Tesseract Selects Fusion for Institutional Vault Infrastructure — 21Shares Among Pilot Partners\n\nTesseract Investment Oy, a Helsinki-based digital asset service provider (est. 2017, MiCA-authorised CASP), has selected Fusion as its onchain vault infrastructure for institutional onchain yield…",
        },
      },
      {
        type: "paragraph",
        text: "Today's BitGo news adds to a growing set of established entities reaching Fusion through Tesseract's Dedicated Client Vaults, now from inside regulated custody.",
      },
      {
        type: "paragraph",
        text: "As the infrastructure beneath these vaults, Fusion provides the per-client isolation, deterministic risk enforcement, and onchain transparency that let a custodian and a compliance team stand behind an onchain mandate. The work of assembling this custody route belongs to Tesseract, BitGo, and Narval.",
      },
      {
        type: "tweet",
        tweet: {
          author: "James Harris",
          handle: "jemharris11",
          date: "Jun 9",
          text: "Really pleased to share this one.\n\nTesseract is live today as a launch partner in @BitGo's DeFi gateway, built with @Narvalgmi, alongside @aave and @sparkdotfi.\n\nBitGo clients can now allocate to a Dedicated Client Vault (powered by @ipor_io) straight from custody. Huge…",
          quoted: {
            author: "BitGo",
            handle: "BitGo",
            date: "Jun 9",
            text: "BitGo now integrates @Narvalgmi's DeFi Gateway, giving institutional clients secure access to @Aave, @sparkdotfi, and @tesseractcrypto directly from qualified custody.\n\nZero blind signing. Full transaction verification. Institutional DeFi, done right. 👇",
            url: "https://www.businesswire.com/news/home/20260609049680/en/BitGo-Launches-Institutional-DeFi-Access-to-Aave-Spark-and-Tesseract-Through-Narval-Integration",
          },
        },
      },
      {
        type: "pullquote",
        text: "Congratulations to James and the Tesseract team on being selected by BitGo for its institutional DeFi gateway, alongside industry giants Aave and Spark. This widens the path for institutional capital to allocate onchain at scale. Fusion powers Tesseract's Dedicated Client Vaults: per-client isolation, deterministic risk enforcement, and onchain transparency. We are ready to support every partner involved.",
        author: "Darren Camas",
        title: "CEO, IPOR Labs AG",
      },
      {
        type: "paragraph",
        text: "Developed by IPOR Labs AG (Zug, Switzerland), Fusion is the onchain vault infrastructure built for institutional-grade onchain yield strategies.",
      },
    ],
  },
];

/** Articles sorted newest-first. */
export function getArticles(): Article[] {
  return [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-06-09" -> "Jun 9, 2026" (locale-independent for stable SSG output). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

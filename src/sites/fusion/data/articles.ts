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
  /** Show the blue verified checkmark next to the display name. */
  verified?: boolean;
  date: string;
  text: string;
  url?: string;
  /**
   * Numeric X status id. When set, the article renderer fetches the tweet's
   * real avatar, verified state and live engagement counts at build time and
   * renders those over the authored fields below (which act as the fallback if
   * the fetch is unavailable). Omit for a purely authored card.
   */
  id?: string;
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
        text: "In March 2026, Tesseract announced it had selected Fusion to power its Dedicated Client Vaults for institutional onchain yield, with 21Shares among the pilot partners (https://x.com/ipor_io/status/2038960123066892489).",
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
        type: "pullquote",
        text: "Congratulations to James and the Tesseract team on being selected by BitGo for its institutional DeFi gateway, alongside industry giants Aave and Spark. This widens the path for institutional capital to allocate onchain at scale. Fusion powers Tesseract's Dedicated Client Vaults: per-client isolation, deterministic risk enforcement, and onchain transparency. We are ready to support every partner involved.",
        author: "Darren Camas",
        title: "CEO, IPOR Labs AG",
      },
      {
        type: "paragraph",
        text: "Developed by IPOR Labs AG (Zug, Switzerland), Fusion is the onchain vault infrastructure built for institutional-grade onchain yield strategies.",
      },
      {
        type: "source",
        label: "Discover fusion.ipor.io",
        url: "https://fusion.ipor.io",
      },
    ],
  },
  {
    slug: "tesseract-selects-fusion-institutional-vault-infrastructure",
    title:
      "Tesseract selects IPOR Fusion as onchain vault infrastructure for institutional clients",
    excerpt:
      "Tesseract Investment Oy, a Helsinki-based MiCA-authorised CASP, has selected Fusion as its onchain vault infrastructure for institutional onchain yield — with 21Shares among the launch partners.",
    date: "2026-03-31",
    category: "Ecosystem",
    author: { name: "Fusion (by IPOR)", handle: "ipor_io" },
    readingMinutes: 5,
    body: [
      {
        type: "lead",
        text: "Tesseract Investment Oy, a Helsinki-based digital asset service provider (est. 2017, MiCA-authorised CASP), has selected Fusion as its onchain vault infrastructure for institutional onchain yield strategies.",
      },
      {
        type: "paragraph",
        text: "After over a year of working with Fusion's vault architecture and close collaboration with the IPOR Labs team, Tesseract will leverage Fusion-powered vaults as the primary allocation destination for its institutional clients.",
      },
      {
        type: "paragraph",
        text: "Tesseract is working with a select group of launch partners across asset management, custody, and institutional distribution, including 21Shares — one of the world's leading crypto ETP issuers with products listed across SIX, Deutsche Börse, Euronext, and the London Stock Exchange.",
      },
      {
        type: "paragraph",
        text: "Fusion was evaluated against the standards regulated institutional clients demand: deterministic risk enforcement, segregated failure domains, onchain transparency, and embedded compliance. The architecture delivers through immutable protocol integrations, isolated vault deployment per client, asset-level whitelisting, market exposure limits enforced atomically onchain, and a strict segregation of duties between governance, execution, and risk oversight.",
      },
      {
        type: "paragraph",
        text: "For Tesseract, operating under MiCA authorisation for certain crypto-asset services, this infrastructure provides the structural layer that reflects asset segregation expectations under European regulation.",
      },
      { type: "heading", text: "Dedicated Client Vaults" },
      {
        type: "paragraph",
        text: "Tesseract's institutional clients will operate on dedicated Fusion vault deployments. Each Dedicated Client Vault is individually assigned to a single client, with its own risk parameters, approved protocol integrations, and compliance configuration.",
      },
      {
        type: "paragraph",
        text: "The vaults tap into Fusion's Fuse integrations across leading DeFi lending markets, including Aave, Morpho, SparkLend, and Euler, allowing Tesseract to construct and manage institutional-grade yield strategies across multiple venues.",
      },
      {
        type: "pullquote",
        text: "Having reviewed multiple infrastructure options, we chose to work with IPOR Fusion because it was already built to the standard we were looking for such as audited contracts, onchain risk controls, and proper asset segregation. The IPOR Labs team has worked closely with us over the past year to pressure-test every layer of the stack.",
        author: "James Harris",
        title: "CEO, Tesseract Investment Oy",
      },
      {
        type: "pullquote",
        text: "IPOR Fusion was designed to meet the needs of institutional capital operating onchain strategies with the same structural safeguards they expect in the traditional world. After a year of close collaboration with Tesseract stress-testing every layer of the architecture, we are pleased to expand this collaboration as Tesseract brings Fusion-powered vaults to its institutional clientele. Welcoming 21Shares among the pilot partners signals strong institutional interest in what this infrastructure can deliver.",
        author: "Darren Camas",
        title: "CEO, IPOR Labs",
      },
      { type: "heading", text: "About Tesseract" },
      {
        type: "paragraph",
        text: "Tesseract Group, headquartered in Helsinki, provides institutional clients including cryptocurrency trading platforms, fintechs, and custodians with access to yield-generating solutions across digital asset lending and onchain yield infrastructure. Since 2017, Tesseract has built a track record of disciplined risk management and profitable growth across multiple jurisdictions, with ISO 27001 and SOC 2 certifications and technology battle-tested by industry participants including Bitstamp.",
      },
      {
        type: "paragraph",
        text: "Tesseract Investment Oy is a MiCA-authorised Crypto-Asset Service Provider.",
      },
      {
        type: "source",
        label: "tesseract.fi",
        url: "https://tesseract.fi",
      },
      { type: "heading", text: "About Fusion" },
      {
        type: "paragraph",
        text: "Developed by IPOR Labs AG (Zug, Switzerland), Fusion is the onchain vault infrastructure built for institutional-grade onchain yield strategies. Its modular architecture provides deterministic risk enforcement, per-client vault isolation, embedded compliance, and flexible configuration through composable modules called Fuses, integrated with leading DeFi protocols.",
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

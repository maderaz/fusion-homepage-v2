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
  | { type: "list"; items: string[] }
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
  /**
   * Optional cover image (absolute path under `/public`). Used at the top of
   * the article page, as the news-card thumbnail, and as the article's social
   * share image.
   */
  coverImage?: string;
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "fusion-automates-aave-yield-cbeth-looping",
    title:
      "Turning cbETH's 2.75% Native Yield to 15% on Aave with Fusion Automation",
    excerpt:
      "There is far more yield inside Aave's markets than most participants ever reach. Fusion's automation turns that depth into performance, like TAU Labs' cbETH Dynamic Looping vault, which stacks cbETH's native yield into roughly 15% on Base.",
    date: "2026-06-24",
    category: "Strategies",
    author: { name: "Fusion Team", handle: "ipor_io" },
    readingMinutes: 6,
    coverImage: "/brand/aave-cbeth.png",
    body: [
      {
        type: "lead",
        text: "There is far more yield sitting inside Aave's markets than most participants ever reach. The depth is there, the assets are there, and the borrowing capacity is there.",
      },
      {
        type: "paragraph",
        text: "Fusion vaults and automation turn that potential into performance, while the native yield is still sourced from the trusted @aave environment.",
      },
      {
        type: "paragraph",
        text: "Fusion by @ipor_io is onchain vault infrastructure that lets teams build automated strategies on top of Aave.",
      },
      {
        type: "paragraph",
        text: "One vault built on Fusion now runs the largest automated cbETH position on the entire @base network, almost entirely supplying it to Aave, and stacking cbETH's ~2.75% native yield into a combined performance of around **15%** through automated looping and Aave-level rewards.",
      },
      {
        type: "paragraph",
        text: "Here is how it works, shown through the leading example on Aave today: the **cbETH Dynamic Looping vault operated by TAU Labs**.",
      },
      {
        type: "paragraph",
        text: "We cover the mechanism, the impact it has had, and how anyone, from retail participants to institutions, can access the same approach or build their own across other assets and networks.",
      },
      { type: "heading", text: "The starting point: cbETH's native staking yield of ~2.75%" },
      {
        type: "paragraph",
        text: "cbETH is Coinbase Wrapped Staked ETH, a reward-bearing token whose value appreciates against ETH as staking rewards accrue. That native yield currently sits ~2.75% [1].",
      },
      {
        type: "paragraph",
        text: "Supplied to Aave on its own, cbETH earns its staking yield and sits as high-quality collateral. That collateral role is the foundation everything else is built on. The native yield is real, but on a single, unleveraged position, the low single digits are roughly where it settles.",
      },
      {
        type: "paragraph",
        text: "The potential sits one step further out. Aave's deep, liquid markets make it possible to do far more with that same collateral, and that is where Fusion's automation comes in.",
      },
      { type: "heading", text: "The mechanism: a small spread, multiplied" },
      {
        type: "paragraph",
        text: "The TAU cbETH Dynamic Looping vault [2] takes that ~2.75% yielding asset and runs it through an automated strategy.",
      },
      {
        type: "paragraph",
        text: "In simple terms, the vault supplies cbETH as collateral on Aave, borrows WETH against it, acquires more cbETH, and repeats. The position can reach an effective leverage of close to 10x.",
      },
      {
        type: "paragraph",
        text: "The yield comes from a spread. cbETH earns its staking yield, the borrowed WETH carries a cost, and the difference between the two is small on a single pass. Looped close to ten times, that small spread compounds into an amplified result.",
      },
      {
        type: "paragraph",
        text: "The whole process is automated. The vault reallocates across Aave lending markets to keep borrow costs low and maintains programmatic liquidation protection as conditions move.",
      },
      { type: "heading", text: "Where the 15% on cbETH comes from" },
      {
        type: "paragraph",
        text: "The combined performance is a stack of sources, all automated through Fusion, and most of it sits at the Aave level:",
      },
      {
        type: "list",
        items: [
          "**Looping spread** (cbETH staking yield minus the WETH borrow cost): around **7.8%**",
          "**Merkl rewards** for borrowing WETH against cbETH collateral on Aave: around **7.9%**",
        ],
      },
      {
        type: "paragraph",
        text: "Stacked together, that brings combined performance to roughly **15% after fees** under current conditions. The looping spread and the Merkl rewards both run through Aave markets, so the majority of the upside originates on Aave, with the strategy running it automatically on Fusion.",
      },
      {
        type: "paragraph",
        text: "The reward portion is variable and incentive-driven. It reflects current conditions and can change as rewards and rates move, so the combined figure stays dynamic rather than fixed.",
      },
      { type: "heading", text: "Aave as the backbone of automated looping" },
      {
        type: "paragraph",
        text: "Looping strategies need one thing above all: deep, liquid markets to borrow against at low cost. Aave has exactly that, across assets and networks, which is what lets these strategies scale to a meaningful size.",
      },
      {
        type: "paragraph",
        text: "That vault runs around 95% of its allocation through Aave v3 Core, and the relationship runs both ways.",
      },
      {
        type: "paragraph",
        text: "As the vault grew, it became a meaningful source of demand on Aave V3's Base market, supplying as much as 70% of the cbETH supply side at its peak and contributing a significant share of WETH borrows. Aave provided the liquidity, and the strategy put it to work at scale.",
      },
      {
        type: "paragraph",
        text: "This strategy now benefits hundreds of users, sourcing yield from Aave in automated fashion. Its impact has been clearly reflected by the need to raise cbETH caps, as communicated in May.",
      },
      {
        type: "paragraph",
        text: "The impact of that looping strategy is also reflected in the marketcap of @coinbase cbETH, supporting growth of the entire supply by 10%+ from 11 May.",
      },
      {
        type: "paragraph",
        text: "Across the Fusion ecosystem, strategies tapping into Aave liquidity account for **~11.72% of the entire cbETH circulating supply** as of 23 June 2026.",
      },
      { type: "heading", text: "Accessing automated Aave strategies: for retail participants" },
      {
        type: "paragraph",
        text: "Automated strategies built on top of Aave are gaining traction, and access to them is open. Anyone can step into a strategy like the cbETH looping vault onchain or through the Fusion App.",
      },
      {
        type: "paragraph",
        text: "Strategies run on Fusion vault infrastructure follow enforced mandates, and each vault's set of eligible actions is previewable by anyone, along with full strategy details, allocation, and live performance, before and after allocation.",
      },
      { type: "heading", text: "For institutional capital" },
      {
        type: "paragraph",
        text: "Institutional capital reaches the same Aave markets through a different door. Regulated allocators need mandates, KYC, and verifiable access points, and a Fusion vault is exactly that: a contained, auditable structure with defined permissions.",
      },
      {
        type: "paragraph",
        text: "That access is already live. Through @tesseractcrypto's Dedicated Client Vaults, run under Tesseract's MiCA authorisation and built on top of Fusion vault infrastructure, regulated institutions reach Aave markets from inside their own regulated perimeter, the first MiCA-authorised access route of its kind.",
      },
      {
        type: "paragraph",
        text: "@BitGo (https://x.com/ipor_io/status/2064364105259983111), an OCC-regulated digital asset trust bank (NYSE: BTGO), and **@21shares** (https://x.com/ipor_io/status/2038960123066892489), one of the world's leading crypto ETP issuers, are among the names already connected to this path.",
      },
      { type: "heading", text: "For teams building their own Aave automated strategies" },
      {
        type: "paragraph",
        text: "The tooling behind automated strategies is open to any team. Fusion vault infrastructure and its open-source modules for Aave V3 and V4 are live today, ready to replicate an existing looping strategy framework or build a new one.",
      },
      {
        type: "paragraph",
        text: "The same looping template may extend across many Aave markets, for example:",
      },
      {
        type: "list",
        items: [
          "ETH staking tokens such as weETH and rETH against ETH",
          "Stablecoin carry with assets like USDe",
          "Stablecoin pairs such as GHO and USDT0",
        ],
      },
      {
        type: "paragraph",
        text: "These opportunities travel across the networks where Aave operates. Teams building their own Aave strategy can start from the open Fusion tooling:",
      },
      {
        type: "list",
        items: [
          "**Build automated vault with Fusion by IPOR Labs:** https://docs.ipor.io/build-on-fusion/developer-guide/quick-start-guide",
          "**Aave V3 Module:** https://github.com/IPOR-Labs/ipor-fusion/tree/main/contracts/fuses/aave_v3",
          "**Aave V4 Module:** https://github.com/IPOR-Labs/ipor-fusion/tree/main/contracts/fuses/aave_v4",
        ],
      },
      { type: "heading", text: "References" },
      {
        type: "list",
        items: [
          "[1] cbETH native staking yield, Coinbase: https://www.coinbase.com/en-gb/earn/staking/coinbase-wrapped-staked-eth",
          "[2] TAU cbETH Dynamic Looping vault: https://app.ipor.io/fusion/base/0xe883426b4fc84a7f5cc86415cabbef43e73a4cc8",
          "[3] cbETH looping mechanism, TAU Labs: https://x.com/628Labs/status/2066488153792450599",
        ],
      },
    ],
  },
  {
    slug: "bitgo-institutional-access-tesseract-dedicated-client-vaults",
    title:
      "BitGo Opens Institutional Access to Tesseract's Dedicated Client Vaults Powered by Fusion",
    excerpt:
      "Eligible institutions can now allocate to Tesseract's Dedicated Client Vaults, powered by Fusion, directly from BitGo qualified custody, with assets staying inside the custodial perimeter.",
    date: "2026-06-09",
    category: "Ecosystem",
    author: { name: "Fusion Team", handle: "ipor_io" },
    readingMinutes: 4,
    coverImage: "/brand/bitgo-announcement.png",
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
        text: "In March 2026, Tesseract announced it had selected Fusion to power its Dedicated Client Vaults for institutional onchain yield, with 21Shares among the pilot partners.",
      },
      {
        type: "tweet",
        tweet: {
          author: "Fusion (by IPOR)",
          handle: "ipor_io",
          verified: true,
          id: "2038960123066892489",
          date: "Mar 31, 2026",
          text: "Tesseract Selects Fusion for Institutional Vault Infrastructure, 21Shares Among Pilot Partners.\n\nTesseract Investment Oy, a Helsinki-based MiCA-authorised CASP, has selected Fusion as its onchain vault infrastructure for institutional onchain yield.",
          url: "https://x.com/ipor_io/status/2038960123066892489",
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
  {
    slug: "tesseract-selects-fusion-institutional-vault-infrastructure",
    title:
      "Tesseract Selects IPOR Fusion as Onchain Vault Infrastructure for Institutional Clients",
    excerpt:
      "Tesseract Investment Oy, a Helsinki-based MiCA-authorised CASP, has selected Fusion as its onchain vault infrastructure for institutional onchain yield, with 21Shares among the launch partners.",
    date: "2026-03-31",
    category: "Ecosystem",
    author: { name: "Fusion Team", handle: "ipor_io" },
    readingMinutes: 5,
    coverImage: "/brand/tesseract-selects-fusion.png",
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
        text: "Tesseract is working with a select group of launch partners across asset management, custody, and institutional distribution, including 21Shares, one of the world's leading crypto ETP issuers with products listed across SIX, Deutsche Börse, Euronext, and the London Stock Exchange.",
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

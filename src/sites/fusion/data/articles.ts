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
    slug: "base-rewards-fusion-strategies-anchorage-digital",
    title:
      "Base Rewards Now Live for Select Fusion Strategies via Anchorage Digital",
    excerpt:
      "From 29 June, wallets that reach select Fusion strategies on Base through the Porto by Anchorage Digital portal may earn Base-supported rewards in cbETH via Merkl, on top of each strategy's onchain results.",
    date: "2026-06-29",
    category: "Incentives",
    author: { name: "Fusion Team", handle: "ipor_io" },
    readingMinutes: 3,
    coverImage: "/brand/anchorage-base-rewards.png",
    body: [
      {
        type: "lead",
        text: "Starting today at 4PM UTC, wallets that access select Fusion strategies on Base Network through the Porto by @Anchorage Digital Web3 portal may be eligible to receive @base supported rewards, distributed through Merkl, in addition to each strategy's onchain results.",
      },
      { type: "heading", text: "Who is eligible" },
      {
        type: "paragraph",
        text: "Users who allocate to eligible Fusion strategies on Base through the Porto by Anchorage Digital web3 portal in the client web dashboard.",
      },
      {
        type: "paragraph",
        text: "A wallet may be eligible to receive rewards for as long as it remains allocated to an eligible strategy, and the amount depends on the size of the allocation and the prevailing target and program conditions, both of which can vary.",
      },
      {
        type: "paragraph",
        text: "There is no minimum allocation to take part. Eligibility applies across all allocation sizes.",
      },
      { type: "heading", text: "Eligible strategies" },
      {
        type: "list",
        items: [
          "[TAU cbETH Dynamic Looping](https://app.ipor.io/fusion/base/0xe883426b4fc84a7f5cc86415cabbef43e73a4cc8)",
          "[Base ETH Lending Optimizer](https://app.ipor.io/fusion/base/0x17d0f109ee895bad0b68aa104aa72bd0b003ad8e)",
          "[Autopilot WETH Base](https://app.ipor.io/fusion/base/0x7872893e528fe2c0829e405960db5b742112aa97)",
          "[Base cbETH Loooper](https://app.ipor.io/fusion/base/0x5900c3b72458f12967dc1bef35b92d271f5cdbc1)",
        ],
      },
      {
        type: "paragraph",
        text: "This list can expand. New additions are marked with the [base] badge under the incentives column in the Fusion app.",
      },
      { type: "heading", text: "Rewards" },
      {
        type: "list",
        items: [
          "**Reward asset:** rewards are paid in cbETH.",
          "**Reward size:** a capped reward rate of up to 0.5% across the eligible strategies, applied on top of each strategy's onchain performance.",
          "**Funding:** rewards launch with an initial budget of 5,000 USD equivalent in cbETH and scale up from 25 July in line with participation growth.",
        ],
      },
      { type: "heading", text: "Duration" },
      {
        type: "paragraph",
        text: "The program's first phase runs from 29 June 2026, 4PM UTC through 25 July 2026. From 25 July the program is set to scale up in line with participation. Daily participation spend can be monitored through the Merkl portal.",
      },
      { type: "heading", text: "How to participate" },
      {
        type: "paragraph",
        text: "Access eligible Fusion strategies on Base through the Porto by Anchorage Digital ecosystem. Anchorage Digital routes participants to a dedicated section of the Fusion app that lists eligible strategies only.",
      },
      { type: "heading", text: "How to claim" },
      {
        type: "paragraph",
        text: "Rewards are claimed through the independent platform @merkl_xyz at [app.merkl.xyz/users](https://app.merkl.xyz/users). Rewards start accruing within the first 24 hours after allocation.",
      },
      { type: "heading", text: "Important notes" },
      {
        type: "paragraph",
        text: "Rewards are variable and not guaranteed. The effective rate depends on total participating TVL and remaining budget. The onchain risks of the underlying strategy remain separate from these rewards.",
      },
    ],
  },
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
        text: "@BitGo, an OCC-regulated digital asset trust bank (NYSE: BTGO), and @21shares, one of the world's leading crypto ETP issuers, are among the names already connected to this path.",
      },
      {
        type: "tweet",
        tweet: {
          author: "Fusion (by IPOR)",
          handle: "ipor_io",
          verified: true,
          id: "2064364105259983111",
          date: "Jun 9, 2026",
          text: "BitGo opens institutional access to Tesseract's Dedicated Client Vaults, powered by Fusion. Eligible institutions can now allocate to onchain strategies directly from BitGo qualified custody, with assets staying inside the custodial perimeter.",
          url: "https://x.com/ipor_io/status/2064364105259983111",
        },
      },
      {
        type: "tweet",
        tweet: {
          author: "Fusion (by IPOR)",
          handle: "ipor_io",
          verified: true,
          id: "2038960123066892489",
          date: "Mar 31, 2026",
          text: "Tesseract Selects Fusion for Institutional Vault Infrastructure, with 21Shares among the pilot partners. Tesseract Investment Oy, a Helsinki-based MiCA-authorised CASP, has selected Fusion as its onchain vault infrastructure for institutional onchain yield.",
          url: "https://x.com/ipor_io/status/2038960123066892489",
        },
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
    slug: "covered-vaults-fusion-opencover-onchain-protection",
    title:
      "Covered Vaults Come to Fusion: Embedded Onchain Protection by OpenCover",
    excerpt:
      "Onchain cover is now available for select Fusion vaults, provided by OpenCover and underwritten by Nexus Mutual, starting with a Covered Vault for the Liquity ETH Carry strategy.",
    date: "2026-06-18",
    category: "Ecosystem",
    author: { name: "Fusion Team", handle: "ipor_io" },
    readingMinutes: 4,
    coverImage: "/brand/opencover.png",
    body: [
      {
        type: "lead",
        text: "Onchain cover is now available for select Fusion vaults, provided by @OpenCover, a pioneer of embedded onchain cover and underwritten by @NexusMutual.",
      },
      {
        type: "paragraph",
        text: "This integration features the first Covered Vault for the Liquity ETH Carry deployment operated by @Sentinel_codes, anchored to @LiquityProtocol ecosystem.",
      },
      { type: "heading", text: "Covered Vaults explained" },
      {
        type: "paragraph",
        text: "OpenCover's Covered Vaults are a DeFi primitive that wraps an existing yield-generating vault and adds embedded protection to it, bringing risk transfer into the vault lifecycle rather than treating it as a separate product.",
      },
      {
        type: "paragraph",
        text: "**How it works:**",
      },
      {
        type: "paragraph",
        text: "A participant supplies liquidity into the Fusion vault, for example the Liquity ETH Carry strategy.",
      },
      {
        type: "paragraph",
        text: "They stake the resulting vault shares into the associated Covered Vault to activate protection.",
      },
      {
        type: "paragraph",
        text: "From there, protection is active, with coverage premiums streamed from the strategy's performance on an ongoing basis. There is no upfront payment and no fixed duration. Cover ends automatically when a participant exits the Covered Vault.",
      },
      {
        type: "paragraph",
        text: "Withdrawals from the Covered Vault mirror deposits and settle in seconds, and the full process is visible and self-directed from the OpenCover interface.",
      },
      { type: "heading", text: "What is covered" },
      {
        type: "paragraph",
        text: "The Nexus Mutual Vault Cover addresses defined technical and economic failure events set out in the policy, including, but not limited to:",
      },
      {
        type: "list",
        items: [
          "Smart contract exploits",
          "Oracle manipulation and failure",
          "Liquidation failure, including bad debt",
          "Governance attacks",
        ],
      },
      {
        type: "paragraph",
        text: "A deductible and per-protocol sublimits apply, with each underlying protocol in a strategy carrying its own share of the overall cover. The full scope, deductible, and sublimits for a given Covered Vault are documented in its policy and annex.",
      },
      { type: "heading", text: "Where to find it" },
      {
        type: "paragraph",
        text: "A dedicated Fusion page, hosted by OpenCover, lists the currently eligible Covered Vaults at [opencover.com/vaults/fusion](https://opencover.com/vaults/fusion).",
      },
      {
        type: "paragraph",
        text: "Each listing links to its policy, annex, and proof of cover, so participants have the coverage terms upfront. The cover is underwritten by Nexus Mutual, and the contracts are audited by Nethermind and Sherlock.",
      },
      {
        type: "pullquote",
        text: "Verifiable systems get risk-rated, and risk-rated systems get covered. That has been part of how we describe the path to institutional scale, and this is that step taking shape onchain. Credit to the OpenCover and Nexus Mutual teams for building it. Fusion is glad to be the vault layer underneath, and I invite our ecosystem operators to explore Covered Vaults for their Fusion deployments.",
        author: "Darren Camas",
        title: "CEO, IPOR Labs",
      },
      { type: "heading", text: "For Fusion vault operators" },
      {
        type: "paragraph",
        text: "Operators running strategies on Fusion can request cover for their own deployment. The OpenCover team handles quotes and onboarding at [opencover.com/institutional](https://opencover.com/institutional).",
      },
      {
        type: "paragraph",
        text: "@k3_capital @hyperithm @LlamaRisk @ClearstarLabs @628Labs @reservoir_xyz @tankencapital @Sentinel_codes @BTCDOfficial @tesseractcrypto",
      },
      { type: "heading", text: "About OpenCover" },
      {
        type: "paragraph",
        text: "@OpenCover is the leading onchain risk transfer provider for complex and embedded use cases such as vault-native and transaction cover. Backed by Coinbase, Alliance, NFX, Village Global, Jump, and Lloyd's of London, OpenCover has safeguarded over $1 billion in onchain value in 2025 alone.",
      },
      { type: "heading", text: "About Fusion" },
      {
        type: "paragraph",
        text: "Developed by IPOR Labs AG (Zug, Switzerland), Fusion is the onchain vault infrastructure for institutional-grade yield strategies. Its compliance-friendly vault stack is accessed by leading curators and regulated institutions, including Fortune 500 custodian BitGo (NYSE: BTGO) and leading ETP issuer 21Shares, with vault isolation and verifiable, deterministic risk controls.",
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
    slug: "how-vault-curators-navigate-mica-2026",
    title: "How Vault Curators Can Navigate MiCA in 2026",
    excerpt:
      "At Vault Summit during EthCC Cannes 2026, Stéphane Daniel of d&a partners laid out the MiCA legal considerations for vault curators, from CASP reclassification risk to three structuring strategies. A guest article, with a note on how Fusion's architecture relates.",
    date: "2026-04-30",
    category: "Regulation",
    author: { name: "Fusion Team", handle: "ipor_io" },
    readingMinutes: 10,
    coverImage: "/brand/navigating-mica.png",
    body: [
      {
        type: "lead",
        text: "At Vault Summit during EthCC Cannes 2026, Stéphane Daniel (@stephdan_law), Founding Partner at d&a partners, one of the largest blockchain-dedicated law firms in the EU, delivered a keynote on the legal considerations facing vault curators under Europe's MiCA regulation.",
      },
      {
        type: "paragraph",
        text: "The structuring strategies outlined in the presentation, control minimization, jurisdictional planning, transparency frameworks, closely mirror principles that Fusion has been building toward at the infrastructure level. We invited Stéphane to turn his keynote into a guest article for the Fusion community.",
      },
      {
        type: "paragraph",
        text: "**What you will take away from this article:**",
      },
      {
        type: "list",
        items: [
          "Why the Curator role might create regulatory exposure under MiCA",
          "Which crypto-asset services a Curator might inadvertently trigger",
          "Three structuring strategies to mitigate legal risk: technical safeguards, jurisdictional planning, and public documentation",
          "Where the regulatory landscape is heading and why the window to influence it is open now",
          "How Fusion's vault architecture relates to this legal framework",
        ],
      },
      {
        type: "paragraph",
        text: "The following is authored by Stéphane Daniel, Founding Partner at d&a partners: [dnapartners.fr/en/](https://dnapartners.fr/en/)",
      },
      { type: "heading", text: "1. The Curator Role: A New Legal Question" },
      {
        type: "paragraph",
        text: "Vaults serve many purposes: yield aggregation, lending optimization, restaking, delta-neutral strategies, RWA tokenization. This flexibility is also a legal challenge. Each vault architecture creates different roles and responsibilities that need to be assessed on a case-by-case basis.",
      },
      {
        type: "paragraph",
        text: "At the center of this analysis is the Curator. The entity selecting eligible markets and protocols, determining allocation strategy, and defining caps and risk parameters.",
      },
      {
        type: "paragraph",
        text: "But the Curator is rarely the only role. Depending on the architecture, there may also be other roles. For example, in the Morpho protocol, there is an Allocator executing onchain orders, a Guardian ensuring compliance with parameters, and a Sentinel providing automated monitoring and alerts. Design and roles may be different and vary from one protocol to another.",
      },
      {
        type: "paragraph",
        text: "The legal complexity increases when these roles are combined under a single entity. This is a common pattern in practice, and one that heightens regulatory risk.",
      },
      { type: "heading", text: "2. Which Law Applies?" },
      {
        type: "paragraph",
        text: "Before assessing regulatory qualification, vault operators face a more fundamental question: which jurisdiction's law applies?",
      },
      {
        type: "paragraph",
        text: "A Curator incorporated in one country, operating on a stateless blockchain, serving users worldwide. Traditional legal connecting factors struggle with this reality.",
      },
      {
        type: "paragraph",
        text: "Multiple entities may be involved in a single vault setup: the protocol developer, the Curator configuring strategies, the Guardian monitoring compliance, and the depositors themselves, each potentially subject to different jurisdictions. At least three conflict points arise.",
      },
      {
        type: "paragraph",
        text: "First, the law of the Curator's jurisdiction of incorporation. Second, MiCA's broad extraterritorial scope, where provision of services within the EU triggers application. Third, Rome I consumer protection rules tied to the habitual residence of targeted consumers.",
      },
      {
        type: "paragraph",
        text: "The practical risk is a positive conflict of jurisdiction: multiple regulators claiming authority simultaneously, with no international resolution mechanism in place.",
      },
      { type: "heading", text: "3. MiCA and DeFi: The Infrastructure Layer" },
      {
        type: "paragraph",
        text: "MiCA's position on DeFi is built on a single sentence: “Where crypto-asset services are provided in a fully decentralised manner without any intermediary, they should not fall within the scope of this Regulation.”",
      },
      {
        type: "paragraph",
        text: "Two sentences for an entire sector. No definition of “fully decentralised” is provided.",
      },
      {
        type: "paragraph",
        text: "In practice, decentralization is assessed through two lenses.",
      },
      {
        type: "paragraph",
        text: "First, technical decentralization. Self-executing smart contracts with no entity controlling activity after deployment. No embedded control rights such as admin keys, upgrade proxies, or pause functions. Permissionless blockchain with decentralized consensus. Non-custodial protocol where users retain control of assets at all times. Open-source and verifiable code with automatic execution. If the protocol satisfies these criteria, it falls outside MiCA.",
      },
      {
        type: "paragraph",
        text: "If technical decentralization is incomplete, a second test applies: governance decentralization. This examines whether there is an identifiable legal entity acting as counterparty, how governance tokens are distributed, whether decision-making power can be attributed to a core team, and whether governance processes are transparent and onchain.",
      },
      { type: "heading", text: "4. The Curation Layer: CASP Reclassification Risk" },
      {
        type: "paragraph",
        text: "While the infrastructure layer may be outside MiCA's scope, the curation layer is a different matter entirely. Curators are identifiable entities. They have names, websites, founders. The question is whether what they do qualifies as a regulated crypto-asset service.",
      },
      {
        type: "paragraph",
        text: "Several centralization indicators might raise concern. Decision-making power concentrated in a single entity. An identifiable legal entity operating as a counterparty to depositors. Admin keys enabling unilateral modification of vault parameters. The ability to pause, upgrade, or redirect fund allocations. Fee structures suggesting a commercial, intermediary relationship.",
      },
      {
        type: "paragraph",
        text: "Under MiCA, three services might potentially be triggered: Custody and transfer of deposited crypto-assets within the vault. Portfolio management through discretionary allocation of third-party assets. And investment advisory through recommending or selecting markets on behalf of depositors.",
      },
      {
        type: "paragraph",
        text: "Stéphane Daniel's analysis suggests these services should likely not be qualified under MiCA, primarily because curators generally do not custody crypto-assets and do not operate with individualized relationships with depositors. Assets are self-custodied, users are public addresses, and there is no formal onboarding or KYC in permissionless settings.",
      },
      {
        type: "paragraph",
        text: "However, this remains a grey zone to be assessed on a case-by-case basis depending on the design of each vault and the legal structuring of each curator. It also has yet to be tested with regulators, and the landscape is evolving.",
      },
      {
        type: "paragraph",
        text: "The risk scenario is clear. A partially decentralized vault with an identifiable Curator who selects markets, sets parameters, and receives fees would, if reclassified as a CASP, trigger full MiCA compliance obligations including KYC/AML, asset segregation, prudential requirements, and governance rules.",
      },
      {
        type: "paragraph",
        text: "In practice, full KYC/AML compliance is the main issue. It is currently almost impossible, or at least not viable, to implement in retail permissionless DeFi markets.",
      },
      { type: "heading", text: "5. Three Structuring Strategies for Curators" },
      {
        type: "paragraph",
        text: "To mitigate legal risk, three complementary strategies are recommended. Combining them reduces the overall regulatory exposure for Curators and other vault actors.",
      },
      {
        type: "paragraph",
        text: "**Control Minimization (Technical Safeguards)**",
      },
      {
        type: "paragraph",
        text: "Timelock all strategic decisions to provide users with exit rights. Predefine allocation rules onchain to reduce discretion. Separate decision, execution, and control layers so that Curator, Allocator, Guardian, and Sentinel are distinct roles. Limit discretionary power to parameterization rather than allocation execution. Use multi-sig with independent, unaffiliated actors. Ensure transparent and onchain governance processes.",
      },
      {
        type: "paragraph",
        text: "**Legal Structuring (Jurisdictional Strategy)**",
      },
      {
        type: "paragraph",
        text: "Choose jurisdiction carefully. Establish clear terms and conditions governing the Curator-depositor relationship, specifying the Curator's role as non-custodial, without mandate or advisory function, and including disclaimers and limitations of liability. Document and enforce geofencing policies where applicable. Ensure marketing practices are consistent with all of the above.",
      },
      {
        type: "paragraph",
        text: "**Public Documentation (Transparency Framework)**",
      },
      {
        type: "paragraph",
        text: "Publish onchain strategy docs including allocation rules, market selection criteria, and rebalancing logic as verifiable data. Disclose all risk caps, collateral ratios, and liquidation thresholds in real time. Commission independent smart contract audits and publish full reports. Provide depositors with regular performance reports, fee breakdowns, and risk summaries. Clearly document all management, performance, and protocol fees before deposit.",
      },
      { type: "heading", text: "6. Regulatory Outlook" },
      {
        type: "paragraph",
        text: "The regulatory landscape for DeFi and Curated Vaults is evolving fast.",
      },
      {
        type: "paragraph",
        text: "Under Article 142 of MiCA, the European Commission is mandated to deliver a comprehensive report on DeFi, originally due by December 2024, still pending. This report may clarify what qualifies as “fully decentralised,” propose new legislative measures targeting DeFi protocols, and directly affect how Curated Vaults are classified.",
      },
      {
        type: "paragraph",
        text: "There is a window of influence. Regulatory frameworks are still being drafted, creating a rare opportunity to shape the rules before they crystallize. Protocols that demonstrate robust governance, transparency, and risk management set de facto industry standards. Proactive structuring now positions projects favorably for whatever regime emerges.",
      },
      {
        type: "paragraph",
        text: "**The following section is authored by the Fusion team.**",
      },
      { type: "heading", text: "How Fusion's Architecture Relates to This Framework" },
      {
        type: "paragraph",
        text: "Fusion is a modular onchain vault framework built on ERC-4626 compliant PlasmaVaults. The structuring principles outlined above describe what vault operators should aim for. Fusion's architecture provides the infrastructure to get there.",
      },
      {
        type: "paragraph",
        text: "**Control Minimization.** Role separation is enforced at the smart contract level: Owner, Atomist, Alpha, Fuse Manager, and Guardian are architecturally distinct. The actions a vault can take through them are gated by these roles and subject to timelocks, with full onchain visibility into current configuration and pending changes. Alpha execution operates exclusively within pre-defined, governance-approved boundaries. Multi-sig and KYC/blacklist capabilities are available at the vault level.",
      },
      {
        type: "paragraph",
        text: "**Public Documentation.** Fusion's vault architecture makes all fees, permissions, access roles, strategy flow maps, and contract addresses readable directly from the smart contracts, verifiable via any block explorer or custom front-end. Operators can surface this data through their own interfaces or third-party tools. All vault data is recorded onchain with full historical granularity, extractable down to a single block.",
      },
      {
        type: "paragraph",
        text: "**Legal Structuring.** How these capabilities are configured is a decision for each vault operator (Atomist), in consultation with their legal counsel.",
      },
      {
        type: "paragraph",
        text: "Fusion provides the tools. Lawyers like Stéphane Daniel from the law firm d&a partners provide the legal guidance to deploy them compliantly.",
      },
      { type: "heading", text: "About d&a partners" },
      {
        type: "paragraph",
        text: "d&a partners is a French law firm entirely dedicated to blockchain and crypto, with 17+ lawyers advising crypto-native projects, DeFi protocols, and institutional investors on EU regulation and MiCA implementation.",
      },
      {
        type: "paragraph",
        text: "Contact: s.daniel@dnapartners.fr | [dnapartners.fr](https://dnapartners.fr)",
      },
      { type: "heading", text: "About Fusion" },
      {
        type: "paragraph",
        text: "Developed by IPOR Labs AG (Zug, Switzerland), Fusion is the onchain vault infrastructure built for institutional-grade onchain yield strategies. Its modular architecture provides deterministic risk enforcement, per-client vault isolation, embedded compliance, and flexible configuration through composable modules called Fuses, integrated with leading DeFi protocols.",
      },
      {
        type: "paragraph",
        text: "For the curator community. If any of these structuring questions are part of your conversations, we'd value your perspective:",
      },
      {
        type: "paragraph",
        text: "@BlockAnalitica @bprotocoleth @flowdesk_co @galaxyhq @gauntlet_xyz @hyperithm @k3_capital @kpk_io @LlamaRisk @Rockaway_X @SentoraHQ @SteakhouseFi @keyrock @628Labs",
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

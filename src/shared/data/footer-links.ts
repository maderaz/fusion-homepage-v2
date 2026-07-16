interface FooterLink {
  label: string;
  href: string;
  soon?: boolean;
}

interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

const product: FooterLinkColumn = {
  title: "Product",
  links: [
    { label: "Fusion Vaults", href: "https://app.ipor.io/fusion" },
    { label: "Interest Rate Swaps", href: "https://app.ipor.io/swaps/ethereum" },
  ],
};

const organization: FooterLinkColumn = {
  title: "Organization",
  links: [
    { label: "Contact", href: "/contact" },
    { label: "Brand Kit", href: "/brand" },
  ],
};

const security: FooterLinkColumn = {
  title: "Security",
  links: [
    {
      label: "Audits",
      href: "https://docs.ipor.io/build-on-fusion/developer-guide/audits",
    },
    {
      label: "Bug Bounty",
      href: "https://immunefi.com/bug-bounty/ipor/information/",
    },
  ],
};

const governance: FooterLinkColumn = {
  title: "Governance",
  links: [
    { label: "Snapshot", href: "https://snapshot.org/#/s:ipordao.eth" },
    { label: "FUSN Token", href: "#", soon: true },
  ],
};

const developers: FooterLinkColumn = {
  title: "Developers",
  links: [
    { label: "Documentation", href: "https://docs.ipor.io/" },
    { label: "GitHub", href: "https://github.com/IPOR-Labs" },
    { label: "Python SDK", href: "https://github.com/IPOR-Labs/ipor-fusion.py" },
  ],
};

const articles: FooterLinkColumn = {
  title: "Articles",
  links: [{ label: "Institutional Vaults", href: "/institutional-vaults" }],
};

const community: FooterLinkColumn = {
  title: "Community",
  links: [
    { label: "X / Twitter", href: "https://x.com/ipor_io" },
    { label: "Discord", href: "https://discord.com/invite/bSKzq6UMJ3" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/73049136/" },
    { label: "Medium Blog", href: "https://blog.ipor.io/" },
  ],
};

/**
 * Four visual columns; each column stacks one or two category groups
 * (Fireblocks-style dense footer).
 */
export const footerColumns: FooterLinkColumn[][] = [
  [product, organization],
  [security, governance],
  [developers, articles],
  [community],
];

/** Legal links shown in the bottom bar. */
export const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

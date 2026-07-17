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

/**
 * Four visual columns; each column stacks one or two category groups
 * (Fireblocks-style dense footer). Community lives as social icons in the
 * brand block, so Articles takes the fourth column.
 */
export const footerColumns: FooterLinkColumn[][] = [
  [product, organization],
  [security, governance],
  [developers],
  [articles],
];

/** Legal links shown in the bottom bar. */
export const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

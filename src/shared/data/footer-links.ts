interface FooterLink {
  label: string;
  href: string;
  soon?: boolean;
}

interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

export const linkColumns: FooterLinkColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Fusion Vaults", href: "https://app.ipor.io/fusion" },
      {
        label: "Interest Rate Swaps",
        href: "https://app.ipor.io/swaps/ethereum",
      },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Snapshot", href: "https://snapshot.org/#/s:ipordao.eth" },
      { label: "FUSN Token", href: "#", soon: true },
    ],
  },
  {
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
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "https://docs.ipor.io/" },
      { label: "GitHub", href: "https://github.com/IPOR-Labs" },
      {
        label: "Python SDK",
        href: "https://github.com/IPOR-Labs/ipor-fusion.py",
      },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X / Twitter", href: "https://x.com/ipor_io" },
      {
        label: "Discord",
        href: "https://discord.com/invite/bSKzq6UMJ3",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/73049136/",
      },
      { label: "Medium Blog", href: "https://blog.ipor.io/" },
    ],
  },
  {
    title: "Recommended Reading",
    links: [
      { label: "Institutional Vaults", href: "/institutional-vaults" },
    ],
  },
  {
    title: "Organization",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Brand Kit", href: "/brand" },
    ],
  },
];

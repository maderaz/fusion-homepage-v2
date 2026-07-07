import {
  VaultLayersIcon,
  EnergyBoltIcon,
  ShieldPulseIcon,
  NetworkNodesIcon,
  ChartPulseIcon,
} from "@/sites/fusion/app/components/ui/fusion-icons";
import { GlowingEffect } from "@/sites/fusion/app/components/ui/glowing-effect";
import { cn } from "@/sites/fusion/app/components/ui/utils";

const benefits = [
  {
    area: "md:col-span-1",
    icon: <VaultLayersIcon size={22} />,
    title: "Modular Vault Architecture",
    description:
      "Compose strategies from reusable building blocks. Mix lending, staking, and LP positions in a single vault with full atomicity.",
  },
  {
    area: "md:col-span-1",
    icon: <EnergyBoltIcon size={22} />,
    title: "Efficient Off-Chain Execution",
    description:
      "Alpha engines execute strategy logic off-chain and batch operations onchain through governance-approved parameters, minimizing transaction overhead while maintaining full transparency.",
  },
  {
    area: "md:col-span-1",
    icon: <ShieldPulseIcon size={22} />,
    title: "Institutional-Grade Risk Controls",
    description:
      "Real-time exposure monitoring, Guardian roles for emergency actions, and configurable market limits ensure capital protection at every layer of the stack.",
  },
  {
    area: "md:col-span-1",
    icon: <NetworkNodesIcon size={22} />,
    title: "Multi-Chain Execution",
    description:
      "Deploy identical strategies across Ethereum, Arbitrum, Base, and Unichain from a single interface with unified reporting.",
  },
  {
    area: "md:col-span-2",
    icon: <ChartPulseIcon size={22} />,
    title: "Transparent Performance Analytics",
    description:
      "On-chain verifiable P&L, historical NAV tracking, and strategy attribution, all visible on the Fusion dashboard and verifiable directly from smart contracts.",
  },
];

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function GridItem({ area, icon, title, description }: GridItemProps) {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[1.5px] border-primary/15 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={1.5}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-primary/15 bg-card p-6 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-sm dark:shadow-primary/5 md:p-6">
          <div className="relative flex flex-1 flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-[0.75px] border-border bg-secondary text-primary">
              {icon}
            </div>
            <div className="space-y-3">
              <h3
                className="text-balance font-semibold text-foreground"
                style={{
                  fontSize: "18px",
                  lineHeight: "1.3",
                }}
              >
                {title}
              </h3>
              <p
                className="text-[14px] text-muted-foreground md:text-[15px]"
                style={{
                  lineHeight: "1.6",
                }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Benefits() {
  return (
    <section id="benefits" className="relative bg-muted py-8 md:py-20">
      {/* Section header */}
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 max-w-2xl">
          {/* Left: Title + Description */}
          <div className="flex flex-col items-start justify-center">
            <div className="mb-4 text-[13px] font-medium uppercase tracking-wide text-primary">
              Why Fusion
            </div>
            <h2
              className="mb-5 text-balance font-medium text-foreground"
              style={{
                fontSize: "clamp(25px, 5vw, 45px)",
                lineHeight: "clamp(38px, 5vw, 60px)",
              }}
            >
              Infrastructure that enforces your{" "}
              <span className="text-primary">edge</span>.
            </h2>
            <p
              className="max-w-lg text-lg text-muted-foreground"
              style={{
                lineHeight: 1.7,
              }}
            >
              Every component of Fusion is designed for asset managers who need
              performance, transparency, and composability at institutional
              scale.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {benefits.map((b) => (
            <GridItem
              key={b.title}
              area={b.area}
              icon={b.icon}
              title={b.title}
              description={b.description}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

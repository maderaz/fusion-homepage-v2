import { motion } from "motion/react";
import { cn } from "@/sites/fusion/app/components/ui/utils";
import { useTheme } from "@/shared/components/use-theme";

interface FlowIcons {
  aave: string;
  euler: string;
  morphoDark: string;
  morphoLight: string;
  usdc: string;
  fusionLight: string;
}

interface FusionFlowProps {
  className?: string;
  icons: FlowIcons;
}

const FUSES = ["Morpho", "Aave", "Euler"];
const ACTIONS = ["Swap", "Loop", "Harvest", "Flashloan"];
const SVG_WIDTH = 420;
const SVG_HEIGHT = 44;
const GRID_GAP = 12;

function computeFuseCenters(count: number): number[] {
  if (count === 0) return [];
  const colWidth = (SVG_WIDTH - (count - 1) * GRID_GAP) / count;
  const centers: number[] = [];
  for (let i = 0; i < count; i++) {
    centers.push(i * (colWidth + GRID_GAP) + colWidth / 2);
  }
  return centers;
}

function buildBranchPath(targetX: number): string {
  const startX = SVG_WIDTH / 2;
  const midY = 20;
  const curveRadius = 8;

  if (Math.abs(targetX - startX) < 1) {
    return `M ${startX} 0 L ${startX} ${SVG_HEIGHT}`;
  }

  const curveDir = targetX < startX ? -1 : 1;
  const qEndX = startX + curveDir * curveRadius;

  return `M ${startX} 0 L ${startX} ${midY - curveRadius} Q ${startX} ${midY} ${qEndX} ${midY} L ${targetX} ${midY} L ${targetX} ${SVG_HEIGHT}`;
}

// Primary purple oklch base (for alpha variants in gradients/shadows)
const PRIMARY_OKLCH = "0.551 0.278 293.978";

const FusionFlow = ({ className, icons }: FusionFlowProps) => {
  const { isDark } = useTheme();

  // Compute centers for all columns (including "Add New")
  const allCenters = computeFuseCenters(FUSES.length + 1);

  const dotDelayBase = 1.7;
  const dotDelayStep = 0.6;
  const dotDuration = 3.25;
  const dotRepeatDelay = 1.5;
  const cycleDuration = dotDuration + dotRepeatDelay;

  return (
    <div
      className={cn("relative flex flex-col items-center", className)}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── DEPOSIT BADGE ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2"
      >
        <img
          src={icons.usdc}
          alt="USDC"
          className="h-4 w-4 rounded-full"
          loading="lazy"
        />
        <span className="text-[13px] font-semibold text-foreground">
          Deposit
        </span>
      </motion.div>

      {/* ── LINE: Deposit → Vault ── */}
      <div className="relative h-16 w-px bg-primary">
        <motion.div
          className="absolute top-0 left-0 w-full bg-primary"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary"
          style={{ boxShadow: "0 0 8px var(--primary)" }}
          animate={{ top: ["-6px", "calc(100% + 6px)"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
      </div>

      {/* ── VAULT CORE ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 150, height: 150 }}
      >
        {[150, 115, 85].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-2xl"
            style={{
              width: size,
              height: size,
              left: (150 - size) / 2,
              top: (150 - size) / 2,
              border: `1px solid oklch(${PRIMARY_OKLCH} / ${isDark ? 0.2 : 0.12})`,
              background: `radial-gradient(circle, oklch(${PRIMARY_OKLCH} / ${isDark ? 0.04 : 0.03}) 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.03, 1, 0.97, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute z-10"
          style={{
            width: 42,
            height: 42,
            left: (150 - 42) / 2,
            top: (150 - 42) / 2,
          }}
        >
          <img
            src={icons.fusionLight}
            alt="Fusion"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </motion.div>
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 text-[13px] font-semibold text-foreground"
      >
        Fusion Vault
      </motion.span>

      {/* ── LINE: Vault → Alpha Engine ── */}
      <div className="relative h-10 w-px bg-primary">
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary"
          style={{ boxShadow: "0 0 8px var(--primary)" }}
          animate={{ top: ["-6px", "calc(100% + 6px)"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 1.1,
          }}
        />
      </div>

      {/* ── ALPHA ENGINE BOX ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="relative w-full max-w-[420px] rounded-xl border border-border bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-[13px] font-semibold text-foreground">
            Alpha Engine
          </span>
        </div>

        {/* ── ACTION BADGES (static, centered) ── */}
        <div className="flex flex-wrap justify-center gap-2">
          {ACTIONS.map((action, i) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5"
            >
              <ActionIcon action={action} color="var(--primary)" />
              <span className="text-[12px] font-medium text-muted-foreground">
                {action}
              </span>
            </motion.div>
          ))}
          {/* Add action pill (decorative) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.2 + ACTIONS.length * 0.1 }}
            className="flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5"
            style={{
              borderColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.12)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span className="text-[12px] font-medium text-muted-foreground">
              Add
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── BRANCHING SVG: Alpha Engine → Fuses ── */}
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full max-w-[420px]"
        fill="none"
      >
        {allCenters.map((cx, i) => {
          const path = buildBranchPath(cx);
          const startX = SVG_WIDTH / 2;
          const midY = 20;
          const isFuse = i < FUSES.length;
          const delay = dotDelayBase + i * dotDelayStep;

          return (
            <g key={`branch-${i}`}>
              <motion.path
                d={path}
                stroke="var(--primary)"
                strokeWidth="1"
                fill="none"
                strokeDasharray={!isFuse ? "4 3" : undefined}
                strokeOpacity={!isFuse ? 0.4 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              />
              {isFuse && (
                <motion.circle
                  r="3"
                  fill="var(--primary)"
                  style={{ filter: "drop-shadow(0 0 4px var(--primary))" }}
                  initial={{ opacity: 0 }}
                  animate={{
                    cy: [0, midY, midY, SVG_HEIGHT],
                    cx: [startX, startX, cx, cx],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: dotDuration,
                    repeat: Infinity,
                    repeatDelay: dotRepeatDelay,
                    delay,
                    times: [0, 0.4, 0.7, 1],
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* ── PROTOCOL FUSES (static) ── */}
      <div
        className="grid w-full max-w-[420px] gap-3"
        style={{ gridTemplateColumns: `repeat(${FUSES.length + 1}, 1fr)` }}
      >
        {FUSES.map((fuse, i) => {
          const highlightDelay = dotDelayBase + i * dotDelayStep;

          return (
            <motion.div
              key={fuse}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                borderColor: isDark
                  ? [
                      "oklch(0.313 0.012 264.395)",
                      "oklch(0.313 0.012 264.395)",
                      `oklch(${PRIMARY_OKLCH} / 0.5)`,
                      "oklch(0.313 0.012 264.395)",
                    ]
                  : [
                      "var(--border)",
                      "var(--border)",
                      `oklch(${PRIMARY_OKLCH} / 0.5)`,
                      "var(--border)",
                    ],
                boxShadow: [
                  `0 0 0px oklch(${PRIMARY_OKLCH} / 0)`,
                  `0 0 0px oklch(${PRIMARY_OKLCH} / 0)`,
                  `0 0 20px oklch(${PRIMARY_OKLCH} / 0.4)`,
                  `0 0 0px oklch(${PRIMARY_OKLCH} / 0)`,
                ],
              }}
              transition={{
                opacity: { duration: 0.4, delay: 1.8 + i * 0.1 },
                y: { duration: 0.4, delay: 1.8 + i * 0.1 },
                borderColor: {
                  duration: cycleDuration,
                  delay: highlightDelay,
                  repeat: Infinity,
                  times: [0, 0.65, 0.72, 1],
                },
                boxShadow: {
                  duration: cycleDuration,
                  delay: highlightDelay,
                  repeat: Infinity,
                  times: [0, 0.65, 0.72, 1],
                },
              }}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3"
            >
              <FuseIcon protocol={fuse} isDark={isDark} icons={icons} />
              <span className="text-center text-[11px] font-medium text-muted-foreground">
                {fuse}
              </span>
            </motion.div>
          );
        })}
        {/* Add New fuse block (decorative) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 2.1 }}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3"
          style={{
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span className="text-center text-[11px] font-medium text-muted-foreground">
            Add New
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default FusionFlow;

/* ── Action Icons ── */
function ActionIcon({ action, color }: { action: string; color: string }) {
  const props = {
    width: 12,
    height: 12,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (action) {
    case "Swap":
      return (
        <svg {...props}>
          <path d="M16 3l4 4-4 4" />
          <path d="M20 7H8" />
          <path d="M8 21l-4-4 4-4" />
          <path d="M4 17h12" />
        </svg>
      );
    case "Loop":
      return (
        <svg {...props}>
          <path d="M21 12a9 9 0 1 1-3.2-6.85" />
          <path d="M21 3v6h-6" />
        </svg>
      );
    case "Harvest":
      return (
        <svg {...props}>
          <path d="M12 22V10" />
          <path d="M6 14c0-4.418 2.686-8 6-8" />
          <path d="M18 14c0-4.418-2.686-8-6-8" />
          <circle cx="12" cy="5" r="2" />
        </svg>
      );
    case "Flashloan":
      return (
        <svg {...props}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Protocol Fuse Icons ── */
function FuseIcon({
  protocol,
  isDark,
  icons,
}: {
  protocol: string;
  isDark: boolean;
  icons: FlowIcons;
}) {
  const iconMap: Record<string, string> = {
    Morpho: isDark ? icons.morphoDark : icons.morphoLight,
    Aave: icons.aave,
    Euler: icons.euler,
  };
  const src = iconMap[protocol];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={protocol}
      className="h-[22px] w-[22px] object-contain"
      loading="lazy"
    />
  );
}

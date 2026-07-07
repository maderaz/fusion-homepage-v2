import { motion } from "motion/react";
import { cn } from "@/sites/fusion/app/components/ui/utils";

interface FusionIconProps {
  size?: number;
  className?: string;
}

/* ─── VAULT LAYERS ─── stacked layers with floating effect */
export function VaultLayersIcon({ size = 48, className }: FusionIconProps) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Bottom layer */}
      <motion.path
        d="M8 32l16 8 16-8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.3}
        animate={{ y: [0, 1, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      {/* Middle layer */}
      <motion.path
        d="M8 26l16 8 16-8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        animate={{ y: [0, -1, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      {/* Top layer - filled */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M8 20l16 8 16-8-16-8z" fill="currentColor" opacity={0.12} />
        <path
          d="M8 20l16 8 16-8-16-8z"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
      {/* Pulse glow */}
      <motion.circle
        cx="24"
        cy="20"
        r="3"
        fill="currentColor"
        opacity={0}
        animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

/* ─── ENERGY BOLT ─── pulsing lightning bolt */
export function EnergyBoltIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Glow */}
      <motion.path
        d="M26 6L14 26h10l-4 16 16-22H26l4-14z"
        fill="currentColor"
        opacity={0}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bolt */}
      <motion.path
        d="M26 6L14 26h10l-4 16 16-22H26l4-14z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ strokeOpacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Sparks */}
      {[
        { cx: 10, cy: 18, d: 0 },
        { cx: 38, cy: 22, d: 0.5 },
        { cx: 14, cy: 36, d: 1 },
      ].map((s) => (
        <motion.circle
          key={`${s.cx}-${s.cy}`}
          cx={s.cx}
          cy={s.cy}
          r="1.5"
          fill="currentColor"
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: s.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/* ─── SHIELD PULSE ─── shield with animated check and pulse ring */
export function ShieldPulseIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Pulse ring */}
      <motion.path
        d="M24 4L8 12v12c0 10.5 6.8 16.3 16 20 9.2-3.7 16-9.5 16-20V12L24 4z"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0}
        animate={{ opacity: [0, 0.3, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 24px" }}
      />
      {/* Shield body */}
      <path
        d="M24 6L10 13v11c0 9.5 6 14.7 14 18 8-3.3 14-8.5 14-18V13L24 6z"
        fill="currentColor"
        opacity={0.08}
      />
      <path
        d="M24 6L10 13v11c0 9.5 6 14.7 14 18 8-3.3 14-8.5 14-18V13L24 6z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Checkmark */}
      <motion.path
        d="M17 24l5 5 9-10"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── NETWORK NODES ─── connected multi-chain nodes */
export function NetworkNodesIcon({ size = 48, className }: FusionIconProps) {
  const nodes = [
    { cx: 24, cy: 12 },
    { cx: 12, cy: 28 },
    { cx: 36, cy: 28 },
    { cx: 24, cy: 38 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [1, 2],
  ];

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a]!.cx}
          y1={nodes[a]!.cy}
          x2={nodes[b]!.cx}
          y2={nodes[b]!.cy}
          stroke="currentColor"
          strokeWidth={1.5}
          opacity={0.3}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Data pulse on edges */}
      {edges.map(([a, b], i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="2"
          fill="currentColor"
          animate={{
            cx: [nodes[a]!.cx, nodes[b]!.cx],
            cy: [nodes[a]!.cy, nodes[b]!.cy],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r="5"
            fill="currentColor"
            opacity={0.12}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          />
          <circle
            cx={n.cx}
            cy={n.cy}
            r="4"
            stroke="currentColor"
            strokeWidth={2}
          />
          <circle cx={n.cx} cy={n.cy} r="1.5" fill="currentColor" />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── CHART PULSE ─── animated analytics line chart */
export function ChartPulseIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Grid lines */}
      {[20, 26, 32, 38].map((y) => (
        <line
          key={y}
          x1="8"
          y1={y}
          x2="40"
          y2={y}
          stroke="currentColor"
          strokeWidth={0.5}
          opacity={0.2}
        />
      ))}
      {/* Chart area fill */}
      <motion.path
        d="M8 36 L14 28 L20 30 L26 18 L32 22 L38 10 L40 10 L40 38 L8 38 Z"
        fill="currentColor"
        opacity={0}
        animate={{ opacity: [0, 0.08, 0.08] }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      {/* Chart line */}
      <motion.path
        d="M8 36 L14 28 L20 30 L26 18 L32 22 L38 10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      {/* Pulse dot at end */}
      <motion.circle
        cx="38"
        cy="10"
        r="3"
        fill="currentColor"
        opacity={0}
        animate={{ opacity: [0, 0.5, 0], scale: [0.5, 2, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx="38"
        cy="10"
        r="3"
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      />
      {/* Data points */}
      {[
        { cx: 14, cy: 28 },
        { cx: 20, cy: 30 },
        { cx: 26, cy: 18 },
        { cx: 32, cy: 22 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="2"
          fill="currentColor"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.35, duration: 0.3 }}
        />
      ))}
    </svg>
  );
}

/* ─── INSTITUTION ─── animated pillars/columns */
export function InstitutionIcon({ size = 48, className }: FusionIconProps) {
  const pillars = [14, 21, 28, 35];
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Roof */}
      <motion.path
        d="M24 8L8 18h32L24 8z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.08}
        animate={{ y: [0, -0.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Pillars */}
      {pillars.map((x, i) => (
        <motion.rect
          key={x}
          x={x - 2}
          y={20}
          width={3}
          height={14}
          rx={1}
          stroke="currentColor"
          strokeWidth={1.5}
          fill="currentColor"
          fillOpacity={0.06}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Base */}
      <line
        x1="8"
        y1="36"
        x2="40"
        y2="36"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Glow at top */}
      <motion.circle
        cx="24"
        cy="12"
        r="4"
        fill="currentColor"
        opacity={0}
        animate={{ opacity: [0, 0.25, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── BUILDER COG ─── rotating gear with wrench */
export function BuilderCogIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Outer gear teeth */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="22"
            y="6"
            width="4"
            height="6"
            rx="1"
            fill="currentColor"
            opacity={0.3}
            style={{
              transformOrigin: "24px 24px",
              transform: `rotate(${deg}deg)`,
            }}
          />
        ))}
      </motion.g>
      {/* Outer ring */}
      <motion.circle
        cx="24"
        cy="24"
        r="12"
        stroke="currentColor"
        strokeWidth={2}
        animate={{ rotate: -360 }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      />
      {/* Inner ring */}
      <circle
        cx="24"
        cy="24"
        r="6"
        stroke="currentColor"
        strokeWidth={1.5}
        opacity={0.6}
      />
      {/* Center dot */}
      <motion.circle
        cx="24"
        cy="24"
        r="2.5"
        fill="currentColor"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── LIQUIDITY DROP ─── animated flowing droplet */
export function LiquidityDropIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Drop body */}
      <motion.path
        d="M24 6C24 6 12 22 12 30a12 12 0 0024 0c0-8-12-24-12-24z"
        fill="currentColor"
        opacity={0.1}
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M24 6C24 6 12 22 12 30a12 12 0 0024 0c0-8-12-24-12-24z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Internal ripples */}
      <motion.ellipse
        cx="24"
        cy="32"
        rx="6"
        ry="2"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0}
        animate={{ opacity: [0, 0.5, 0], ry: [1, 3, 1], rx: [4, 7, 4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="24"
        cy="32"
        rx="3"
        ry="1"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0}
        animate={{ opacity: [0, 0.4, 0], ry: [0.5, 2, 0.5], rx: [2, 5, 2] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      {/* Shine */}
      <motion.path
        d="M20 24c0-4 2-8 4-12"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.15}
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── PLUG CONNECT ─── animated connection plug */
export function PlugConnectIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Left plug */}
      <motion.g
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect
          x="6"
          y="18"
          width="14"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth={2}
        />
        <line
          x1="20"
          y1="22"
          x2="24"
          y2="22"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="26"
          x2="24"
          y2="26"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx="12" cy="24" r="2" fill="currentColor" opacity={0.4} />
      </motion.g>
      {/* Right plug */}
      <motion.g
        animate={{ x: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect
          x="28"
          y="18"
          width="14"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth={2}
        />
        <line
          x1="24"
          y1="22"
          x2="28"
          y2="22"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="26"
          x2="28"
          y2="26"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx="36" cy="24" r="2" fill="currentColor" opacity={0.4} />
      </motion.g>
      {/* Connection spark */}
      <motion.g
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        <motion.circle
          cx="24"
          cy="24"
          r="4"
          fill="currentColor"
          opacity={0.3}
          animate={{ scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
    </svg>
  );
}

/* ─── FUSE MODULE ─── snap-in module connector (for comparison table) */
export function FuseModuleIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Module body */}
      <rect
        x="10"
        y="14"
        width="28"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth={2}
        fill="currentColor"
        fillOpacity={0.06}
      />
      {/* Snap connectors top */}
      {[18, 24, 30].map((x, i) => (
        <motion.rect
          key={`t-${x}`}
          x={x - 2}
          y={8}
          width={4}
          height={6}
          rx={1}
          fill="currentColor"
          opacity={0.5}
          animate={{ y: [0, -2, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Snap connectors bottom */}
      {[18, 24, 30].map((x, i) => (
        <motion.rect
          key={`b-${x}`}
          x={x - 2}
          y={34}
          width={4}
          height={6}
          rx={1}
          fill="currentColor"
          opacity={0.5}
          animate={{ y: [0, 2, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Internal circuit lines */}
      <motion.path
        d="M16 24h4l2-4 2 8 2-4h6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── TRANSPARENCY EYE ─── animated eye/lens for onchain transparency */
export function TransparencyEyeIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Eye outline */}
      <path
        d="M4 24s8-12 20-12 20 12 20 12-8 12-20 12S4 24 4 24z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.05}
      />
      {/* Iris */}
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth={2} />
      <circle cx="24" cy="24" r="7" fill="currentColor" opacity={0.1} />
      {/* Pupil */}
      <motion.circle
        cx="24"
        cy="24"
        r="3"
        fill="currentColor"
        animate={{ scale: [1, 0.7, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Scan line */}
      <motion.line
        x1="24"
        y1="12"
        x2="24"
        y2="36"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0}
        animate={{ opacity: [0, 0.6, 0], x1: [16, 32, 16], x2: [16, 32, 16] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── SPEED GAUGE ─── animated speedometer */
export function SpeedGaugeIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Arc */}
      <path
        d="M10 34a16 16 0 0128 0"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        fill="none"
      />
      {/* Tick marks */}
      {[-60, -30, 0, 30, 60].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="10"
          x2="24"
          y2="13"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          opacity={0.4}
          style={{
            transformOrigin: "24px 34px",
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}
      {/* Needle — base fixed, tip sweeps */}
      <motion.line
        x1="24"
        y1="34"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        animate={{
          x2: [10.2, 37.8, 10.2],
          y2: [22.4, 22.4, 22.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Center highlight dot */}
    </svg>
  );
}

/* ─── LOCK SECURE ─── animated padlock */
export function LockSecureIcon({ size = 48, className }: FusionIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("", className)}
      style={{ width: size, height: size }}
    >
      {/* Lock body */}
      <rect
        x="12"
        y="22"
        width="24"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth={2}
        fill="currentColor"
        fillOpacity={0.08}
      />
      {/* Shackle */}
      <motion.path
        d="M16 22v-6a8 8 0 0116 0v6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Keyhole */}
      <circle cx="24" cy="30" r="3" fill="currentColor" opacity={0.6} />
      <rect
        x="23"
        y="32"
        width="2"
        height="4"
        rx="1"
        fill="currentColor"
        opacity={0.6}
      />
      {/* Pulse */}
      <motion.circle
        cx="24"
        cy="30"
        r="6"
        stroke="currentColor"
        strokeWidth={1}
        opacity={0}
        animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 30px" }}
      />
    </svg>
  );
}

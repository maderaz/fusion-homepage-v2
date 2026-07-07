import {
  InstitutionIcon,
  BuilderCogIcon,
  LiquidityDropIcon,
  PlugConnectIcon,
  ShieldPulseIcon,
  TransparencyEyeIcon,
  SpeedGaugeIcon,
  FuseModuleIcon,
  LockSecureIcon,
  NetworkNodesIcon,
  VaultLayersIcon,
  EnergyBoltIcon,
  ChartPulseIcon,
} from "./fusion-icons";

const icons: Record<string, React.ComponentType<{ size: number }>> = {
  institution: InstitutionIcon,
  builder: BuilderCogIcon,
  liquidity: LiquidityDropIcon,
  plug: PlugConnectIcon,
  shield: ShieldPulseIcon,
  transparency: TransparencyEyeIcon,
  speed: SpeedGaugeIcon,
  fuse: FuseModuleIcon,
  lock: LockSecureIcon,
  network: NetworkNodesIcon,
  vault: VaultLayersIcon,
  energy: EnergyBoltIcon,
  chart: ChartPulseIcon,
};

export function IconIsland({ name, size }: { name: string; size: number }) {
  const Icon = icons[name];
  return Icon ? <Icon size={size} /> : null;
}

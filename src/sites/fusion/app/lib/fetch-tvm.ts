const API_URL = "https://api.ipor.io/dapp/plasma-vaults-list";

interface PlasmaVault {
  address: string;
  chainId: number;
  tvmUsd_18: string;
  assetSymbol: string;
}

interface PlasmaVaultsListResponse {
  timestamp: string;
  plasmaVaults: PlasmaVault[];
}

export interface TvmData {
  tvmFormatted: string;
  vaultCount: number;
}

export async function fetchTvm(): Promise<TvmData> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data: PlasmaVaultsListResponse = await response.json();

  const vaults = data.plasmaVaults;
  const totalTvmUsd18 = vaults.reduce(
    (sum, vault) => sum + BigInt(vault.tvmUsd_18),
    0n,
  );
  const whole = Number(totalTvmUsd18 / 10n ** 18n);

  return {
    tvmFormatted: formatCompactUsd(whole),
    vaultCount: vaults.length,
  };
}

function formatCompactUsd(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `$${b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${value}`;
}

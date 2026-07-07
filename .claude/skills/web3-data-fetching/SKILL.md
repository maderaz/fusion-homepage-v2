---
name: web3-data-fetching
description: Architecture patterns for efficient data fetching in web3/DeFi frontends. Use when writing data hooks, fetching blockchain data, refactoring React Query usage, or refactoring current onchain data fetching. Implements fetch-mapper-hook pattern to avoid hook complexity and performance issues.
---

# Web3 Data Fetching Architecture

This skill documents the Fetch → Mapper → Hook pattern for efficient blockchain data fetching. Based on lessons from scaling DeFi frontends with hundreds of vaults and markets.

## Core Problem

Web3 frontends must do what backends do in web2: compute derived state, join data sources, and format values. This leads to:

- Massive nested hooks
- Too many `useQuery` calls
- Broken loading/error states
- `useMemo` everywhere
- Unpredictable re-renders

## The Solution: Fetch → Mapper → UI

Three layers separate concerns:

1. Fetchers (RPC/Network + Cache) - Use `queryClient.fetchQuery()`, never hooks. Avoids unnecessary reactivity and allows natural iteration (loops, maps) without React constraints.
2. Mappers (Business Logic) - Pure async functions that compose fetchers with `Promise.all`. Acts as a "mini UI cache layer" where heavy formatting executes once per cache window.
3. UI (Dumb Components) - Single `useQuery` wrapping the mapper. Components receive pre-formatted data with no domain logic responsibilities.

## Cache Strategy

Two-level caching approach:

Fetcher level (per data type):

- `staleTime: Infinity` - Static data (decimals, symbols, names)
- `staleTime: 30 * 60 * 1000` - Semi-static data (owner, config)
- `staleTime: 60 * 1000` - Volatile data (balances, prices)

UI level (per feature):

- `staleTime: 15_000` to `60_000` - Mapper results cached 15-60 seconds
- Heavy formatting, expensive maps, number reductions execute once per window
- Prevents re-render storms even when multiple components consume same data

## Quick Start

Fetch function (with caching):

```typescript
export const getOwnerQueryOptions = (
  vaultAddress: Address,
  chainId: number,
) => ({
  ...readContractQueryOptions(config, {
    abi: vaultAbi,
    address: vaultAddress,
    chainId,
    functionName: "owner",
  }),
  staleTime: 30 * 60 * 1000, // Cache for 30 minutes
});

export async function fetchOwner(vaultAddress: Address, chainId: number) {
  return queryClient.fetchQuery(getOwnerQueryOptions(vaultAddress, chainId));
}
```

Mapper function (composes fetchers):

```typescript
async function mapVaultDetails(vaultAddress: Address, account: Address) {
  const vault = await fetchVault(vaultAddress);
  if (!vault) throw new Error("Vault not found");

  const [netAssetValue, apy, owner] = await Promise.all([
    fetchNetAssetValue({ account, vaultAddress }),
    fetchApy({ vaultAddress }),
    fetchOwner(vaultAddress, vault.chainId),
  ]);

  return { vault, netAssetValue, apy, owner };
}
```

UI Hook (dumb component receives pre-formatted data):

```typescript
export function useVaultDetails(vaultAddress: Address, account: Address) {
  return useQuery({
    queryKey: ["vault-details", vaultAddress, account],
    queryFn: () => mapVaultDetails(vaultAddress, account),
    enabled: Boolean(vaultAddress && account),
    staleTime: 30_000, // UI cache: mapper runs once per 30 seconds
  });
}
```

## When to Use This Pattern

Use fetch-mapper-hook when:

- Data requires multiple chain calls
- Values depend on each other
- You need derived/computed state
- Loading states must be unified

## Reference Files

For detailed patterns and examples: See [patterns.md](patterns.md)

For anti-patterns to avoid: See [anti-patterns.md](anti-patterns.md)

## Key Benefits

- Debuggable: Plain async functions with clear control flow
- Predictable: Single loading/error state per feature
- Performant: Caching at fetch level, not hook level
- Scalable: Add fetchers without hook complexity
- Maintainable: Changes require touching fewer files

# Fetch-Mapper-UI Patterns

Detailed patterns and examples for the three-layer architecture.

## Layer 1: Fetchers (RPC/Network + Cache)

Fetchers retrieve and cache individual data pieces using `queryClient.fetchQuery()`.

Critical rule: Never use hooks in this layer. Using `queryClient.fetchQuery()` instead of `useQuery` provides:

- No unnecessary reactivity triggering re-renders
- Natural iteration with loops and maps (impossible with hooks)
- Composability in mapper functions
- Centralized caching preventing duplicate RPC calls

### Basic Fetch Function

```typescript
import { queryClient } from "app/query-client";
import { config } from "app/AppWagmiProvider";
import { readContractQueryOptions } from "wagmi/query";

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
  staleTime: 30 * 60 * 1000, // 30 minutes - adjust based on data volatility
});

export async function fetchOwner(vaultAddress: Address, chainId: number) {
  return queryClient.fetchQuery(getOwnerQueryOptions(vaultAddress, chainId));
}
```

### Fetch Function with Transform

```typescript
export async function fetchVaultBalance(args: {
  vaultAddress: Address;
  account: Address;
  chainId: number;
}) {
  const rawBalance = await queryClient.fetchQuery({
    queryKey: ["vault-balance", args.vaultAddress, args.account],
    queryFn: async () => {
      const result = await readContract(config, {
        abi: erc20Abi,
        address: args.vaultAddress,
        functionName: "balanceOf",
        args: [args.account],
        chainId: args.chainId,
      });
      return result;
    },
    staleTime: 60 * 1000, // 1 minute for balance data
  });

  return rawBalance;
}
```

### Cache Duration Guidelines

```typescript
// Immutable data (never changes for a given address)
staleTime: Infinity,
// Examples: decimals, symbol, name, address

// Static data (rarely changes)
staleTime: 30 * 60 * 1000, // 30 minutes
// Examples: owner, vault config

// Semi-static data
staleTime: 5 * 60 * 1000, // 5 minutes
// Examples: total supply, APY calculations

// Dynamic data (changes frequently)
staleTime: 60 * 1000, // 1 minute
// Examples: balances, prices

// Real-time data
staleTime: 0, // Always refetch
// Examples: pending transactions, live rates
```

Fetch decimals forever, cache balance for one minute — regardless of how many components call it.

## Layer 2: Mappers (Business Logic & Data Shaping)

Mappers are pure async functions that compose fetchers and compute derived state.

The mapper acts as a "mini UI cache layer":

- Heavy formatting executes once per cache window (15-60 seconds)
- Expensive maps and number reductions run once, not on every render
- Symbol/sign parsing happens once
- Multiple components consuming same data share the cached result

Because mappers are plain JavaScript functions (not hooks), you can:

- Use if/else statements naturally
- Iterate with for loops and .map()
- Handle conditional logic without enabled flags
- Throw errors with clear failure paths

### Basic Mapper

```typescript
async function mapVaultDetails(args: {
  vaultAddress: Address;
  account: Address;
  chainId: number;
}) {
  const { vaultAddress, account, chainId } = args;

  // Sequential fetch when data depends on previous result
  const vault = await fetchVault(vaultAddress, chainId);
  if (!vault) throw new Error("Vault not found");

  // Parallel fetch for independent data
  const [balance, apy, owner] = await Promise.all([
    fetchVaultBalance({ vaultAddress, account, chainId }),
    fetchApy({ vaultAddress, chainId }),
    fetchOwner(vaultAddress, chainId),
  ]);

  // Compute derived state
  return {
    vault,
    balance,
    apy,
    owner,
    isOwner: owner === account,
    formattedBalance: formatUnits(balance, vault.decimals),
  };
}
```

### Mapper with Conditional Logic

```typescript
async function mapVaultWithVerification(args: {
  vaultAddress: Address;
  chainId: number;
}) {
  const isVerified = await fetchIsVerified(args.vaultAddress);

  // Clear failure path using if statements
  if (!isVerified) {
    throw new Error("Vault is not verified");
  }

  const vault = await fetchVault(args.vaultAddress, args.chainId);
  if (!vault) {
    throw new Error("Vault not found");
  }

  // Continue with verified vault
  const [markets, allocations] = await Promise.all([
    fetchVaultMarkets(args.vaultAddress),
    fetchVaultAllocations(args.vaultAddress),
  ]);

  return { vault, markets, allocations };
}
```

### Mapper Combining Backend and Onchain Data

```typescript
async function mapVaultWithBackendData(args: {
  vaultAddress: Address;
  account: Address;
}) {
  // Fetch from backend (cached, aggregated, slow-changing)
  const [vaultMetadata, historicalApy] = await Promise.all([
    fetchVaultMetadataFromBackend(args.vaultAddress),
    fetchHistoricalApyFromBackend(args.vaultAddress),
  ]);

  // Fetch from chain (live, reactive, per-user)
  const [balance, currentApy, allowance] = await Promise.all([
    fetchVaultBalance({
      vaultAddress: args.vaultAddress,
      account: args.account,
    }),
    fetchCurrentApy(args.vaultAddress),
    fetchAllowance({ vaultAddress: args.vaultAddress, account: args.account }),
  ]);

  // UI receives clean, merged data object
  return {
    ...vaultMetadata,
    historicalApy,
    balance,
    currentApy,
    allowance,
    hasApproval: allowance > 0n,
  };
}
```

## Layer 3: UI (Dumb Components)

Single useQuery wrapping the mapper provides reactivity. The UI layer:

- Receives pre-formatted numbers and symbols
- Has normalized data structures ready to render
- Contains no domain logic or formatting responsibilities
- Eliminates need for `useMemo` in components
- Prevents formatting logic scattered across components

### Basic Hook with UI Cache

```typescript
export function useVaultDetails(
  vaultAddress: Address | undefined,
  account: Address | undefined,
) {
  return useQuery({
    queryKey: ["vault-details", vaultAddress, account],
    queryFn: () =>
      mapVaultDetails({
        vaultAddress: vaultAddress!,
        account: account!,
        chainId,
      }),
    enabled: Boolean(vaultAddress && account),
    staleTime: 30_000, // UI cache: 30 seconds
  });
}
```

The `staleTime` at UI level (15-60 seconds) prevents re-render storms. Even if 10 components re-render, the mapper runs once per cache window.

### Hook with Polling

```typescript
export function useVaultPositions(account: Address | undefined) {
  return useQuery({
    queryKey: ["vault-positions", account],
    queryFn: () => mapVaultPositions({ account: account! }),
    enabled: Boolean(account),
    staleTime: 15_000,
    refetchInterval: 30_000, // Poll every 30 seconds
  });
}
```

### Hook with Select for Derived Data

```typescript
export function useIsVaultOwner(vaultAddress: Address, account: Address) {
  return useQuery({
    queryKey: ["vault-details", vaultAddress, account],
    queryFn: () => mapVaultDetails({ vaultAddress, account, chainId }),
    enabled: Boolean(vaultAddress && account),
    staleTime: 30_000,
    select: (data) => data.isOwner,
  });
}
```

## Why This Eliminates useMemo

Traditional approach scatters formatting across components:

```typescript
// Bad: useMemo in every component
function VaultCard({ vault }) {
  const formattedBalance = useMemo(
    () => formatUnits(vault.balance, vault.decimals),
    [vault.balance, vault.decimals],
  );
  const formattedApy = useMemo(
    () => `${(vault.apy * 100).toFixed(2)}%`,
    [vault.apy],
  );
  // More memos...
}
```

With fetch-mapper-UI, formatting happens once in the mapper:

```typescript
// Good: Mapper returns pre-formatted data
async function mapVaultDetails(args) {
  const [vault, balance, apy] = await Promise.all([...]);
  return {
    ...vault,
    formattedBalance: formatUnits(balance, vault.decimals),
    formattedApy: `${(apy * 100).toFixed(2)}%`,
  };
}

// Component receives ready-to-render data
function VaultCard({ vault }) {
  return <div>{vault.formattedBalance} at {vault.formattedApy}</div>;
}
```

No useMemo needed. Formatting runs once per cache window in the mapper.

## File Organization

Recommended structure within a feature:

```
src/fusion/vaults/vault-details/
├── vault-details.tsx           # Main component with context
├── vault-details.context.tsx   # Context provider
├── vault-details.params.ts     # useQuery hook consuming mapper
├── vault-details.mapper.ts     # Mapper function
├── vault-details.fetchers.ts   # Fetch functions
└── components/                 # UI components
```

## Migration Strategy

When refactoring from hook-heavy to fetch-mapper-hook:

1. Identify the data consumed by the feature
2. Create fetch functions for each data piece
3. Create a mapper that composes the fetchers
4. Replace multiple hooks with single useQuery
5. Remove unused hooks and memos
6. Test loading and error states

The mapper becomes the single source of truth for what data the feature needs.

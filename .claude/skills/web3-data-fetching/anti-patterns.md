# Anti-Patterns to Avoid

These patterns cause performance and maintainability issues at scale.

## Hook-Heavy Data Fetching

Problem: Multiple dependent `useQuery` hooks with enabled conditions.

Bad example:

```typescript
// Each hook adds loading state, error state, and dependency arrays
const { data: vault, isLoading: isVaultLoading } = useVault({
  address: vaultAddress,
  query: { refetchOnMount: false },
});

const { data: netAssetValue, isLoading: isNetAssetValueLoading } =
  useNetAssetValue({
    accountAddress: account,
    vaultAddress,
    enabled: Boolean(vault), // enabled condition #1
  });

const { data: apy, isLoading: isApyLoading } = useApy({
  account,
  vaultAddress,
  enabled: Boolean(vault), // enabled condition #2
});

// Combined loading state becomes complex
const isLoading = isVaultLoading || isNetAssetValueLoading || isApyLoading;
```

Issues:

- Multiple dependency arrays to maintain
- Cascading enabled conditions
- Complex combined loading/error states
- Each query brings full React Query state bundle
- Hooks on top of hooks, hundreds of lines deep

## Excessive useMemo Usage

Problem: Using `useMemo` to patch reactive complexity.

Scale math:

- 10 vaults × 20 memos = 200 memos
- 500 vaults × 20 memos = 10,000 memos

Every re-render triggers:

- Dependency comparisons
- Recalculations
- Diffing
- Memory usage
- Race conditions

As data grows, one unstable dependency crashes performance.

## Treating Web3 Like Web2

Problem: Using `useQuery` like HTTP endpoints.

In web2:

- Backend prepares data
- 1 hook = 1 query = everything you need

In web3:

- Blockchain gives raw primitive state
- You must compute everything yourself
- Frontend does what a DB would do

The multiple `useQuery` calls end up serving only one purpose: caching. Since you need all data anyway, use a mapper with `Promise.all` instead.

## Abstracting Too Early

Problem: Creating reusable abstractions before understanding real data flows.

Early abstractions are built on assumptions that turn out wrong. They cannot support project evolution and require rewrites.

Wait until you understand:

- Real data flows
- Real scale requirements
- How features will evolve

## Symptoms of Bad Architecture

Your architecture needs refactoring when:

- Hooks grow to 500-800 lines
- You add `useMemo` to fix performance
- Loading states feel random
- Error handling is inconsistent
- Small changes require touching many files
- You can't follow the data flow

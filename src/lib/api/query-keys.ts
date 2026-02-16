/**
 * Query Key Factory
 * Centralizes all React Query keys to ensure cache consistency.
 */
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (limit: number, skip: number) => [...queryKeys.movies.all, { limit, skip }] as const,
    detail: (id: string | number) => [...queryKeys.movies.all, 'detail', id] as const,
    search: (query: string) => [...queryKeys.movies.all, 'search', query] as const,
  },
  series: {
    all: ['series'] as const,
    list: (limit: number, skip: number) => [...queryKeys.series.all, { limit, skip }] as const,
    detail: (id: string | number) => [...queryKeys.series.all, 'detail', id] as const,
  },
  user: {
    profile: ['user', 'me'] as const,
    sessions: ['user', 'sessions'] as const,
    subscription: ['user', 'subscription'] as const,
    transactions: ['user', 'transactions'] as const,
  },
  config: {
    packages: ['subscription-packages'] as const,
  }
} as const;
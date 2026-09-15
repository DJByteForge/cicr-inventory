// Shared database types (v2.3.0).
//
// Central location for all database-related type definitions
// to avoid circular dependencies and duplication.

export interface SupabaseError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

export interface SupabaseResult<T = any> {
  data: T | T[] | null;
  error: SupabaseError | null;
  count?: number;
}

// Minimal QueryBuilder interface for type compatibility
// Actual implementation is in database.ts
export interface QueryBuilder {
  select(columns?: string, options?: { count?: string; head?: boolean }): this;
  insert(data: Record<string, unknown>[]): this;
  update(data: Record<string, unknown>): this;
  delete(): this;
  eq(column: string, value: unknown): this;
  neq(column: string, value: unknown): this;
  gt(column: string, value: unknown): this;
  gte(column: string, value: unknown): this;
  lt(column: string, value: unknown): this;
  lte(column: string, value: unknown): this;
  in(column: string, values: unknown[]): this;
  ilike(column: string, pattern: string): this;
  is(column: string, value: null): this;
  not(column: string, op: string, value: unknown): this;
  or(filterStr: string): this;
  order(column: string, opts?: { ascending?: boolean }): this;
  limit(count: number): this;
  single(): Promise<SupabaseResult>;
  maybeSingle(): Promise<SupabaseResult>;
  then<TResult1 = SupabaseResult, TResult2 = never>(
    onFulfilled?: ((value: SupabaseResult) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2>;
}

export interface SupabaseCompatibleClient {
  from(table: string): QueryBuilder;
}

export type QueryOperation = 'select' | 'insert' | 'update' | 'delete';

export interface QueryFilter {
  type: string;
  column: string;
  value: unknown;
  op?: string;
}

export interface QueryState {
  table: string;
  operation: QueryOperation;
  columns?: string;
  data?: Record<string, unknown>[];
  updates?: Record<string, unknown>;
  filters: QueryFilter[];
  orderBy?: { column: string; ascending: boolean };
  limitCount?: number;
  singleResult?: boolean;
  maybeSingle?: boolean;
  countOnly?: boolean;
  countExact?: boolean;
  selectOptions?: { count?: string; head?: boolean };
  returnColumns?: string;
}
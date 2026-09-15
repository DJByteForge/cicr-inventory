-- ============ 006_add_inventory_created_at_index.sql ============
-- Speeds up the default inventory listing (ORDER BY created_at DESC) used by
-- GET /api/items. Additive only; no data change.
--
-- Apply on Supabase (PRIMARY) via the SQL editor / `supabase db push`, and on
-- Neon (SECONDARY) via psql. Safe to re-run.

CREATE INDEX IF NOT EXISTS idx_inventory_created_at
  ON public.inventory (created_at DESC);

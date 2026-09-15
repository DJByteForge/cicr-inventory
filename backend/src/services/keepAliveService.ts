// Supabase keep-alive service (v2.1.0).
//
// Prevents Supabase free-tier databases from sleeping after 7 days
// of inactivity by sending periodic health-check queries.
//
// Default interval: every 3 days (configurable via KEEPALIVE_INTERVAL_MS).
// The ping is a lightweight SELECT 1 query that keeps the database active.
import dotenv from 'dotenv';
import { checkSupabaseHealth, isSupabaseConfigured } from '../config/supabasePool';
import { acquireLock } from '../config/redis';

dotenv.config();

// Keeping the Supabase project active is NOT the same concern as failover
// detection (that is the health monitor's job). This service is intentionally:
//   - read-only (a lightweight SELECT; never INSERT/UPDATE/DELETE)
//   - independent of routing state
//   - deduplicated across backend instances via a Redis lock so only one
//     instance pings per interval window.
const KEEPALIVE_LOCK_KEY = 'cicr:keepalive:lock';

// ------------------------------------------------------------ configuration
const DEFAULT_KEEPALIVE_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const DEFAULT_KEEPALIVE_ENABLED = true;

function resolveInterval(): number {
  const raw = parseInt(process.env.KEEPALIVE_INTERVAL_MS || '', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_KEEPALIVE_INTERVAL_MS;
}

function resolveEnabled(): boolean {
  const raw = process.env.KEEPALIVE_ENABLED;
  if (raw === undefined || raw === '') return DEFAULT_KEEPALIVE_ENABLED;
  return raw.toLowerCase() !== 'false' && raw.toLowerCase() !== '0';
}

// ------------------------------------------------------------ state
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
let lastPingTime: Date | null = null;
let lastPingSuccess: boolean | null = null;
let consecutiveFailures = 0;

// ------------------------------------------------------------ ping logic
async function pingSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('[KEEPALIVE] Supabase not configured — skipping ping');
    return false;
  }

  try {
    const ok = await checkSupabaseHealth();
    lastPingTime = new Date();
    lastPingSuccess = ok;

    if (ok) {
      consecutiveFailures = 0;
      console.log(`[KEEPALIVE] Supabase ping successful at ${lastPingTime.toISOString()}`);
    } else {
      consecutiveFailures++;
      console.warn(`[KEEPALIVE] Supabase ping failed (consecutive failures: ${consecutiveFailures})`);
    }

    return ok;
  } catch (err: any) {
    lastPingTime = new Date();
    lastPingSuccess = false;
    consecutiveFailures++;
    console.error(`[KEEPALIVE] Supabase ping error: ${err.message}`);
    return false;
  }
}

// ------------------------------------------------------------ lifecycle
// One keep-alive "window": only the instance that wins the Redis lock pings.
// If Redis is unavailable we fall back to a best-effort ping (single instance),
// which is harmless because the ping is read-only.
async function runKeepAliveWindow(intervalMs: number): Promise<void> {
  const lock = await acquireLock(KEEPALIVE_LOCK_KEY, intervalMs);
  if (!lock.acquired && lock.reason !== 'redis-unavailable') {
    // Another instance already covers this interval window.
    return;
  }
  await pingSupabase();
}

export function startKeepAlive(): void {
  if (!resolveEnabled()) {
    console.log('[KEEPALIVE] Keep-alive disabled via KEEPALIVE_ENABLED=false');
    return;
  }

  if (!isSupabaseConfigured()) {
    console.log('[KEEPALIVE] Supabase not configured — keep-alive not started');
    return;
  }

  const intervalMs = resolveInterval();
  const intervalDays = (intervalMs / (24 * 60 * 60 * 1000)).toFixed(1);

  // Run first window immediately (async, non-blocking)
  runKeepAliveWindow(intervalMs).catch((err) => {
    console.error('[KEEPALIVE] Initial ping failed:', err.message);
  });

  keepAliveTimer = setInterval(() => {
    runKeepAliveWindow(intervalMs).catch((err) => {
      console.error('[KEEPALIVE] Scheduled ping failed:', err.message);
    });
  }, intervalMs);

  // Allow process to exit even if timer is running
  if (keepAliveTimer && typeof keepAliveTimer === 'object' && 'unref' in keepAliveTimer) {
    keepAliveTimer.unref();
  }

  console.log(`[KEEPALIVE] Started (interval: ${intervalDays} days / ${intervalMs}ms, Redis-deduped)`);
}

export function stopKeepAlive(): void {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

// ------------------------------------------------------------ status
export function getKeepAliveStatus() {
  return {
    enabled: resolveEnabled(),
    configured: isSupabaseConfigured(),
    intervalMs: resolveInterval(),
    lastPingTime: lastPingTime?.toISOString() || null,
    lastPingSuccess,
    consecutiveFailures,
  };
}

// HA hardening tests (shared health state, scheduler lock, automatic recovery,
// recovery-failure safety, read-only keepalive, no dual-write, no creds).
// Requires live Supabase + Neon + Redis (same as the other integration tests).
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');

const backendDir = path.join(__dirname, '..');
require(path.join(backendDir, 'node_modules', 'dotenv')).config({ path: path.join(backendDir, '.env') });

if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
  console.log('Skipping HA tests (no live Supabase configured).');
  return;
}

const { createClient } = require(path.join(backendDir, 'node_modules', '@supabase', 'supabase-js'));

const health = require('../dist/config/dbHealth.js');
const router = require('../dist/config/databaseRouter.js');
const replication = require('../dist/config/replication.js');
const redisMod = require('../dist/config/redis.js');
const { acquireLock, releaseLock, redisClient } = redisMod;
const { dbWrite } = require('../dist/config/database.js');
const { queryWrite, closeNeonPools } = require('../dist/config/neonPool.js');
const { checkSupabaseHealth } = require('../dist/config/supabasePool.js');
const keepAlive = require('../dist/services/keepAliveService.js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const IDS = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function deleteInventory(id) {
  await supabase.from('inventory').delete().eq('id', id);
  await queryWrite('DELETE FROM "inventory" WHERE id = $1', [id]);
}

async function removeQueueEntryById(id) {
  if (!redisClient) return;
  const raw = await redisClient.lrange('cicr:replication:pending', 0, -1);
  for (const s of raw) {
    try { if (JSON.parse(s).id === id) await redisClient.lrem('cicr:replication:pending', 1, s); } catch { /* skip */ }
  }
}

after(async () => {
  try {
    for (const id of IDS) await deleteInventory(id);
    // Restore safe defaults and clean test locks.
    health.setSimulatedOutage(false);
    health.setSupabaseHealthy(true);
    if (redisClient) {
      try { await redisClient.del('cicr:keepalive:lock'); } catch { /* ignore */ }
    }
  } catch (e) { console.warn('HA cleanup failed:', e.message); }
  try { await redisMod.closeRedis(); } catch { /* ignore */ }
  try { await closeNeonPools(); } catch { /* ignore */ }
});

test('Redis distributed lock is exclusive, releasable and expiring', async () => {
  const key = 'test:lock:' + crypto.randomUUID();
  const a = await acquireLock(key, 5000);
  assert.equal(a.acquired, true, 'first acquire');
  const b = await acquireLock(key, 5000);
  assert.equal(b.acquired, false, 'second acquire blocked');
  await releaseLock(key, a.token);
  const c = await acquireLock(key, 5000);
  assert.equal(c.acquired, true, 're-acquire after release');
  await releaseLock(key, c.token);
  // Expiry: min TTL is 1000ms.
  const d = await acquireLock(key, 1000);
  assert.equal(d.acquired, true, 'acquire with short TTL');
  await sleep(1400);
  const e = await acquireLock(key, 5000);
  assert.equal(e.acquired, true, 'expired lock re-acquirable');
  await releaseLock(key, e.token);
});

test('simulated outage is shared through Redis (multi-instance)', async () => {
  health.setSupabaseHealthy(true);
  health.setSimulatedOutage(true);
  await sleep(150);
  if (redisClient) {
    const raw = await redisClient.get('cicr:db:simulatedOutage');
    assert.equal(raw, '1', 'shared outage flag persisted to Redis');
  }
  assert.equal(router.routeToSupabase('inventory'), false, 'routing follows shared outage');

  health.setSimulatedOutage(false);
  await sleep(150);
  if (redisClient) {
    const raw = await redisClient.get('cicr:db:simulatedOutage');
    assert.equal(raw, '0', 'shared outage flag cleared');
  }
  assert.equal(router.routeToSupabase('inventory'), true, 'routing back to primary');
});

test('automatic recovery reconciles, clears queue and returns to PRIMARY', async () => {
  health.setSimulatedOutage(false);
  health.setSupabaseHealthy(false);
  assert.equal(router.routeToSupabase('inventory'), false);

  const id = crypto.randomUUID();
  IDS.push(id);
  const ins = await dbWrite.from('inventory').insert([
    { id, name: 'HA_AUTO_RECOVERY', category: 'Tools', location: 'Neon Lab', quantity: 2, available_quantity: 2, tags: '[]', status: 'AVAILABLE' },
  ]).select().single();
  assert.equal(ins.error, null, ins.error && ins.error.message);
  assert.ok((await replication.getPendingCount()) >= 1, 'pending change queued');

  const before = await supabase.from('inventory').select('id').eq('id', id);
  assert.equal(before.data.length, 0, 'not in Supabase while down');

  const outcome = await replication.performRecovery('auto');
  assert.equal(outcome.success, true, outcome.reason || 'recovery succeeded');
  assert.equal(health.isSupabaseHealthy(), true, 'healthy after successful recovery');
  assert.equal(router.routeToSupabase('inventory'), true, 'PRIMARY routing restored');

  const after = await supabase.from('inventory').select('id').eq('id', id);
  assert.equal(after.data.length, 1, 'reconciled write present in Supabase');
  assert.equal(await replication.getPendingCount(), 0, 'queue cleared');
});

test('keepalive is read-only and never creates/updates/deletes rows', async () => {
  const u1 = await supabase.from('users').select('id', { count: 'exact', head: true });
  const i1 = await supabase.from('inventory').select('id', { count: 'exact', head: true });

  keepAlive.startKeepAlive();
  await sleep(2500);
  keepAlive.stopKeepAlive();

  const u2 = await supabase.from('users').select('id', { count: 'exact', head: true });
  const i2 = await supabase.from('inventory').select('id', { count: 'exact', head: true });
  assert.equal(u1.count, u2.count, 'users count unchanged by keepalive');
  assert.equal(i1.count, i2.count, 'inventory count unchanged by keepalive');

  // underlying request is a read-only health call
  const ok = await checkSupabaseHealth();
  assert.equal(ok, true, 'health request succeeds (read-only)');

  if (redisClient) { try { await redisClient.del('cicr:keepalive:lock'); } catch { /* ignore */ } }
});

test('no dual-write during outage; queue grows by exactly one', async () => {
  health.setSimulatedOutage(false);
  health.setSupabaseHealthy(true);
  health.setSimulatedOutage(true);

  const id = crypto.randomUUID();
  IDS.push(id);
  const before = await replication.getPendingCount();
  const ins = await dbWrite.from('inventory').insert([
    { id, name: 'HA_NO_DUAL_WRITE', category: 'Tools', location: 'Neon Lab', quantity: 1, available_quantity: 1, tags: '[]', status: 'AVAILABLE' },
  ]).select().single();
  assert.equal(ins.error, null, ins.error && ins.error.message);

  const neon = await queryWrite('SELECT id FROM "inventory" WHERE id = $1', [id]);
  assert.equal(neon.rows.length, 1, 'write landed in Neon');
  const sb = await supabase.from('inventory').select('id').eq('id', id);
  assert.equal(sb.data.length, 0, 'write NOT in Supabase (no dual-write)');
  assert.equal(await replication.getPendingCount(), before + 1, 'exactly one pending change');

  health.setSimulatedOutage(false);
  // reconcile to clear the queue, then cleanup will remove from both stores
  const rec = await replication.reconcileNeonToSupabase();
  assert.ok(rec.applied >= 1, 'queued change reconciled');
});

test('recovery failure keeps SECONDARY routing and preserves pending changes', async () => {
  health.setSimulatedOutage(false);
  health.setSupabaseHealthy(false);

  // A change that cannot be reconciled (nonexistent table) forces failure.
  const bad = await replication.enqueuePendingChange({
    table: 'nonexistent_table_for_recovery_test',
    operation: 'delete',
    filters: [{ type: 'eq', column: 'id', value: crypto.randomUUID() }],
  });

  const outcome = await replication.performRecovery('auto');
  assert.equal(outcome.success, false, 'recovery must fail');
  assert.equal(outcome.skipped, false);
  assert.equal(health.isSupabaseHealthy(), false, 'still unhealthy');
  assert.equal(router.routeToSupabase('inventory'), false, 'still SECONDARY routing');
  assert.ok((await replication.getPendingCount()) >= 1, 'pending change preserved');

  await removeQueueEntryById(bad.id);
  health.setSupabaseHealthy(true);
});

test('status payload contains no credentials', async () => {
  const status = await replication.getReplicationStatus();
  const serialized = JSON.stringify(status);
  assert.ok(!serialized.includes(process.env.SUPABASE_SERVICE_ROLE_KEY), 'no service-role key');
  assert.ok(!serialized.includes(process.env.NEON_PASSWORD), 'no Neon password');
  if (process.env.REDIS_URL) {
    const m = process.env.REDIS_URL.match(/:\/\/[^:]*:([^@]+)@/);
    if (m) assert.ok(!serialized.includes(m[1]), 'no Redis token');
  }
});

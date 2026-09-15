import { Request, Response } from 'express';
import { dbRead } from '../../config/database';
import { cacheGetJSON, cacheSetJSON } from '../../config/redis';

const STATS_CACHE_KEY = 'cicr:cache:stats';
const STATS_CACHE_TTL = 15; // seconds

// GET /api/stats (Dashboard Analytics) — independent read-pool queries in parallel, cached 15s
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const cached = await cacheGetJSON<any>(STATS_CACHE_KEY);
    if (cached) {
      return res.status(200).json(cached);
    }

    const [
      { count: totalItems },
      { count: totalUsers },
      { count: activeBorrows },
      { data: items }
    ] = await Promise.all([
      dbRead.from('inventory').select('*', { count: 'exact', head: true }),
      dbRead.from('users').select('*', { count: 'exact', head: true }),
      dbRead
        .from('borrow_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'BORROWED'),
      dbRead.from('inventory').select('quantity, available_quantity')
    ]);

    const totalQuantity = items?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0;
    const availableQuantity = items?.reduce((acc: number, curr: any) => acc + curr.available_quantity, 0) || 0;

    const payload = {
      status: 'success',
      data: {
        total_items: totalItems || 0,
        total_users: totalUsers || 0,
        active_borrows: activeBorrows || 0,
        total_quantity: totalQuantity,
        available_quantity: availableQuantity,
        borrowed_quantity: totalQuantity - availableQuantity
      }
    };

    await cacheSetJSON(STATS_CACHE_KEY, payload, STATS_CACHE_TTL);
    return res.status(200).json(payload);
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/audit (Audit Logs List)
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;
    const maxLimit = Math.min(Math.max(Number(limit) || 100, 1), 250);

    let query = dbRead
      .from('audit_logs')
      .select('*, users(name, email, role), inventory(name, category)')
      .order('timestamp', { ascending: false })
      .limit(maxLimit);

    if (category && typeof category === 'string' && category !== 'all') {
      const cat = category.toLowerCase();
      if (cat === 'auth') {
        query = query.in('action', ['Sign In', 'Sign Up', 'User Approved', 'User Rejected', 'Role Changed', 'User Deleted']);
      } else if (cat === 'inventory') {
        query = query.in('action', ['Item Added', 'Item Edited', 'Item Deleted']);
      } else if (cat === 'hardware') {
        query = query.in('action', ['Hardware Requested', 'Hardware Approved', 'Hardware Rejected']);
      } else if (cat === 'loans') {
        query = query.in('action', ['Borrowed', 'Returned', 'OTP Requested', 'Item Borrowed', 'Item Returned']);
      }
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      query = query.or(`action.ilike.%${term}%,description.ilike.%${term}%`);
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    return res.status(200).json({ status: 'success', count: logs?.length || 0, data: logs || [] });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
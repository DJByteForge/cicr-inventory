import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import dotenv from 'dotenv';

import { dbWrite, dbRead } from './config/database';
import { redisClient, isRedisEnabled } from './config/redis';

import authRoutes from './modules/auth/auth.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import borrowRoutes from './modules/borrow/borrow.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

dotenv.config();

// Write pool — backward-compatible alias used by controllers/tests.
export const supabase = dbWrite;

const app: Application = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

app.use(express.json());

// Redis-backed cookie sessions (v1.5.0). JWT Bearer auth remains the primary
// path; sessions give an additional cookie-based carrier stored in Redis.
const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'cicr_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};
if (isRedisEnabled && redisClient) {
  sessionOptions.store = new RedisStore({ client: redisClient, prefix: 'cicr:sess:' });
} else {
  console.warn('⚠️ REDIS_URL not set — using in-memory session store (development only). Set REDIS_URL for Redis-backed sessions.');
}
app.use(session(sessionOptions));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/items', inventoryRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api', dashboardRoutes); // Exposes GET /api/stats and GET /api/audit

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'CICR Inventory API is live! 🚀',
    version: '2.7.1',
    smtp_configured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    smtp_user: process.env.SMTP_USER ? process.env.SMTP_USER.replace(/(.{3})(.*)(@.*)/, '$1***$3') : null,
  });
});

app.get('/api/smtp-debug', async (req: Request, res: Response) => {
  const net = await import('net');
  const dns = await import('dns');

  const testSocket = (host: string, port: number, timeoutMs = 4000): Promise<{ port: number; success: boolean; error?: string; timeMs: number }> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const socket = new net.Socket();
      let finished = false;

      const done = (success: boolean, error?: string) => {
        if (finished) return;
        finished = true;
        socket.destroy();
        resolve({ port, success, error, timeMs: Date.now() - start });
      };

      socket.setTimeout(timeoutMs);
      socket.once('connect', () => done(true));
      socket.once('timeout', () => done(false, 'ETIMEDOUT (port blocked or no response)'));
      socket.once('error', (err: any) => done(false, err.message));
      socket.connect(port, host);
    });
  };

  const dnsLookup = (): Promise<any> => {
    return new Promise((resolve) => {
      dns.lookup('smtp.gmail.com', { all: true }, (err, addresses) => {
        resolve(err ? { error: err.message } : addresses);
      });
    });
  };

  try {
    const [tcp587, tcp465, addresses] = await Promise.all([
      testSocket('smtp.gmail.com', 587, 4000),
      testSocket('smtp.gmail.com', 465, 4000),
      dnsLookup()
    ]);

    res.json({
      dns: addresses,
      tcp_587: tcp587,
      tcp_465: tcp465,
      smtp_user: process.env.SMTP_USER || null,
      smtp_pass_set: Boolean(process.env.SMTP_PASS)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { dbRead };
export default app;

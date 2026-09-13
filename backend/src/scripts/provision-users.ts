import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { setUserApproval, isDesignatedAdmin } from '../modules/auth/userApprovalService';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface UserProvisionData {
  name: string;
  email: string;
  roll_number?: string | null;
  batch?: string | null;
  role?: 'ADMIN' | 'MEMBER';
}

const DEFAULT_TEMP_PASSWORD = 'CICR_INVENTORY@1234';

export async function provisionUsers(userList: UserProvisionData[], customPassword?: string) {
  const passwordToUse = customPassword || DEFAULT_TEMP_PASSWORD;
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(passwordToUse, salt);

  console.log(`[PROVISION] Processing ${userList.length} users with temporary password: "${passwordToUse}"`);

  const results: any[] = [];

  for (const user of userList) {
    const normEmail = user.email.trim().toLowerCase();
    const cleanName = user.name.trim();

    // Auto extract roll number if not explicitly specified
    let roll = user.roll_number ? String(user.roll_number).trim() : null;
    if (!roll) {
      const match = normEmail.match(/^(\d+)@mail\.jiit\.ac\.in$/i);
      if (match) roll = match[1];
    }

    // Role assignment: Dhruvi Gupta & Aryan Varshney are ADMIN, others are MEMBER unless overridden
    const isSpecialAdmin = isDesignatedAdmin(normEmail, cleanName);
    const assignedRole: 'ADMIN' | 'MEMBER' = user.role || (isSpecialAdmin ? 'ADMIN' : 'MEMBER');

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, name, email, roll_number, role')
      .eq('email', normEmail)
      .maybeSingle();

    if (existing) {
      const { data: updated, error: updErr } = await supabase
        .from('users')
        .update({
          name: cleanName,
          password_hash,
          roll_number: roll,
          role: assignedRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select('id, name, email, roll_number, role')
        .single();

      if (updErr) {
        console.error(`[ERROR] Updating user ${normEmail}:`, updErr.message);
        continue;
      }

      setUserApproval(normEmail, 'APPROVED', 'SYSTEM (AUTO-APPROVE)', {
        name: cleanName,
        username: cleanName.toLowerCase().replace(/\s+/g, ''),
        roll_number: roll,
        batch: user.batch
      });

      console.log(`[UPDATED] ${cleanName} (${normEmail}) -> Role: ${assignedRole} [APPROVED]`);
      results.push(updated);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('users')
        .insert([{
          name: cleanName,
          email: normEmail,
          password_hash,
          roll_number: roll,
          role: assignedRole
        }])
        .select('id, name, email, roll_number, role')
        .single();

      if (insErr) {
        console.error(`[ERROR] Creating user ${normEmail}:`, insErr.message);
        continue;
      }

      setUserApproval(normEmail, 'APPROVED', 'SYSTEM (AUTO-APPROVE)', {
        name: cleanName,
        username: cleanName.toLowerCase().replace(/\s+/g, ''),
        roll_number: roll,
        batch: user.batch
      });

      console.log(`[CREATED] ${cleanName} (${normEmail}) -> Role: ${assignedRole} [APPROVED]`);
      results.push(inserted);
    }
  }

  console.log(`\n[PROVISION COMPLETE] ${results.length} accounts ready in database!`);
  return results;
}

// Allow CLI execution if called directly with a JSON file or inline arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    try {
      const filePath = path.resolve(process.cwd(), args[0]);
      const content = require(filePath);
      const list = Array.isArray(content) ? content : content.users || [];
      provisionUsers(list);
    } catch (e: any) {
      console.error('Error running provisionUsers from file:', e.message);
    }
  } else {
    console.log('Usage: npx ts-node src/scripts/provision-users.ts <path-to-json>');
  }
}

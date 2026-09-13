import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import * as bcrypt from 'bcryptjs';
import { dbWrite, dbRead } from '../config/database';
import { setUserApproval, unpurgeEmail } from '../modules/auth/userApprovalService';
import { sendUserWelcomeWithTempPasswordEmail, getTransporter, getFromAddress, getReplyToAddress } from '../services/emailService';

async function main() {
  console.log('=== PROVISIONING VARDAAN SAXENA ACCOUNT ===');
  const name = 'Vardaan Saxena';
  const username = 'VardaanSaxena_';
  const email = '992501030399@mail.jiit.ac.in';
  const roll_number = '992501030399';
  const tempPassword = process.env.DEFAULT_TEMP_PASSWORD || process.env.TEMP_PASSWORD || '';
  const role = 'ADMIN';

  unpurgeEmail(email);

  // 1. Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(tempPassword, salt);

  // 2. Check if user already exists in DB
  const { data: existingUser } = await dbRead
    .from('users')
    .select('id, name, email, role, roll_number')
    .or(`email.ilike.${email},roll_number.eq.${roll_number}`)
    .maybeSingle();

  let userRecord = existingUser;

  if (existingUser) {
    console.log(`User already exists in DB (ID: ${existingUser.id}). Updating password & ensuring ADMIN role...`);
    const { data: updated, error: updateErr } = await dbWrite
      .from('users')
      .update({
        name,
        role: 'ADMIN',
        password_hash,
        roll_number
      })
      .eq('id', existingUser.id)
      .select('id, name, email, role, roll_number')
      .single();

    if (updateErr) {
      console.error('Failed to update existing user in DB:', updateErr);
      process.exit(1);
    }
    userRecord = updated;
    console.log('User record updated in Supabase successfully!');
  } else {
    console.log('Inserting new user into Supabase users table...');
    const { data: inserted, error: insertErr } = await dbWrite
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash,
          roll_number,
          role: 'ADMIN'
        }
      ])
      .select('id, name, email, role, roll_number')
      .single();

    if (insertErr || !inserted) {
      console.error('Failed to insert user into DB:', insertErr);
      process.exit(1);
    }
    userRecord = inserted;
    console.log('User record inserted into Supabase successfully! ID:', inserted.id);
  }

  // 3. Mark approved in userApprovalService & persist
  setUserApproval(email, 'APPROVED', 'SYSTEM_MASTER', {
    username,
    name,
    roll_number,
    batch: 'N/A'
  });
  console.log(`User ${email} marked APPROVED with role ADMIN.`);

  // 4. Send the testing / welcome email via SMTP
  console.log(`Sending testing email to ${email} via SMTP...`);
  try {
    const welcomeResult = await sendUserWelcomeWithTempPasswordEmail(email, {
      userName: name,
      userEmail: email,
      tempPassword,
      rollNumber: roll_number,
      batch: 'Founder / Super Admin',
      isAutoApproved: true
    });
    console.log('✅ Welcome & testing credentials email sent successfully!');

    // Also send an explicit testing confirmation email to make 100% sure
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      replyTo: getReplyToAddress(),
      to: email,
      subject: `[CICR Vault] Test Email & Account Confirmation - Vardaan Saxena`,
      html: `
        <div style="background-color: #0b0f19; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; border-radius: 8px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #00f0ff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">⚡ CICR INVENTORY VAULT // SYSTEM TEST</h2>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0;">Hello <strong>${name}</strong> (${username}),</p>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
            This is an automated testing mail to confirm that your official JIIT college account has been successfully provisioned and verified on the CICR Inventory system.
          </p>
          <div style="background: #111827; border: 1px solid #374151; border-radius: 6px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;"><strong>College ID:</strong> <span style="color: #00f0ff;">${email}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;"><strong>Username:</strong> <span style="color: #f3f4f6;">${username}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;"><strong>Enrollment:</strong> <span style="color: #f3f4f6;">${roll_number}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;"><strong>Assigned Role:</strong> <span style="color: #10b981; font-weight: bold;">ADMIN</span></p>
            <p style="margin: 0; font-size: 13px; color: #9ca3af;"><strong>Temporary Password:</strong> <code style="background: #1f2937; color: #fbbf24; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
            You can log into the portal directly at <a href="https://cicr-inventory.vercel.app" style="color: #00f0ff; text-decoration: none;">cicr-inventory.vercel.app</a> or via your local development server.
          </p>
          <div style="border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #64748b;">
            Sent by CICR Inventory System via SMTP (smtp.gmail.com).
          </div>
        </div>
      `
    });

    console.log('✅ Direct testing mail sent! MessageId:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending testing email:', err);
  }

  console.log('=== COMPLETED SUCCESSFULLY ===');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});

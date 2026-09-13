require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
require('dotenv').config();

const nodemailer = require('nodemailer');

async function sendCleanAestheticSampleMail() {
  const recipient = '992501030399@mail.jiit.ac.in';
  console.log(`\nDispatched to: ${recipient}...`);

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || 'cicrinventory@gmail.com';
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const from = process.env.SMTP_FROM || '"CICR Inventory" <cicrinventory@gmail.com>';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  const tempPassword = 'CICR_INVENTORY@1234';
  const portalUrl = 'https://cicr-inventory.vercel.app/';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CICR Robotics Vault Access</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030509; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f8fafc;">

  <div style="width: 100%; max-width: 600px; margin: 32px auto; background: #070b13; border: 1px solid rgba(0, 240, 255, 0.22); border-radius: 12px; overflow: hidden; box-shadow: 0 0 50px rgba(0, 240, 255, 0.08), 0 25px 50px rgba(0, 0, 0, 0.85);">
    
    <!-- Ultra-Sleek Top Cyan-Violet Neon Bar -->
    <div style="height: 3px; background: linear-gradient(90deg, #00f0ff 0%, #8b5cf6 50%, #00f0ff 100%);"></div>

    <!-- Header Section -->
    <div style="padding: 38px 32px 26px 32px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.09) 0%, rgba(7, 11, 19, 0) 70%); border-bottom: 1px solid rgba(148, 163, 184, 0.1);">
      
      <!-- Monospace Pill Tag (No Emojis) -->
      <table align="center" style="margin: 0 auto 16px auto; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 15px; background: rgba(0, 240, 255, 0.06); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 10.5px; font-weight: 700; color: #00f0ff; letter-spacing: 2px; text-transform: uppercase;">
            [ CICR VAULT // NODE-128 ACCESS DISPATCH ]
          </td>
        </tr>
      </table>

      <h1 style="margin: 0; font-size: 25px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff; text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);">
        CICR ROBOTICS VAULT
      </h1>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; letter-spacing: 0.3px;">
        Account Credentials & Access Directives
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 32px 32px 32px;">

      <!-- Profile Metrics HUD (No Lab Batch) -->
      <div style="background: #0b101b; border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 8px; padding: 20px 22px; margin-bottom: 22px;">
        <div style="border-bottom: 1px solid rgba(148, 163, 184, 0.12); padding-bottom: 10px; margin-bottom: 12px;">
          <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 10.5px; font-weight: 700; color: #38bdf8; letter-spacing: 1.5px; text-transform: uppercase;">
            // IDENTITY METRICS
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11.5px;">NAME:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">Vardaan Saxena</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11.5px;">COLLEGE ID:</td>
            <td style="padding: 6px 0; color: #00f0ff; font-weight: 600; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${recipient}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11.5px;">ENROLLMENT NO:</td>
            <td style="padding: 6px 0; color: #e2e8f0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">992501030399</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11.5px;">CLEARANCE:</td>
            <td style="padding: 6px 0;">
              <span style="display: inline-block; padding: 2px 8px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 3px; font-size: 10.5px; font-weight: 700; color: #34d399; letter-spacing: 1px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">
                SUPER ADMIN
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Temporary Password Terminal Block (No Emojis) -->
      <div style="background: rgba(0, 240, 255, 0.03); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 8px; padding: 22px 20px; text-align: center; margin-bottom: 22px;">
        <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 2px; color: #00f0ff; text-transform: uppercase; margin-bottom: 12px;">
          // TEMPORARY ACCESS KEY
        </div>
        
        <div style="display: inline-block; background: #03060c; border: 1px solid rgba(0, 240, 255, 0.6); border-radius: 6px; padding: 12px 30px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.18);">
          <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 22px; font-weight: 800; letter-spacing: 2.5px; color: #ffffff;">
            ${tempPassword}
          </span>
        </div>

        <div style="font-size: 11.5px; color: #94a3b8; margin-top: 12px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">
          Use your college ID and this temporary access key for initial authentication.
        </div>
      </div>

      <!-- Security Notice 1: Change Password Upon Signin (No Emojis) -->
      <div style="background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.3); border-left: 4px solid #f59e0b; border-radius: 6px; padding: 14px 18px; margin-bottom: 14px;">
        <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11px; font-weight: 700; color: #fbbf24; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">
          [ PROTOCOL: MANDATORY // CHANGE PASSWORD UPON SIGNIN ]
        </div>
        <div style="font-size: 12.5px; color: #e2e8f0; line-height: 1.5;">
          For account security, you are required to <strong>update your temporary password immediately</strong> upon sign-in. Use the <em>"Forgot / Reset Password?"</em> option on the login card or the password update key in the sidebar settings.
        </div>
      </div>

      <!-- Security Notice 2: No System of OTP (No Emojis) -->
      <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.3); border-left: 4px solid #10b981; border-radius: 6px; padding: 14px 18px; margin-bottom: 26px;">
        <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11px; font-weight: 700; color: #34d399; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">
          [ PROTOCOL: AUTHENTICATION // NO OTP SYSTEM ACTIVE ]
        </div>
        <div style="font-size: 12.5px; color: #e2e8f0; line-height: 1.5;">
          The CICR Vault operates with <strong>no OTP or verification code requirements</strong>. Signing in, resetting your credentials, and submitting hardware requests are completely direct and instant using your verified credentials.
        </div>
      </div>

      <!-- Launch Portal Button (No Emojis) -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 14px 38px; background: linear-gradient(135deg, #00f0ff 0%, #0284c7 100%); color: #020617; font-size: 13.5px; font-weight: 800; text-decoration: none; border-radius: 6px; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 0 25px rgba(0, 240, 255, 0.35); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              LAUNCH VAULT PORTAL &nbsp;&rarr;
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 10px;">
            <a href="${portalUrl}" style="color: #64748b; font-size: 11.5px; text-decoration: none; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">
              ${portalUrl}
            </a>
          </td>
        </tr>
      </table>

    </div>

    <!-- Cyber Footer with Sector 128 (No Emojis) -->
    <div style="background: #04070d; padding: 22px 32px; border-top: 1px solid rgba(148, 163, 184, 0.12); text-align: center;">
      <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px;">
        Centre for Innovation, Creativity & Robotics (CICR)
      </p>
      <p style="margin: 0; font-size: 11px; color: #64748b; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">
        Jaypee Institute of Information Technology • Sector 128, Noida
      </p>
      <div style="margin-top: 10px; font-size: 9.5px; color: #334155; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; letter-spacing: 1px;">
        SECURITY CLASSIFICATION: CONFIDENTIAL // VAULT ACCESS DISPATCH
      </div>
    </div>

  </div>

</body>
</html>
  `;

  const text = [
    `[ CICR VAULT // NODE-128 ACCESS DISPATCH ]`,
    `================================================`,
    `Welcome Vardaan Saxena,`,
    ``,
    `Your official credentials for the CICR Robotics Inventory Vault have been generated.`,
    ``,
    `// IDENTITY METRICS`,
    `- NAME: Vardaan Saxena`,
    `- COLLEGE ID: ${recipient}`,
    `- ENROLLMENT NO: 992501030399`,
    `- CLEARANCE: SUPER ADMIN`,
    ``,
    `// TEMPORARY ACCESS KEY`,
    `>> ${tempPassword} <<`,
    ``,
    `OPERATIONAL SECURITY DIRECTIVES:`,
    `1. [ PROTOCOL: MANDATORY ] CHANGE PASSWORD UPON SIGNIN:`,
    `   Update your temporary password immediately upon your initial login.`,
    ``,
    `2. [ PROTOCOL: AUTHENTICATION ] NO OTP SYSTEM ACTIVE:`,
    `   No OTP or email verification code is required. Simply enter your college email and password directly.`,
    ``,
    `Launch the portal at: ${portalUrl}`,
    ``,
    `Regards,`,
    `CICR Administration Team`,
    `Centre for Innovation, Creativity & Robotics`,
    `Jaypee Institute of Information Technology • Sector 128, Noida`
  ].join('\n');

  const mailOptions = {
    from,
    to: recipient,
    subject: `[CICR Vault] Access Authorization & Credentials - Vardaan Saxena`,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Clean aesthetic email (no emojis, Sector 128) successfully delivered!');
    console.log('Message ID:', info.messageId);
    console.log('Server Response:', info.response);
    console.log('Accepted Recipient:', JSON.stringify(info.accepted));
  } catch (err) {
    console.error('❌ Failed to dispatch email:', err);
    process.exit(1);
  }
}

sendCleanAestheticSampleMail();

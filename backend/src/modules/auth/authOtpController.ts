// Auth OTP controller (v1.7.0).
//
// Handles OTP-based login + signup flow:
//   POST /api/auth/send-otp   — generates OTP, sends to user's email, returns success
//   POST /api/auth/verify-otp — verifies OTP; logs in existing users or creates new
//                               student accounts for any valid @mail.jiit.ac.in address.
//
// Email validation:
//   - Students: MUST match @mail.jiit.ac.in (any valid prefix)
//   - Admins: MUST be in the admin directory (adminDirectory.ts)
//   - Invalid/unknown formats → 400 Bad Request

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbRead } from '../../config/database';
import { supabase } from '../../app';
import { generateAuthOtp, storeAuthOtp, verifyAuthOtp, consumeAuthOtp } from './authOtpService';
import { isStudentEmail } from '../../validators/email.validator';
import { getAdminByEmail } from '../borrow/adminDirectory';
import { sendLoginOtpEmail, sendAdminNewUserRegistrationAlert } from '../../services/emailService';
import {
  SUPER_ADMIN_EMAILS,
  isSuperAdminEmail,
  isDesignatedAdmin,
  getUserApproval,
  setUserApproval
} from './userApprovalService';

// POST /api/auth/send-otp (DECOMMISSIONED - NO OTP SYSTEM)
export const sendOtp = async (req: Request, res: Response) => {
  return res.status(400).json({
    status: 'error',
    message: 'OTP system has been decommissioned. Please log in directly with your credentials.'
  });
};

// POST /api/auth/verify-otp (DECOMMISSIONED - NO OTP SYSTEM)
export const verifyOtp = async (req: Request, res: Response) => {
  return res.status(400).json({
    status: 'error',
    message: 'OTP system has been decommissioned. Please log in directly with your credentials.'
  });
};

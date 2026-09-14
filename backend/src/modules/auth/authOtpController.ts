// Auth OTP controller (v1.7.0).
//
// Handles OTP-based login + signup flow (Decommissioned in favor of direct credential auth).

import { Request, Response } from 'express';

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

import { z } from 'zod';

// 👉 JANGAN taruh default di base
// 👉 Base = representasi data murni
export const AuthBaseSchema = z.object({
  username: z
    .string()
    .min(3, 'Username harus minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username hanya boleh berisi huruf, angka, dan underscore',
    ),

  email: z.email('Email tidak valid').max(254, 'Email maksimal 254 karakter'),

  password: z
    .string()
    .min(8, 'Password harus minimal 8 karakter')
    .max(255, 'Password maksimal 255 karakter')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka',
    ),
});

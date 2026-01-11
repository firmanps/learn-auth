import { z } from 'zod';
import { AuthBaseSchema } from './auth-base.schema';

export const UpdateAuthSchema = AuthBaseSchema.partial();

export type UpdateAuthDto = z.infer<typeof UpdateAuthSchema>;

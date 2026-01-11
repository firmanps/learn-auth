import { z } from 'zod';
import { AuthBaseSchema } from './auth-base.schema';

export const CreateAuthSchema = AuthBaseSchema;

//contoh memberikan default value
// export const CreateAuthSchema = AuthBaseSchema.extend({
//   username: AuthBaseSchema.shape.username.default('TODO'),
// });

//contoh kalau ada yang optional
// export const CreateAuthSchema = AuthBaseSchema.pick({
//   username: true,
//   password: true,
// }).extend({
//   email: AuthBaseSchema.shape.email.optional(),
// });

export type CreateAuthDto = z.infer<typeof CreateAuthSchema>;

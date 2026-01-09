import 'dotenv/config';
import { type Env, EnvSchema } from './env.validation';

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(parsed.error.issues);
  process.exit(1);
}

export const env: Env = parsed.data;

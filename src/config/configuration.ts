import { env } from './env';
export default () => ({
  app: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  cors: {
    origins: env.CORS_ORIGINS,
  },
  database: {
    url: env.DATABASE_URL,
  },
});

import dotenv from 'dotenv';
import packageJson from '../package.json';

dotenv.config();

export default {
  lang: 'pt-br',
  app: {
    secret: process.env.SECRET,
    url: process.env.APP_URL || 'http://localhost',
    port: process.env.PORT || 4000,
    version: packageJson.version,
    database: {
      connectionString: process.env.DATABASE_CONNECTION_STRING,
    },
  },
  passport: {
    google: {
      client: {
        id: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        secret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
      },
    },
  },
  req: {
    rateLimit: {
      windowMs: 30 * 60 * 1000, // 30 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    slowDown: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      delayAfter: 100, // allow 100 requests per 15 minutes, then...
      delayMs: 100, // begin adding 500ms of delay per request above 100:
    },
  },
  services: {
    sentry: {
      dsn:
        process.env.NODE_ENV !== 'development' ? process.env.SENTRY_DSN : null,
    },
  },
};

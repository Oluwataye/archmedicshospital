import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

// Remove ESM specific code since we are targeting CommonJS
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '../../data/archmedics_hms.db'),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, '../server/db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, '../../seeds'),
      extension: 'ts',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 0,
      max: 15,
      idleTimeoutMillis: 10000,
      acquireTimeoutMillis: 30000
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
      ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
      : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
      },
    pool: {
      min: 0,
      max: 20,
      idleTimeoutMillis: 10000,
      acquireTimeoutMillis: 30000
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default config;


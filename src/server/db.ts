import knex from 'knex';
import config from '../config/knexfile';

const isNetlify = !!process.env.NETLIFY || !!process.env.CONTEXT;
const hasDatabaseUrl = !!process.env.DATABASE_URL;

let environment = process.env.NODE_ENV || 'development';

if (isNetlify || hasDatabaseUrl) {
    environment = 'production';
}

console.log(`[DB] Environment: ${environment} (isNetlify: ${isNetlify}, hasDbUrl: ${hasDatabaseUrl})`);
const db = knex(config[environment]);

export default db;

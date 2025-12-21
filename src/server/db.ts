import knex from 'knex';
import config from '../config/knexfile';

const isNetlify = !!process.env.NETLIFY || !!process.env.CONTEXT || !!process.env.DEPLOY_PRIME_URL;
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const isProdEnv = process.env.NODE_ENV === 'production';

let environment = 'development';

if (isNetlify || hasDatabaseUrl || isProdEnv) {
    environment = 'production';
}

console.log(`[DB] Environment Selected: ${environment}`);
console.log(`[DB] Indicators - Netlify: ${isNetlify}, DB_URL: ${hasDatabaseUrl}, NODE_ENV: ${process.env.NODE_ENV}`);

const db = knex(config[environment]);

export default db;

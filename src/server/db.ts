import knex from 'knex';
import config from '../config/knexfile';

// Check for Netlify environment (sometimes these are missing at runtime in local logs but present in functions)
const isNetlifyFunctional = (typeof process !== 'undefined' && (!!process.env.NETLIFY || !!process.env.CONTEXT || !!process.env.LAMBDA_TASK_ROOT));
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Force production mode if on Netlify or if we have a DB URL
let environment = (process.env.NODE_ENV === 'development' && !isNetlifyFunctional) ? 'development' : 'production';

console.log(`[DB] Environment Selected: ${environment}`);
console.log(`[DB] Netlify: ${isNetlifyFunctional}, HAS_DB_URL: ${hasDatabaseUrl}`);

// Safeguard against SQLite crash in production
if (environment === 'production' && !hasDatabaseUrl && !process.env.DB_HOST) {
    throw new Error('PRODUCTION DATABASE NOT CONFIGURED. Please set DATABASE_URL in your environment variables.');
}

const db = knex(config[environment]);

export default db;

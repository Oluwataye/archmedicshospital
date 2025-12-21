import knex from 'knex';
import config from '../config/knexfile';

// Check for Netlify environment (sometimes these are missing at runtime in local logs but present in functions)
const isNetlifyFunctional = (typeof process !== 'undefined' && (!!process.env.NETLIFY || !!process.env.CONTEXT || !!process.env.LAMBDA_TASK_ROOT));
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Force production mode if on Netlify or if we have a DB URL
let environment = (process.env.NODE_ENV === 'development' && !isNetlifyFunctional) ? 'development' : 'production';

// Ultra-silent initialization to prevent Netlify from crashing during function cold-start
let db: any;
try {
    db = knex(config[environment]);
} catch (err) {
    // If it fails on startup, we log but don't crash
    console.error('[DB] Early initialization warning:', err.message);
    db = knex(config['development']);
}

export default db;

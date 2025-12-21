import knex from 'knex';
import config from '../config/knexfile';

// Check for Netlify environment (sometimes these are missing at runtime in local logs but present in functions)
const isNetlifyFunctional = (typeof process !== 'undefined' && (!!process.env.NETLIFY || !!process.env.CONTEXT || !!process.env.LAMBDA_TASK_ROOT));
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Force production mode if on Netlify or if we have a DB URL
let environment = (process.env.NODE_ENV === 'development' && !isNetlifyFunctional) ? 'development' : 'production';

console.log(`[DB] Environment Selected: ${environment}`);
console.log(`[DB] Netlify: ${isNetlifyFunctional}, HAS_DB_URL: ${hasDatabaseUrl}`);

// Lazy database initialization to prevent top-level crashes
let dbInstance: any = null;

const getDb = () => {
    if (dbInstance) return dbInstance;

    console.log(`[DB] Initializing for environment: ${environment}`);

    // Safeguard against SQLite crash in production
    if (environment === 'production' && !hasDatabaseUrl && !process.env.DB_HOST) {
        console.error('********************************************************************************');
        console.error('CRITICAL ERROR: PRODUCTION DATABASE NOT CONFIGURED.');
        console.error('Please set DATABASE_URL in your Netlify Environment Variables.');
        console.error('********************************************************************************');
        // We still try to initialize but it will likely fail on first query
    }

    try {
        dbInstance = knex(config[environment]);
        return dbInstance;
    } catch (err) {
        console.error('[DB] Initialization failed:', err);
        throw err;
    }
};

// Export a proxy or just a placeholder - for now, we'll keep the export but be careful
// Most routes use 'import db from "../db"', so we'll export a proxy or initialize late
const db = new Proxy({}, {
    get: (target, prop) => {
        const instance = getDb();
        return instance[prop];
    },
    apply: (target, thisArg, argumentsList) => {
        const instance = getDb();
        return instance.apply(thisArg, argumentsList);
    }
}) as any;

export default db;

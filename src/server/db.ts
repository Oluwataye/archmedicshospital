import knex from 'knex';
import config from '../config/knexfile';

const isNetlify = !!process.env.NETLIFY;
const environment = isNetlify ? 'production' : (process.env.NODE_ENV || 'development');

const db = knex(config[environment]);

export default db;

import knex from '../server/db';
import { logger } from '../utils/logger';

export async function connectDatabase() {
    try {
        // Test the database connection
        await knex.raw('SELECT 1');
        logger.info('Database connection established successfully');
    } catch (error) {
        logger.error('Failed to connect to database:', error);
        throw error;
    }
}

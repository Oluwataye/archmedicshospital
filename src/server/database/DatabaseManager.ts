import { Knex } from 'knex';
import knex from 'knex';
import NodeCache from 'node-cache';
import { logger } from '../utils/logger';

// Database configuration types
export interface DatabaseConfig {
    id: string;
    name: string;
    type: 'sqlite' | 'postgres' | 'mysql' | 'mssql';
    host?: string;
    port?: number;
    database: string;
    user?: string;
    password?: string;
    filename?: string; // For SQLite
    ssl?: boolean;
    pool?: {
        min: number;
        max: number;
    };
}

// External database configuration for NHIS/HMO
export interface ExternalDatabaseConfig extends DatabaseConfig {
    isExternal: true;
    apiEndpoint?: string; // For REST API fallback
    apiKey?: string;
    syncInterval?: number; // Minutes
    lastSync?: Date;
}

/**
 * Database Connection Manager
 * Manages multiple database connections including external NHIS/HMO databases
 */
export class DatabaseManager {
    private connections: Map<string, Knex> = new Map();
    private cache: NodeCache;
    private configs: Map<string, DatabaseConfig | ExternalDatabaseConfig> = new Map();

    constructor() {
        // Initialize cache with 5-minute TTL
        this.cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
    }

    /**
     * Register a database configuration
     */
    registerDatabase(config: DatabaseConfig | ExternalDatabaseConfig): void {
        this.configs.set(config.id, config);
        logger.info(`Database registered: ${config.name} (${config.type})`);
    }

    /**
     * Get or create a database connection
     */
    async getConnection(databaseId: string): Promise<Knex> {
        // Check if connection already exists
        if (this.connections.has(databaseId)) {
            return this.connections.get(databaseId)!;
        }

        const config = this.configs.get(databaseId);
        if (!config) {
            throw new Error(`Database configuration not found: ${databaseId}`);
        }

        // Create new connection
        const connection = await this.createConnection(config);
        this.connections.set(databaseId, connection);
        
        return connection;
    }

    /**
     * Create a new database connection based on type
     */
    private async createConnection(config: DatabaseConfig | ExternalDatabaseConfig): Promise<Knex> {
        let knexConfig: Knex.Config;

        switch (config.type) {
            case 'sqlite':
                knexConfig = {
                    client: 'better-sqlite3',
                    connection: {
                        filename: config.filename || config.database,
                    },
                    useNullAsDefault: true,
                };
                break;

            case 'postgres':
                knexConfig = {
                    client: 'pg',
                    connection: {
                        host: config.host,
                        port: config.port || 5432,
                        database: config.database,
                        user: config.user,
                        password: config.password,
                        ssl: config.ssl ? { rejectUnauthorized: false } : false,
                    },
                    pool: config.pool || { min: 2, max: 10 },
                };
                break;

            case 'mysql':
                knexConfig = {
                    client: 'mysql2',
                    connection: {
                        host: config.host,
                        port: config.port || 3306,
                        database: config.database,
                        user: config.user,
                        password: config.password,
                        ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
                    },
                    pool: config.pool || { min: 2, max: 10 },
                };
                break;

            case 'mssql':
                knexConfig = {
                    client: 'mssql',
                    connection: {
                        server: config.host!,
                        port: config.port || 1433,
                        database: config.database,
                        user: config.user,
                        password: config.password,
                        options: {
                            encrypt: config.ssl || false,
                            trustServerCertificate: true,
                        },
                    },
                    pool: config.pool || { min: 2, max: 10 },
                };
                break;

            default:
                throw new Error(`Unsupported database type: ${config.type}`);
        }

        const connection = knex(knexConfig);

        // Test connection
        try {
            await connection.raw('SELECT 1');
            logger.info(`Database connection established: ${config.name}`);
        } catch (error) {
            logger.error(`Failed to connect to database ${config.name}:`, error);
            throw error;
        }

        return connection;
    }

    /**
     * Execute a query with caching support
     */
    async query<T = any>(
        databaseId: string,
        queryBuilder: (knex: Knex) => Knex.QueryBuilder,
        cacheKey?: string,
        cacheTTL?: number
    ): Promise<T[]> {
        // Check cache first
        if (cacheKey) {
            const cached = this.cache.get<T[]>(cacheKey);
            if (cached) {
                logger.debug(`Cache hit for key: ${cacheKey}`);
                return cached;
            }
        }

        const connection = await this.getConnection(databaseId);
        const result = await queryBuilder(connection);

        // Cache the result
        if (cacheKey) {
            this.cache.set(cacheKey, result, cacheTTL || 300);
        }

        return result;
    }

    /**
     * Execute a raw SQL query
     */
    async rawQuery<T = any>(
        databaseId: string,
        sql: string,
        bindings?: any[]
    ): Promise<T[]> {
        const connection = await this.getConnection(databaseId);
        const result = await connection.raw(sql, bindings);
        
        // Handle different database return formats
        if (Array.isArray(result)) {
            return result;
        } else if (result.rows) {
            return result.rows;
        } else if (result[0]) {
            return result[0];
        }
        
        return result;
    }

    /**
     * Close a specific database connection
     */
    async closeConnection(databaseId: string): Promise<void> {
        const connection = this.connections.get(databaseId);
        if (connection) {
            await connection.destroy();
            this.connections.delete(databaseId);
            logger.info(`Database connection closed: ${databaseId}`);
        }
    }

    /**
     * Close all database connections
     */
    async closeAll(): Promise<void> {
        const closePromises = Array.from(this.connections.keys()).map(id =>
            this.closeConnection(id)
        );
        await Promise.all(closePromises);
        this.cache.flushAll();
        logger.info('All database connections closed');
    }

    /**
     * Clear cache for a specific key or all cache
     */
    clearCache(key?: string): void {
        if (key) {
            this.cache.del(key);
        } else {
            this.cache.flushAll();
        }
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return this.cache.getStats();
    }
}

// Singleton instance
export const dbManager = new DatabaseManager();

// Register default local database
dbManager.registerDatabase({
    id: 'local',
    name: 'Local Hospital Database',
    type: 'sqlite',
    database: './hospital.db',
    filename: './hospital.db',
});

export default dbManager;

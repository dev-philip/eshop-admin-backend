// databaseConnectionManager.ts
import { mysqlConfig } from './appConfig';
import { createPool, Pool, PoolOptions } from 'mysql2/promise';

class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private pool: Pool;

  private constructor(dbConfig: PoolOptions) {
    this.pool = createPool(dbConfig);
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      const dbConfig: PoolOptions = {
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        waitForConnections: mysqlConfig.waitForConnections,
        connectionLimit: mysqlConfig.connectionLimit,
        queueLimit: mysqlConfig.queueLimit,
      };

      DatabaseConnectionManager.instance = new DatabaseConnectionManager(dbConfig);
    }

    return DatabaseConnectionManager.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }
}

export default DatabaseConnectionManager;

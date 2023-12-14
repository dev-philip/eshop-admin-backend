// knexfile.js

const { mysqlConfig } = require('./config.json');

module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        database: mysqlConfig.database,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        host: mysqlConfig.host,
        port: mysqlConfig.port, 
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
      },
      seeds: {
        directory: './seeds',
      },
    },
  
    // Add configurations for other environments (production, testing) as needed
  };
  
const { Pool } = require("pg");

const pool = new Pool({
  // For local development, use the DATABASE_URL from .env
  // connectionString: process.env.DATABASE_URL,
  // For production, use the connection string from environment variable
  connectionString: Postgres.DATABASE_URL,
});

module.exports = pool;

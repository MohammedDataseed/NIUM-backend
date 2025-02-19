require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: '1234',
    database: 'nium-test',
    host: 'localhost', // Or the IP address if using external Docker networking
    dialect: 'postgres',
    pool: {
      max: Number(process.env.PGMAX) || 5,
      idle: Number(process.env.PGIDLETIMEOUT) || 10000,
    },
  },
  test: {
    username: process.env.PGUSER, // Match with .env
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    pool: {
      max: Number(process.env.PGMAX) || 5,
      idle: Number(process.env.PGIDLETIMEOUT) || 10000,
    },
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    pool: {
      max: Number(process.env.PGMAX) || 5,
      idle: Number(process.env.PGIDLETIMEOUT) || 10000,
    },
  },
};

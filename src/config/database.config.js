
// database.config.js
require("dotenv").config();
module.exports = {
  development: {
    username: "postgres",
    password: "1234",
    database: "nium-test",
    host: "localhost",
    dialect: "postgres", // Ensure this is here
    pool: {
      max: Number(process.env.PGMAX) || 5,
      idle: Number(process.env.PGIDLETIMEOUT) || 10000,
    },
  },
  test: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres", // Ensure this is here as well
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
    dialect: "postgres", // And here
    pool: {
      max: Number(process.env.PGMAX) || 5,
      idle: Number(process.env.PGIDLETIMEOUT) || 10000,
    },
  },
};

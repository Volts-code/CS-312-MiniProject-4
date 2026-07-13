const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "BlogDB",
    password: "modtib-baxxyg-Zupmy5",
    port: 5432
});

module.exports = pool;
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_auoIPV31efWT@ep-odd-hat-atwtlsa7-pooler.c-9.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  ssl: {
    rejectUnauthorized: false
  },
  port: 5432
});
export default pool;

const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function check() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });
    console.log("✅ Connected to MySQL server successfully!");
    
    const [rows] = await conn.query("SHOW DATABASES LIKE 'property_enhance'");
    if (rows.length === 0) {
      console.log("⚠️ Database 'property_enhance' does not exist. Creating it now...");
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      console.log("⏳ Executing schema.sql...");
      await conn.query(schemaSql);
      console.log("✅ Database and tables created successfully with seed data!");
    } else {
      console.log("✅ Database 'property_enhance' already exists. We are good to go!");
    }
    await conn.end();
  } catch(e) {
    console.error("❌ Connection failed:", e.message);
  }
}
check();

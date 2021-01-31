const { Pool } = require('pg');

const pg = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB || 'SmartSale',
  user: process.env.PG_USER || 'odoo',
  password: process.env.PG_PASSWORD || 'admin',
});

const connection = async functions => {
  const connect = await pg.connect();
  
  if(!connect) throw new Error('cannot connect postgres');
  console.log('connected');
}

module.exports = { pg, connection };

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

async function testConnection() {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT 1+1 AS result')
        console.log('Database connection successful', result.rows)

        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
        console.log('Tables in the database:', tables.rows)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        client.release()
        await pool.end()
    }
}

testConnection().catch(console.error)
require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

module.exports = {
    query: (text, params) => {
        return pool.query(text, params);
    }, 
    getClient: (callback) => {
        return pool.connect(callback);
    }
}
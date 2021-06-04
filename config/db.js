var { Client, Pool } = require('pg')

const connectionString = "postgres://ewkslsushvizll:27c927e6fa261124e6d7d68f8afa277aab559e4e1d558d29e7422d7c731c85e3@ec2-23-22-191-232.compute-1.amazonaws.com:5432/dba03rqcgigv56"

var getClient = () => {
    const client = new Client({
        ssl: {
            rejectUnauthorized: false
        },
        connectionString
    })
    return client
}

var getPool = () => {
    const pool = new Pool({
        ssl: {
            rejectUnauthorized: false
        },
        connectionString
    })
    return pool
}

module.exports = { getClient, getPool }
var pg = require('pg')

var getClient = async () => {
    const client = new Client({
        user: 'ewkslsushvizll',
        host: 'ec2-23-22-191-232.compute-1.amazonaws.com',
        database: 'dba03rqcgigv56',
        password: '27c927e6fa261124e6d7d68f8afa277aab559e4e1d558d29e7422d7c731c85e3',
        port: 5432
    })
    await client.connect()
    return client
}

module.exports = { getClient }
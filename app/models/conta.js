var getContaById = async (id, client) => {
    var result = await client.query(`select * from app.contausuario where id = ${id}`)
    return result.rows[0]
}

module.exports = { getContaById }
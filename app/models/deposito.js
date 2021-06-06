const dayjs = require('dayjs')

var criarBoleto = async (context, contaUsuarioId, boleto, client) => {
    try {
        await client.query("BEGIN")
        //gera codigo
        var codigo = await getCodigoBoleto(client, context)
        var result = await client.query(`insert into app.boleto (data_vencimento, codigo, valor, data_criacao, contaUsuarioId) values ($1, $2, $3, $4, $5) returning *`,
            [boleto.data_vencimento, codigo, boleto.valor, dayjs(), contaUsuarioId])
        var createdBoleto = result.rows[0]
        result = await client.query(`update app.contausuario set saldo_bancario = saldo_bancario + $1 where id = $2`, [boleto.valor, contaUsuarioId])

        await client.query("COMMIT")
        return createdBoleto
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    }
}

var getCodigoBoleto = async (client, context) => {
    var codigo = context.services.utils.generateNumberString(48)
    var result = await client.query(`select * from app.boleto where codigo = '${codigo}'`)
    if (result.rows.length > 0) {
        codigo = await getCodigoBoleto(client, context)
    }
    return codigo
}

module.exports = { criarBoleto }
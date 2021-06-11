const dayjs = require("dayjs")

var getContaById = async (id, client) => {
    var result = await client.query(`select * from app.contausuario where id = ${id}`)
    return result.rows[0]
}

var transferir = async (transferencia, contausuarioid, client) => {
    try {
        await client.query("BEGIN")
        var result = null
        result = await client.query(`select * from app.contabancaria where numero_conta = $1 and numero_agencia = $2 and numero_banco = $3`,
            [transferencia.numero_conta, transferencia.numero_agencia, transferencia.numero_banco])
        var contaBancariaId, contaExternaId;
        if (result.rows.length == 0) {
            //cria conta bancaria
            result = await client.query(`insert into app.contabancaria (numero_conta, numero_agencia, numero_banco) values ($1, $2, $3) returning *`,
                [transferencia.numero_conta, transferencia.numero_agencia, transferencia.numero_banco])
            contaBancariaId = result.rows[0].id
            //cria conta externa
            result = await client.query(`insert into app.contaexterna (titularidade, cnpj_cpf, tipo_pessoa, contabancariaid) values ($1, $2, $3, $4) returning *`,
                [transferencia.titularidade, transferencia.cnpj_cpf, transferencia.tipo_pessoa, contaBancariaId])
            contaExternaId = result.rows[0].id
        } else {
            contaBancariaId = result.rows[0].id
            result = await client.query(`select * from app.contaexterna where contabancariaid = ${contaBancariaId}`)
            contaExternaId = result.rows[0].id
        }
        //transferencia
        await client.query(`insert into app.transferenciabancaria (valor, data_solicitacao, tipo_transacao, contaexternaid, contausuarioid) values ($1, $2, $3, $4, $5) returning *`,
            [transferencia.valor, dayjs(), transferencia.tipo_transferencia, contaExternaId, contausuarioid])
        //tira do saldo bancário
        await client.query(`update app.contausuario set saldo_bancario = saldo_bancario - $1 where id = $2`, [transferencia.valor, contausuarioid])
        await client.query("COMMIT")
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    }
}

module.exports = { getContaById, transferir }
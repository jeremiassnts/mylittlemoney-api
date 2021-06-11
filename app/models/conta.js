var getContaById = async (id, client) => {
    var result = await client.query(`select * from app.contausuario where id = ${id}`)
    return result.rows[0]
}

var transferir = async (transferencia, contausuarioid, client) => {
    try {
        await client.query("BEGIN")
        //cria conta bancaria
        var result = await client.query(`insert into app.contabancaria (numero_conta, numero_agencia, numero_banco) values ($1, $2, $3) returning *`,
            [transferencia.numero_conta, transferencia.numero_agencia, transferencia.numero_banco])
        const { id: contaBancariaId } = result.rows[0]
        //cria conta externa
        result = await client.query(`insert into app.contaexterna (titularidade, cnpj_cpf, tipo_pessoa, contabancariaid) values ($1, $2, $3, $4) returning *`,
            [transferencia.titularidade, transferencia.cnpj_cpf, transferencia.tipo_pessoa, contaBancariaId])
        //tira do saldo bancário
        await client.query(`update app.contausuario set saldo_bancario = saldo_bancario - $1 where id = $2`, [transferencia.valor, contausuarioid])
        await client.query("COMMIT")
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    }
}

module.exports = { getContaById, transferir }
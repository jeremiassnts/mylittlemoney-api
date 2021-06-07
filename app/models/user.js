var sjcl = require('sjcl')

var create = async (user, client) => {
    try {
        await client.query("BEGIN")

        //cria endereco
        // var result = await client.query(`insert into app.endereco (cep, logradouro, numero, bairro, cidade, estado, pais, complemento) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
        //     [user.cep, user.logradouro, user.numero, user.bairro, user.cidade, user.estado, user.pais, user.complemento])
        // const { id: enderecoId } = result.rows[0]

        //cria telefone
        // result = await client.query(`insert into app.telefone (ddi, ddd, numero) values ($1, $2, $3) returning *`, [user.ddi, user.ddd, user.telefone])
        // const { id: telefoneId } = result.rows[0]

        //cria conta bancaria
        var numero_conta = await getNumeroConta(client)
        result = await client.query(`insert into app.contabancaria (numero_conta, numero_agencia, numero_banco) values ($1, $2, $3) returning *`, [numero_conta, '001', '123'])
        const { id: contaBancariaId } = result.rows[0]

        //cria conta usuario
        result = await client.query(`insert into app.contausuario (saldo_bancario, ativo, contabancariaid) values ($1, $2, $3) returning *`, [0, true, contaBancariaId])
        const { id: contaUsuarioId } = result.rows[0]

        //cria usuário
        const bits = sjcl.hash.sha256.hash(user.senha)
        const hash = sjcl.codec.hex.fromBits(bits)
        result = await client.query(`insert into app.usuario (nome, username, email, senha, cpf, rg, contausuarioid)`
            + ` values ($1, $2, $3, $4, $5, $6, $7) returning *`,
            [user.nome, "", user.email, hash, "", "", contaUsuarioId])

        await client.query("COMMIT")
        return result.rows[0]
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    }
}

var getUserByEmail = async (email, client) => {
    var result = await client.query(`select * from app.usuario where email = '${email}'`)
    return result.rows[0]
}

var getUserById = async (id, client) => {
    var result = await client.query(`select * from app.usuario where id = ${id}`)
    return result.rows[0]
}

var getCompleteUserById = async (id, client) => {
    var result = await client.query(`select * from app.usuario where id = ${id}`)
    var user = result.rows[0]

    result = await client.query(`select * from app.telefone where id = ${user.telefoneid}`)
    if (result.rows.length > 0) {
        delete user.telefoneid
        user.telefone = result.rows[0]
        delete user.telefone.id
    }

    result = await client.query(`select * from app.endereco where id = ${user.enderecoid}`)
    if (result.rows.length > 0) {
        delete user.enderecoid
        user.endereco = result.rows[0]
        delete user.endereco.id
    }

    result = await client.query(`select * from app.contausuario where id = ${user.contausuarioid}`)
    if (result.rows.length > 0) {
        delete user.contausuarioid
        user.contausuario = result.rows[0]
        delete user.contausuario.id

        result = await client.query(`select * from app.contabancaria where id = ${user.contausuario.contabancariaid}`)
        user.contausuario.contabancaria = result.rows[0]
        delete user.contausuario.contabancaria.id
    }

    delete user.id
    delete user.senha

    return user
}

var getNumeroConta = async (client) => {
    var n = Math.floor(Math.random() * 100000000);
    var numero_conta = `${new Array(9 - n.toString().length).fill(0).join("")}${n}`
    var result = await client.query(`select * from app.contabancaria where numero_conta = '${numero_conta}'`)
    if (result.rows.length > 0) {
        numero_conta = await getNumeroConta(client)
    }
    return numero_conta
}

var edit = async (userId, fields, client) => {
    try {
        await client.query("BEGIN")

        var result = await client.query(`update app.usuario set nome = '${fields.nome}', ocupacao = '${fields.ocupacao}' where id = ${userId} returning *`)
        const { telefoneid } = result.rows[0]

        await client.query(`update app.telefone set ddi = '${fields.ddi}', ddd = '${fields.ddd}', numero = '${fields.telefone}' where id = ${telefoneid}`)

        await client.query("COMMIT")
        return result.rows[0]
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    }
}

module.exports = { create, getUserByEmail, getUserById, edit, getCompleteUserById }
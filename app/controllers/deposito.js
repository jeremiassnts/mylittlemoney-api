var criarBoleto = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var boleto = req.body
        var user = await context.models.user.getUserById(req.userId, pool)
        var createdBoleto = await context.models.deposito.criarBoleto(context, user.contausuarioid, boleto, pool)

        await pool.end()
        res.json({
            error: false,
            boleto: {
                valor: createdBoleto.valor,
                data_vencimento: createdBoleto.data_vencimento,
                pagador: user.nome,
                cpf: user.cpf,
                codigo: createdBoleto.codigo
            }
        })
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

var criarDeposito = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var deposito = req.body
        var user = await context.models.user.getUserById(req.userId, pool)
        await context.models.deposito.criarDeposito(user.contausuarioid, deposito, pool)

        await pool.end()
        res.json({
            error: false,
            message: "Depósito realizado com sucesso"
        })
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

module.exports = { criarBoleto, criarDeposito }
var getResumoInvestimentos = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = await context.models.user.getUserById(req.userId, pool)
        var result = await context.models.investimento.getResumoInvestimentos(context, user.contausuarioid, pool)
        res.json({
            error: false,
            result
        })
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

var realizarInvestimento = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = await context.models.user.getUserById(req.userId, pool)
        var investimento = req.body
        await context.models.investimento.realizarInvestimento(context, user.contausuarioid, investimento, pool)
        res.json({
            error: false,
            message: "Investimento criado com sucesso"
        })
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

var getTitulos = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var tipo = req.query.tipo.toLowerCase()
        var titulos = context.models.investimento.getTitulos(tipo)
        res.json({
            error: false,
            titulos
        })
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

module.exports = { getResumoInvestimentos, realizarInvestimento, getTitulos }
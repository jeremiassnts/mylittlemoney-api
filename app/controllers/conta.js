var getResumo = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        //usuario
        var user = await context.models.user.getUserById(req.userId, pool)
        //conta
        var contaUsuario = await context.models.conta.getContaById(user.contausuarioid, pool)
        //investimentos
        var totalInvestido = await context.models.investimento.getTotalInvestido(contaUsuario.id, pool)
        var ultimosInvestimentos = await context.models.investimento.getUltimosInvestimentos(contaUsuario.id, 10, pool)
        //historico
        var historico = await context.models.historico.getHistoricoPorMes(contaUsuario.id, pool)

        res.json({
            nome: user.nome,
            saldo: contaUsuario.saldo_bancario,
            totalInvestido,
            ultimosInvestimentos,
            historico
        })

    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

module.exports = { getResumo }
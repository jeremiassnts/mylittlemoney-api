var getResumo = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = await context.models.user.getUserById(req.userId, pool)
        var historico = await context.models.historico.getHistoricoPorUsuario(context, user.contausuarioid, pool, true)
        res.json({
            error: false,
            ...historico
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
var getResumoInvestimentos = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = await context.models.user.getUserById(req.userId, pool)
        var result = await context.models.investimento.getResumoInvestimentos(user.contausuarioid, pool)
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

module.exports = { getResumoInvestimentos }
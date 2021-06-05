var getHistoricoPorMes = async (contaUsuarioId, client) => {
    var result = await client.query(`select TO_DATE(h.data::TEXT, 'MM/YYYY') as date, SUM(h.valor_real) as valor from app.historicoinvestimento h`
        + ` join app.investimentorendafixa i on i.id = h.investimentoid`
        + ` where i.contausuarioid = ${contaUsuarioId}`
        + ` group by TO_DATE(h.data::TEXT, 'MM/YYYY')`)
    return result.rows
}

module.exports = { getHistoricoPorMes }
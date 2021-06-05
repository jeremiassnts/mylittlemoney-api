var getTotalInvestido = async (contaUsuarioId, client) => {
    var result = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contaUsuarioId}`)
    var total = result.rows.reduce((s, e) => s + e.valor_aplicado, 0)
    return total
}

var getUltimosInvestimentos = async (contaUsuarioId, top, client) => {
    var result = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contaUsuarioId} order by data_agendamento desc limit ${top}`)
    return result.rows
}

module.exports = { getTotalInvestido, getUltimosInvestimentos }
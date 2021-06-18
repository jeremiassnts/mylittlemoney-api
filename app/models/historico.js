const dayjs = require("dayjs")

var getHistorioPorUsuario = async (context, contausuarioid, client) => {
    var { rows } = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contausuarioid}`)
    var historico_map = {}
    for (var i = 0; i < rows.length; i++) {
        var investimento = rows[i]
        var historico = getHistoricoPorInvestimento(context, investimento)
        for (var j = 0; j < historico.length; j++) {
            if (historico_map.hasOwnProperty(historico[j].date)) {
                historico_map[historico[j].date].valor_real += historico[j].valor_real
            } else {
                historico_map[historico[j].date] = { ...historico[j] }
            }
        }
    }
    var historico_final = Object.keys(historico_map)
        .sort((a, b) => (dayjs(historico_map[a].date).isAfter(dayjs(historico_map[b].date)) ? 1 : -1))
        .map(key => {
            return {
                date: dayjs(historico_map[key].date).format('YYYY-MM'),
                valor_real: historico_map[key].valor_real
            }
        })
        

    return historico_final
}

var getHistoricoPorInvestimento = (context, investimento) => {
    //calcula meses de historico
    var months = dayjs().diff(investimento.data_agendamento, 'month')
    historico = [{
        date: dayjs(investimento.data_agendamento).format('YYYY-MM'),
        valor_real: investimento.valor_aplicado
    }]
    //calcular rentabilidade mensal
    var meses_investidos = dayjs(investimento.data_validade).diff(investimento.data_agendamento, 'month')
    var rentabilidade_mensal = (investimento.rentabilidade_prevista - 100) / meses_investidos
    //calcula tamanho do historico
    var totalMeses = months > meses_investidos ? meses_investidos : months
    for (var i = 0; i < totalMeses; i++) {
        var { vliquido } = context.services.utils.calcularRendimento(investimento.valor_aplicado, investimento.tarifa, 100 + (rentabilidade_mensal * (i + 1)))
        historico.push({
            date: dayjs(investimento.data_agendamento).add(i + 1, 'month').format('YYYY-MM'),
            valor_real: vliquido
        })
    }

    return historico
}

module.exports = { getHistorioPorUsuario }
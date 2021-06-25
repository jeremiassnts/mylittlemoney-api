const dayjs = require("dayjs")

var getHistoricoPorUsuario = async (context, contausuarioid, client, completo = false) => {
    var { rows } = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contausuarioid}`)
    var historico_map = {}
    for (var i = 0; i < rows.length; i++) {
        var investimento = rows[i]
        var historico = getHistoricoAnualPorInvestimento(context, investimento)
        if (completo) {
            historico = historico.concat(getHistoricoMensalPorInvestimento(context, investimento))
        }

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
            var h = historico_map[key]
            return {
                date: dayjs(h.date).format('YYYY-MM' + (h.isDay ? "-DD" : "")),
                valor_real: h.valor_real,
                isDay: h.isDay
            }
        })


    if (completo) {
        return {
            anual: historico_final.filter(h => !h.isDay).map(h => {
                return {
                    date: h.date,
                    valor_real: h.valor_real
                }
            }),
            mensal: historico_final.filter(h => h.isDay).map(h => {
                return {
                    date: h.date,
                    valor_real: h.valor_real
                }
            })
        }
    } else {
        return historico_final.map(h => {
            return {
                date: h.date,
                valor_real: h.valor_real
            }
        })
    }
}

var getHistoricoAnualPorInvestimento = (context, investimento) => {
    //calcula meses de historico
    var months = dayjs().diff(investimento.data_agendamento, 'month')
    var historico = [{
        date: dayjs(investimento.data_agendamento).format('YYYY-MM'),
        valor_real: investimento.valor_aplicado,
        isDay: false
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
            valor_real: vliquido,
            isDay: false
        })
    }

    return historico
}

var getHistoricoMensalPorInvestimento = (context, investimento) => {
    var today = dayjs()
    var primeiro_dia_mes = dayjs(today.format('YYYY-MM'))
    var agendamento = dayjs(investimento.data_agendamento)
    var validade = dayjs(investimento.data_validade)
    //verifica se investimento está dentro do mês
    if (agendamento.isAfter(today) || validade.isBefore(primeiro_dia_mes)) {
        return []
    }
    //define dias que serão consultados
    var dia_inicial, dia_final;
    if (agendamento.isBefore(primeiro_dia_mes)) {
        dia_inicial = primeiro_dia_mes
    } else {
        dia_inicial = agendamento
    }

    if (validade.isBefore(today)) {
        dia_final = validade
    } else {
        dia_final = today
    }
    //guarda apenas inteiros
    dia_inicial = parseInt(dia_inicial.format("DD"))
    dia_final = parseInt(dia_final.format("DD"))
    //calcula acumulado mensal
    var meses_investidos = validade.diff(agendamento, 'month')
    var rentabilidade_mensal = (investimento.rentabilidade_prevista - 100) / meses_investidos
    var total_ja_rendido = today.diff(agendamento, 'month') * rentabilidade_mensal
    //calcula rentabilidade diaria
    var rentabilidade_diaria = rentabilidade_mensal / 30
    //calcula rendimentos
    var historico = []
    for (var i = dia_inicial; i <= dia_final; i++) {
        var { vliquido } = context.services.utils.calcularRendimento(investimento.valor_aplicado, investimento.tarifa, 100 + total_ja_rendido + (rentabilidade_diaria * i))
        historico.push({
            date: primeiro_dia_mes.add(i - 1, 'day').format('YYYY-MM-DD'),
            valor_real: vliquido,
            isDay: true
        })
    }

    return historico
}

module.exports = { getHistoricoPorUsuario }
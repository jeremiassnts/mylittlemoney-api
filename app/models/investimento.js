const cdb = require('../data/CDB_data.json')
const lca = require('../data/LCA_data.json')
const lci = require('../data/LCI_data.json')
const ipca = require('../data/IPCA_data.json')
const dayjs = require('dayjs')

var getTotalInvestido = async (contaUsuarioId, client) => {
    var result = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contaUsuarioId}`)
    var total = result.rows.reduce((s, e) => s + e.valor_aplicado, 0)
    return total
}

var getUltimosInvestimentos = async (contaUsuarioId, top, client) => {
    var result = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contaUsuarioId} order by data_agendamento desc limit ${top}`)
    var investimentos = result.rows.sort((a, b) => (dayjs(b.data_agendamento).isAfter(dayjs(a.data_agendamento)) ? 1 : -1))
    return investimentos
}

var getResumoInvestimentos = async (context, contaUsuarioId, client) => {
    var total = await getTotalInvestido(contaUsuarioId, client)
    var atividade = await getUltimosInvestimentos(contaUsuarioId, 20, client)
    var historico = await context.models.historico.getHistorioPorUsuario(context, contaUsuarioId, client)
    return {
        total,
        atividade,
        historico
    }
}

var getTitulos = (tipo) => {
    var titulos = {
        cdb,
        lca,
        lci,
        ipca
    }
    if (tipo) {
        return {
            [tipo]: titulos[tipo]
        }
    } else {
        return titulos
    }
}

var realizarInvestimento = async (context, contaUsuarioId, investimento, client) => {
    try {
        await client.query("BEGIN")
        //verifica saldo
        var result = await client.query(`select * from app.contausuario where id = ${contaUsuarioId}`)
        if(result.rows[0].saldo_bancario < investimento.valor_aplicado){
            throw "Saldo insuficiente"
        }

        const { vbruto, vliquido } = context.services.utils.calcularRendimento(investimento.valor_aplicado, investimento.tarifa, investimento.rentabilidade_prevista)
        await client.query('insert into app.InvestimentoRendaFixa (valor_aplicado, valor_bruto, valor_liquido, tarifa, data_validade, data_agendamento, ativo, rentabilidade_prevista, contaUsuarioId) ' +
            'values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *',
            [investimento.valor_aplicado, vbruto, vliquido, investimento.tarifa, investimento.data_validade, investimento.data_agendamento, true, investimento.rentabilidade_prevista, contaUsuarioId])
        //retira da conta
        await client.query(`update app.contausuario set saldo_bancario = saldo_bancario - $1 where id = $2`, [transferencia.valor, contaUsuarioId])
        await client.query("COMMIT")
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    }
}

module.exports = { getTotalInvestido, getUltimosInvestimentos, getResumoInvestimentos, realizarInvestimento, getTitulos }
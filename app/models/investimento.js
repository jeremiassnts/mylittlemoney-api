const cdb = require('../data/CDB_data.json')
const lca = require('../data/LCA_data.json')
const lci = require('../data/LCI_data.json')
const ipca = require('../data/IPCA_data.json')

var getTotalInvestido = async (contaUsuarioId, client) => {
    var result = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contaUsuarioId}`)
    var total = result.rows.reduce((s, e) => s + e.valor_aplicado, 0)
    return total
}

var getUltimosInvestimentos = async (contaUsuarioId, top, client) => {
    var result = await client.query(`select * from app.investimentorendafixa where contausuarioid = ${contaUsuarioId} order by data_agendamento desc limit ${top}`)
    return result.rows
}

var getResumoInvestimentos = async (contaUsuarioId, client) => {
    var total = await getTotalInvestido(contaUsuarioId, client)
    var atividade = await getUltimosInvestimentos(contaUsuarioId, 20, client)
    return {
        total,
        atividade,
        titulos: {
            cdb,
            lca,
            lci,
            ipca
        }
    }
}

module.exports = { getTotalInvestido, getUltimosInvestimentos, getResumoInvestimentos }
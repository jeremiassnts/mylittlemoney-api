const dayjs = require('dayjs')
const dayjsRandom = require('dayjs-random')
dayjs.extend(dayjsRandom)
const fs = require("fs")

const nTitulos = 30
const tipo = "IPCA"
const maxTarifa = 4, minTarifa = 0
const maxRent = 120, minRent = 100

let titulos = []
for (var i = 0; i < nTitulos; i++) {
    let tarifa = parseFloat((Math.random() * (maxTarifa - minTarifa) + minTarifa).toFixed(2))
    let data_validade = dayjs.future(2)
    let rentabilidade = parseFloat((Math.random() * (maxRent - minRent) + minRent).toFixed(2))
    let dias = data_validade.diff(dayjs(), 'day')
    
    let nome = `${tipo} + ${tarifa}% a.a.`
    titulos.push({
        nome,
        tarifa,
        data_validade,
        rentabilidade
    })
}

var data = JSON.stringify(titulos)
fs.writeFile(`${tipo}_data.json`, data, (err) => {
    console.log(err)
})
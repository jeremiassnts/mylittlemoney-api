var generateNumberString = (length) => {
    var result = [];
    var characters = '0123456789';
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }
    return result.join('');
}

var calcularRendimento = (vlr, tarifa, rentabilidade) => {
    var vbruto = vlr * (rentabilidade / 100)
    var tarifa_aplicada = (vbruto - vlr) * (1 - (tarifa / 100))
    var vliquido = vlr + tarifa_aplicada
    return {
        vbruto,
        vliquido
    }
}

module.exports = { generateNumberString, calcularRendimento }
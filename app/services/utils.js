function generateNumberString(length) {
    var result = [];
    var characters = '0123456789';
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }
    return result.join('');
}

module.exports = { generateNumberString }
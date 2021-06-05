const jwt = require('jsonwebtoken')

var verifyJwt = (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.replace("Bearer", "").trim() : null
    if (!token) {
        res.status(401).json({ error: true, auth: false, message: 'Nenhum token enviado.' });
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) res.status(500).json({ error: true, auth: false, message: 'Autorização negada' })
            req.userId = decoded.id
            next()
        })
    }
}

module.exports = { verifyJwt }
require('dotenv-safe').config()
const jwt = require('jsonwebtoken')
const sjcl = require('sjcl')

var criarUsuario = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = req.body
        //verifica se usuário existe
        var dbUser = await context.models.user.get(user.username, user.email, pool)
        if (dbUser) {
            await pool.end()
            res.status(400).json({
                error: true,
                message: "Usuário já existe"
            })
        } else {
            var createdUser = await context.models.user.create(user, pool)
            await pool.end()
            res.status(201).json({
                error: false,
                user: {
                    nome: createdUser.nome,
                    username: createdUser.username,
                    email: createdUser.email
                }
            })
        }
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

var login = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = req.body
        const bits = sjcl.hash.sha256.hash(user.senha)
        const hash = sjcl.codec.hex.fromBits(bits)
        var result = await pool.query(`select * from app.usuario where email = '${user.email}' and senha = '${hash}'`)
        if (result.rows.length > 0) {
            const token = jwt.sign({ id: result.rows[0].id }, process.env.SECRET, { expiresIn: '5 days' })
            await pool.end()
            res.json({
                error: false,
                auth: true,
                token
            })
        } else {
            await pool.end()
            res.status(400).json({
                error: true,
                auth: false,
                token: null
            })
        }
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            auth: false,
            message: error.stack
        })
    }
}

var editarUsuario = async (context, req, res) => {
    var pool = context.services.db.getPool()
    try {
        var user = req.body
        await context.models.user.edit(req.userId, user, pool)
        await pool.end()
        res.json({
            error: false,
            auth: true,
            message: "Editado com sucesso"
        })
    } catch (error) {
        await pool.end()
        res.status(400).json({
            error: true,
            auth: false,
            message: error.stack
        })
    }
}

module.exports = { criarUsuario, login, editarUsuario }
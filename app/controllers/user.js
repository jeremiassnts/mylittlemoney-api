var criarUsuario = async (context, req, res) => {
    var client = context.database.db.getPool()
    try {
        var user = req.body
        // client.connect()
        //verifica se usuário existe
        var dbUser = await context.models.user.get(user.username, user.email, client)
        if (dbUser) {
            await client.end()
            res.status(400).json({
                error: true,
                message: "Usuário já existe"
            })
        } else {
            var createdUser = await context.models.user.create(user, client)
            await client.end()
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
        await client.end()
        res.status(400).json({
            error: true,
            message: error.stack
        })
    }
}

module.exports = { criarUsuario }
module.exports = (context) => {
    context.post('/criarusuario', (req, res) => context.app.controllers.user.criarUsuario(context, req, res))
}
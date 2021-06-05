module.exports = (context) => {
    context.post('/criarusuario', (req, res) => context.controllers.user.criarUsuario(context, req, res))
}
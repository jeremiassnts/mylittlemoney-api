module.exports = (context) => {
    context.post('/user/login', (req, res) => context.controllers.user.login(context, req, res))
    context.post('/user/criarusuario', (req, res) => context.controllers.user.criarUsuario(context, req, res))
}
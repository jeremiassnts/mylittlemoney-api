module.exports = (context) => {
    context.post('/user/login', (req, res) => context.controllers.user.login(context, req, res))
    context.post('/user/criarusuario', (req, res) => context.controllers.user.criarUsuario(context, req, res))
    
    context.put('/user/editarusuario', context.services.auth.verifyJwt, (req, res) => context.controllers.user.editarUsuario(context, req, res))
}
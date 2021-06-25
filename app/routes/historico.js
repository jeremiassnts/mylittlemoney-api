module.exports = (context) => {
    context.get('/historico/getResumo', context.services.auth.verifyJwt, (req, res) => context.controllers.historico.getResumo(context, req, res))
}
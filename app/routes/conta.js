module.exports = (context) => {
    context.get('/conta/resumo', context.services.auth.verifyJwt, (req, res) => context.controllers.conta.getResumo(context, req, res))
}
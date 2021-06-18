module.exports = (context) => {
    context.get('/investimento/getResumo', context.services.auth.verifyJwt, (req, res) => context.controllers.investimento.getResumoInvestimentos(context, req, res))
    context.post('/investimento/realizarInvestimento', context.services.auth.verifyJwt, (req, res) => context.controllers.investimento.realizarInvestimento(context, req, res))
}
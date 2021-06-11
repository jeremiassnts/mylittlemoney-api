module.exports = (context) => {
    context.post("/deposito/criarBoleto", context.services.auth.verifyJwt, (req, res) => context.controllers.deposito.criarBoleto(context, req, res))
    context.post("/deposito/criarDeposito", context.services.auth.verifyJwt, (req, res) => context.controllers.deposito.criarDeposito(context, req, res))
}
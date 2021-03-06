# MyLittleMoney API

## Acesso
    http://my-little-money-api.herokuapp.com
## Autenticação
    Cabeçalho Authorization com Bearer Token
## Rotas
### Usuário
    GET /user/getUsuario
        Rota para buscar usuário baseada em token de autenticação
    POST /user/login
        Rota para requisitar um token baseado em um objeto { email, senha }
    POST /user/criarusuario
        Rota para criar usuário baseado em um objeto { nome, email, senha }
    PUT /user/editarusuario
        Rota autenticada para realizar edição de usuário com objeto { user: { nome, username, cpf, rg, ocupacao }, telefone: { ddi, ddd, telefone }, endereco: { cep, logradouro, numero, bairro, cidade, estado, pais, complemento } }
### Conta
    GET /conta/resumo
        Rota para buscar resumo de conta de usuário baseada em token de autenticação
    POST /conta/transferir
        Rota para realizar transferência para uma conta externa partindo de usuário autenticado com objeto { valor, numero_conta, numero_agencia, numero_banco, titularidade, cnpj_cpf, tipo_pessoa, tipo_transferencia }
### Depósito
    POST /deposito/criarBoleto
        Rota autenticada para criar boleto associado a conta de usuário com objeto { data_vencimento, valor }
    POST /deposito/criarDeposito
        Rota autenticada para criar depósito na conta do usuário com objeto { valor }
### Investimento
    GET /investimento/getResumo
        Rota autenticada para buscar resumo da tela de investimentos
    GET /investimento/getTitulos
        Rota autentiada para buscar os títulos disponíveis, é possível enviar nos parâmetros o filtro por tipo -> ex: /investimento/gettitulos?tipo=lca
    POST /investimento/realizarInvestimento
        Rota autenticada para criar investimento associado a conta de usuário com objeto { valor_aplicado, tarifa, data_validade, data_agendamento, rentabilidade_prevista }
### Histórico
    GET /historico/getResumo
        Rota autenticada para buscar resumo da tela de histórico (anual e mensal)

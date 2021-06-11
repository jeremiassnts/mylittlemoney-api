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
        Rota autenticada para realizar edição de usuário com objeto { user: {...}, telefone: {...}, endereco: {...} }
### Conta
    GET /conta/resumo
        Rota para buscar resumo de conta de usuário baseada em token de autenticação
### Depósito
    POST /deposito/criarBoleto
        Rota autenticada para criar boleto associado a conta de usuário com objeto { data_vencimento, valor }
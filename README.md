# Documentação Postman - Expenses Crud

## Iniciar o Projeto

### Para iniciar o projeto, siga as instruções abaixo:

### - **Clone o Repositorio**

### **.ENV**

O arquivo .env.example é um modelo que contém variáveis de ambiente com valores padrão ou de exemplo para configurar o ambiente de desenvolvimento ou produção de um projeto. O arquivo é utilizavel, basta criar conta no Brevo para utilizar os envios de email, conforme [tutorial](https://medium.com/@chiragmehta900/how-to-send-mail-in-node-js-with-nodemailer-in-typescript-889cc46d1437).

Aqui está a explicação de cada variável:

- **PORT_APP**: Porta em que o servidor da aplicação será executado.

- **NODE_ENV**: Define o ambiente de execução da aplicação, neste caso, definido como dev para desenvolvimento.

- **DATA_BASE_USER**: Usuário do banco de dados.

- **DATA_BASE_PASSWORD**: Senha do banco de dados.

- **DATA_BASE_NAME**: Nome do banco de dados a ser utilizado pela aplicação.

- **PORT**: Porta do banco de dados.

- **DATA_BASE_DIALECT**: Dialeto do banco de dados, neste caso, MySQL.

- **PASS_SALT**: Sal utilizado para criar senhas criptografadas.

- **SECRET_KEY**: Chave secreta utilizada para assinar tokens JWT.

- **DURATION_TOKEN**: Duração de validade dos tokens JWT, definido como "5d" para 5 dias.

- **SMTP_HOST**: Host do servidor SMTP para envio de e-mails.

- **SMTP_PORT**: Porta do servidor SMTP.

- **SMTP_USERNAME**: Nome de usuário para autenticação no servidor SMTP.

- **SMTP_PASSWORD**: Senha para autenticação no servidor SMTP.
  Essas variáveis devem ser configuradas no arquivo .env real com os valores específicos do seu ambiente de desenvolvimento ou produção. Este arquivo .env.example serve como um guia para garantir que todas as variáveis necessárias sejam definidas corretamente. Certifique-se de não incluir o arquivo .env real no controle de versão para manter as informações sensíveis seguras. Em vez disso, inclua apenas o .env.example para orientação.

### **Instale as Dependências:**

- Utilizando Yarn:

  ```bash
  yarn install
  ```

- Utilizando npm:

  ```bash
  npm install
  ```

## **Rode o banco de dados**

- A aplicação e o banco de dados são dockerizados. Mas o banco pode rodar de forma independente, caso queira rodar a aplicação fora do container.

### Executar banco de dados:

- Com o Docker e o Docker Compose já instalados, execute o seguinte comando:

```bash
  sudo docker-compose up mysql_staging
```

### **Inicie o Servidor de Desenvolvimento:**

- Utilizando Yarn:

  ```bash
  yarn dev
  ```

- Utilizando npm:

  ```bash
  npm run dev
  ```

### Executar aplicação e banco de dados:

- Com o Docker e o Docker Compose já instalados, execute o seguinte comando:

```bash
  sudo docker-compose ups
```

Este comando irá construir e iniciar os contêineres conforme definido no arquivo docker-compose.yml. O parâmetro -d executa os contêineres em segundo plano.

## Postman

- A aplicação inclui uma coleção Postman na raiz do projeto chamada "Expenses - API REST.postman_collection", que abrange todas as requisições atualmente disponíveis. Você pode facilmente importá-la para o Postman para começar a explorar as funcionalidades da API.

- Para simplificar o processo de realização de requisições autenticadas, basta criar um usuário através da requisição "Login". O token gerado como resposta a essa requisição será automaticamente replicado para todas as outras requisições que exigem autenticação. Dessa forma, você pode acessar facilmente todas as funcionalidades que requerem token sem precisar gerenciá-lo manualmente a cada solicitação.

# DBSLP - Database System Learning Platform

DBSLP é uma plataforma web que objetiva auxiliar o aprendizado de banco de dados relacionais, provendo ferramentas que possibilitam a modelagem e execução de sistemas de banco de dados diretamente no browser. Além disso, possibilita a criação de sessões colaborativas para as ferramentas de modelagem, de forma que estudantes e discentes possam ser aproximados.

# Usos

DBSLP provê as seguintes funcionalidades:

- Modelagem de sistemas de banco de dados relacionais, provendo ferramentas CASE para definição de modelos conceituais e lógicos conforme os modelos ER e modelo relacional, respectivamente.

- Execução de scripts SQL diretamente no browser por meio de uma instância de SQLite provida pelo pacote [sql.js](https://github.com/sql-js/sql.js )

- Criação de sessões colaborativas, possibilitando que diversos computadores compartilhem um mesmo ambiente de modelagem.

# Como testar

O sistema é dividido em dois ambientes, a aplicação do cliente e um servidor de broadcast para as sessões colaborativas.

Este projeto é a aplicação do cliente.

Para obter o projeto

1. Clonar o repositório

    git clone https://github.com/Manvin1/DBSLP.git


Para testar em desenvolvimento

1. Criar um arquivo .env na raiz do projeto conforme especificado em '.copy.env'.
2. Garantir que VITE_NODE_ENV em .env é 'DEVELOPMENT'.
3. Caso se queira sessões compartilhadas, é necessário lançar um [servidor de broadcast](https://github.com/Manvin1/dbslp-y-websocket), ao qual seu URL deve ser definido no .env. Por exemplo, no modo de desenvolvimento:
   
    VITE_SOCKET_SERVER_URL = ws://localhost:myPort

4. Lançar o servidor do cliente, que executará, por padrão, na porta 5173.

    npm run dev

# Sobre o Servidor de Broadcast

DBSLP usa o servidor provido pela equipe do yjs como servidor de broadcast, ao qual o fork pode ser encontrado [aqui](https://github.com/Manvin1/dbslp-y-websocket).

# Live Demo

A aplicação do cliente pode ser acessada [aqui](https://dbslp.netlify.app/).

O servidor de broadcast usado foi [este](https://api-dbslp.onrender.com/).
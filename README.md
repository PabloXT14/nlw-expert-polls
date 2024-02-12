<h1 align="center">
  <img
    src=".github/nlw-expert-logo.png"
    title="Logo NLW Expert"
    alt="Logo NLW Expert"
    width="30px"
  />
  NLW Expert (Node.js)
</h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/pabloxt14/nlw-expert-polls">

  <img alt="GitHub Top Language" src="https://img.shields.io/github/languages/top/pabloxt14/nlw-expert-polls" />

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/pabloxt14/nlw-expert-polls">
  
  <a href="https://github.com/pabloxt14/nlw-expert-polls/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/pabloxt14/nlw-expert-polls">
  </a>
    
   <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">

   <a href="https://github.com/pabloxt14/nlw-expert-polls/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/pabloxt14/nlw-expert-polls?style=social">
  </a>
</p>

<p>
  <img src=".github/cover.png" alt="Capa do projeto" />
</p>

<h4 align="center"> 
	🚀 Aplicação finalizada 🚀
</h4>

<p align="center">
 <a href="#-about">About</a> | 
 <a href="#-requisites">Requisites</a> | 
 <a href="#-setup">Setup</a> | 
 <a href="#-http-routes">HTTP Routes</a> | 
 <a href="#-websocket-routes">Websocket Routes</a> | 
 <a href="#-license">License</a>
</p>

## 💻 About

Um sistema de votação em tempo real em que os usuários podem criar uma enquete e outros usuários podem votar. O sistema gera uma classificação entre as opções e atualiza os votos em tempo real.

Vale ressaltar que este projeto foi desenvolvido durante o evento **NLW** oferecido pela [Rocketseat](https://www.rocketseat.com.br/).

---

## 📝 Requisites

Antes de baixar o projeto você vai precisar ter instalado na sua máquina as seguintes ferramentas:

* [Git](https://git-scm.com)
* [NodeJS](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) 
* Para o banco de dados ter o [Docker](https://www.docker.com/) para baixar as imagens dos bancos PostgreSQL e Redis que utilizamos na aplicação.

Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

> Para mais detalhes das dependências gerais da aplicação veja o arquivo [package.json](./package.json)

---

## ⚙ Setup

Passo a passo para clonar e executar a aplicação na sua máquina:

```bash
# Clone este repositório
$ git clone git@github.com:pabloxt14/nlw-expert-polls.git

# Instale as dependências
$ npm install

# Configurar PostgreSQL e Redis
$ docker compose up -d

# Crie uma arquivo .env e preencha conforme apresentado no arquivo .env.example
$ cp .env.example .env

# Criar as migrations no banco com o Prisma
$ npx prisma migrate dev

# Execute a aplicação em modo de desenvolvimento
$ npm run dev
```

Teste! (Eu pessoalmente recomendo testar a aplicação com o [Hoppscotch](https://hoppscotch.io/)).

---

## HTTP Routes

### POST `/polls`

Cria uma nova enquete.

#### Request body

```json
{
  "title": "Qual a melhor linguagem de programação?",
  "options": [
    "JavaScript",
    "Java",
    "PHP",
    "C#"
  ]
}
```

#### Response body

```json
{
  "pollId": "194cef63-2ccf-46a3-aad1-aa94b2bc89b0"
}
```

### GET `/polls/:pollId`

Retorna os dados de uma única enquete.

#### Response body

```json
{
	"poll": {
		"id": "e4365599-0205-4429-9808-ea1f94062a5f",
		"title": "Qual a melhor linguagem de programação?",
		"options": [
			{
				"id": "4af3fca1-91dc-4c2d-b6aa-897ad5042c84",
				"title": "JavaScript",
				"score": 1
			},
			{
				"id": "780b8e25-a40e-4301-ab32-77ebf8c79da8",
				"title": "Java",
				"score": 0
			},
			{
				"id": "539fa272-152b-478f-9f53-8472cddb7491",
				"title": "PHP",
				"score": 0
			},
			{
				"id": "ca1d4af3-347a-4d77-b08b-528b181fe80e",
				"title": "C#",
				"score": 0
			}
		]
	}
}
```

### POST `/polls/:pollId/votes`

Adiciona um voto a uma enquete específica.

#### Request body

```json
{
  "pollOptionId": "31cca9dc-15da-44d4-ad7f-12b86610fe98"
}
```

#### Response body

```json
{
  "message": "Votado com sucesso!"
}
```

---

## WebSocket Routes

### ws `/polls/:pollId/results`

#### Message

```json
{
  "pollOptionId": "da9601cc-0b58-4395-8865-113cbdc42089",
  "votes": 2
}
```

---

## 📝 License

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais informações

---

<p align="center">
  Feito com 💜 por Pablo Alan 👋🏽 <a href="https://www.linkedin.com/in/pabloalan/" target="_blank">Entre em contato!</a>  
</p>

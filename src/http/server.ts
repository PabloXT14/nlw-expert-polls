import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'

const app = fastify()

app.register(cookie, {
  secret: 'nlw-expert-poll', // for cookies signature
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
})

app.register(createPoll)
app.register(getPoll)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })

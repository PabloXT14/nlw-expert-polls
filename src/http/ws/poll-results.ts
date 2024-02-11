import { FastifyInstance } from 'fastify'

export async function pollResults(app: FastifyInstance) {
  // Aplicando pattern Pub/Sub (Publisher/Subscriber)
  app.get(
    '/polls/:pollId/results',
    {
      websocket: true,
    },
    (connection) => {
      // Inscrever apenas nas mensagens publicadas no canal com o ID da enquete (`pollId`)
      connection.socket.on('message', (message: string) => {
        connection.socket.send('you sent: ' + message)

        setInterval(() => {
          connection.socket.send('Hi')
        }, 1000)
      })
    },
  )
}

import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'
import { voting } from '../../utils/voting-pub-sub'

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviewsVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      })

      if (
        userPreviewsVoteOnPoll &&
        userPreviewsVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        // Apagar o voto anterior e criar um novo
        await prisma.vote.delete({
          where: {
            id: userPreviewsVoteOnPoll.id,
          },
        })

        // Apagando o voto anterior e criando um novo (na mesma esquete) no Redis
        const votes = await redis.zincrby(
          pollId,
          -1,
          userPreviewsVoteOnPoll.pollOptionId,
        )

        // Dando aviso ao websocket de novo voto
        voting.publish(pollId, {
          pollOptionId: userPreviewsVoteOnPoll.pollOptionId,
          votes: Number(votes),
        })
      } else if (userPreviewsVoteOnPoll) {
        return reply
          .status(400)
          .send({ message: 'Você já votou nesta enquete' })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    })

    // Incrementando em 1 a quantidade de votos de uma opção específica dentro de uma enquete específica no Redis
    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, { pollOptionId, votes: Number(votes) })

    return reply.status(201).send({ message: 'Votado com sucesso!' })
  })
}

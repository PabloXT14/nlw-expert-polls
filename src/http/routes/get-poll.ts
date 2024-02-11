import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!poll) {
      return reply.status(404).send({ message: 'Enquete não encontrada' })
    }

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const votes = result.reduce(
      (accumulator, current, index) => {
        if (index % 2 === 0) {
          const score = Number(result[index + 1])
          accumulator[current] = score
        }
        return accumulator
      },
      {} as Record<string, number>,
    )

    const pollWithVotes = {
      id: poll.id,
      title: poll.title,
      options: poll.options.map((option) => {
        return {
          ...option,
          score: votes[option.id] ?? 0,
        }
      }),
    }

    return reply.send({ poll: pollWithVotes })
  })
}

import { user } from '@prisma/client'
import { database } from '../utils/database'

export const enrollUser = async ({ id: userId }: Pick<user, 'id'>, id: string) => {
  return database.enrollement.create({
    data: {
      user: {
        connect: { id: userId }
      },
      course: {
        connect: { id: id }
      }
    }
  })
}

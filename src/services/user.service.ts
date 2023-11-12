import { user } from '@prisma/client'
import bcrypt from 'bcrypt'
import { UserRegister } from 'src/types'
import { database } from '../utils/database'

export const createUser = (user: UserRegister) => {
  user.password = bcrypt.hashSync(user.password, 12)

  return database.user.create({
    data: {
      name: user.name,
      password: user.password,
      email: user.email
    }
  })
}

export const findUserByMail = ({ email }: Pick<UserRegister, 'email'>) => {
  return database.user.findFirstOrThrow({
    where: {
      email: email
    }
  })
}

export const deleteUser = ({ id }: Pick<user, 'id'>) => {
  return database.user.update({
    where: {
      id: id
    },
    data: {
      delete: true
    }
  })
}

export const countUsers = async () => {
  const result = await database.user.groupBy({
    by: ['delete'],
    _count: {
      _all: true
    }
  })

  const totalCount = result.reduce((acc, entry) => {
    return acc + (entry._count?._all || 0)
  }, 0)

  return {
    totalCount,
    activeUsers: result.find((entry) => entry.delete === false)?._count?._all || 0,
    notActiveUsers: result.find((entry) => entry.delete === true)?._count?._all || 0
  }
}

module.exports = { createUser, findUserByMail, deleteUser, countUsers }

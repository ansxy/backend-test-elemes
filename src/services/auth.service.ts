import { database } from '../utils/database'
import { hashToken } from '../utils/hashToken'

interface RefreshToken {
  jti: string
  refreshToken: string
  userId: string
}

export const addRefreshTokenWhiteList = ({ jti, refreshToken, userId }: RefreshToken) => {
  const hashRefreshToken = hashToken(refreshToken)
  return database.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashRefreshToken,
      userId
    }
  })
}

export const deleteRefreshToken = ({ jti }: Pick<RefreshToken, 'jti'>) => {
  return database.refreshToken.delete({
    where: {
      id: jti
    }
  })
}

export const revokeToken = ({ jti }: RefreshToken) => {
  return database.refreshToken.update({
    where: {
      id: jti
    },
    data: {
      revoked: true
    }
  })
}

export const findRefreshTokenById = (jti: string | undefined) => {
  return database.refreshToken.findUniqueOrThrow({
    where: {
      id: jti
    },
    include: {
      user: true
    }
  })
}

module.exports = { deleteRefreshToken, addRefreshTokenWhiteList, revokeToken, findRefreshTokenById }

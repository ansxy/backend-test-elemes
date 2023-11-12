import { user } from '@prisma/client'
import jwt, { Secret } from 'jsonwebtoken'

export const generateAccessToken = (user: user): string => {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: '1m'
  })
}

export const generateRefreshToken = (user: user, jti: string) => {
  return jwt.sign(
    {
      userId: user.id,
      jti
    },
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: '8h'
    }
  )
}

export const generateToken = async (user: user, jti: string) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user, jti)

  return {
    accessToken,
    refreshToken
  }
}
module.exports = { generateAccessToken, generateToken, generateRefreshToken }

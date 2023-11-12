import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload, Secret, TokenExpiredError } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { addRefreshTokenWhiteList, deleteRefreshToken, findRefreshTokenById } from '../services/auth.service'
import { hashToken } from '../utils/hashToken'
import { generateToken } from '../utils/jwt'

export interface UserRequest extends Request {
  user?: string | JwtPayload | undefined
}

export const verifyToken = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  } else {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret, async (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          await verifyRefreshToken(req, res, next)
        } else {
          return res.status(401).json({ error: 'Unauthorized' })
        }
      } else {
        req.user = decoded
        next()
      }
    })
  }
}

export const requireAdmin = (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.user && typeof req.user === 'object' && 'role' in req.user) {
    if (req.user.role === 'ADMIN') {
      next()
    } else {
      return res.status(401).json({ error: 'Forbidden: Insufficient privileges' })
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export const verifyRefreshToken = async (req: UserRequest, res: Response, next: NextFunction) => {
  const cookie = req.cookies['refreshToken']
  if (!cookie) {
    return res.status(401).json({ error: 'Unauthorized' })
  } else {
    const payload = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET as Secret)
    if (payload && typeof payload === 'object') {
      const savedRefreshToken = await findRefreshTokenById(payload?.jti)
      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        return res.status(401).json({ error: 'Token Revoked' })
      }

      const hashedToken = hashToken(cookie)
      if (hashedToken !== savedRefreshToken.hashedToken) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      if (savedRefreshToken.userId !== payload?.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      await deleteRefreshToken({ jti: savedRefreshToken.id })
      const jti = uuidv4()
      const { accessToken, refreshToken } = await generateToken(savedRefreshToken.user, jti)
      await addRefreshTokenWhiteList({ jti: jti, refreshToken: refreshToken, userId: savedRefreshToken.user.id })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      res.set('authorization', accessToken)
      if (!accessToken) {
        res.status(401).json({ error: 'Unauthorized' })
      } else {
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as Secret, async (err, decoded) => {
          req.user = decoded
        })
      }
    }
    next()
  }
}

module.exports = { verifyToken, requireAdmin, verifyRefreshToken }

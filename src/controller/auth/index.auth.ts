import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { addRefreshTokenWhiteList, deleteRefreshToken, findRefreshTokenById } from '../../services/auth.service'
import { createUser, findUserByMail } from '../../services/user.service'
import { UserRegister } from '../../types/index'
import { hashToken } from '../../utils/hashToken'
import { generateToken } from '../../utils/jwt'

export const create = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: UserRegister = req.body
    const jti = uuidv4()
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailRegex.test(email)) {
      throw new Error('invalid Email Format')
    } else {
      const data = await createUser({ name, email, password })
      const { accessToken, refreshToken } = await generateToken(data, jti)
      await addRefreshTokenWhiteList({ jti, refreshToken, userId: data.id })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      res.status(201).json({
        name: data.name,
        email: data.email,
        accessToken: accessToken
      })
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(409).json({
        status: 'fail',
        message: 'Email Already Exist'
      })
    } else {
      res.status(500).json({
        error
      })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  const jti = uuidv4()
  try {
    const { email, password }: Pick<UserRegister, 'email' | 'password'> = req.body
    const isEmailExist = await findUserByMail({ email: email })
    const checkPassword = await bcrypt.compare(password, isEmailExist.password)
    if (!checkPassword) {
      throw new Error('Email Or Password Wrong')
    } else {
      const { accessToken, refreshToken } = await generateToken(isEmailExist, jti)
      await addRefreshTokenWhiteList({
        jti,
        refreshToken,
        userId: isEmailExist.id
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: accessToken
        }
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        status: 'fail',
        message: error.message
      })
    } else {
      res.status(500).send(error)
    }
  }
}

export const getRefreshToken = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies['refreshToken']
    if (!cookie) {
      return res.status(401).json({ error: 'Unauthorized' })
    } else {
      const payload = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET as Secret)
      if (payload && typeof payload === 'object') {
        const savedRefreshToken = await findRefreshTokenById(payload?.jti)
        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
          return res.status(401).json({ error: 'Unauthorized' })
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
        res.set('Authorization', accessToken)
        res.status(200).send({ accessToken })
      }
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = { create, login, getRefreshToken }

import { PrismaClientValidationError } from '@prisma/client/runtime/library'
import { Request, Response } from 'express'
import { createCategory, getAllCategory, popularCategory } from '../../services/category.service'

interface categoryRequest {
  name: string
}

export const get = async (req: Request, res: Response) => {
  try {
    const data = await getAllCategory()
    res.status(200).json({
      status: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

export const create = async (req: Request, res: Response) => {
  const { name }: categoryRequest = req.body
  try {
    const newCategory = await createCategory(name)
    res.status(201).json({
      status: 'success',
      data: newCategory
    })
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      res.status(400).json({
        status: 'fail',
        message: `Data name is ${name} must be include and type string`
      })
    } else {
      res.status(500).json({
        error
      })
    }
  }
}

export const popular = async (req: Request, res: Response) => {
  try {
    const data = await popularCategory()
    res.status(200).json({
      status: 'success',
      data: data
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

module.exports = { create, popular, get }

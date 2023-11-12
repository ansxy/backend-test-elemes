import { course } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import { Request, Response } from 'express'
import { createCourse, getAllCourse, getCourseById, searchCourse } from '../../services/course.service'

export const get = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const data = await getCourseById(req.params.id as string)
      res.status(200).json({
        status: 'success',
        data: data
      })
    } else {
      const data = await getAllCourse()
      res.status(200).json({
        status: 'success',
        data: data
      })
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(404).json({
        status: 'fail',
        message: error.message
      })
    } else {
      res.status(500).json({
        error
      })
    }
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const { name, price, description, categoryId }: course = req.body
    const data = await createCourse(name, price, description, categoryId)
    res.status(201).json({
      status: 'success',
      data: {
        name: data.name,
        price: data.price.toString(),
        description: data.description,
        categoryId: data.categoryId
      }
    })
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      res.status(400).json({
        status: 'fail',
        message: `All Required Data Must Included`
      })
    } else {
      console.log(error)
      res.status(500).json({
        error
      })
    }
  }
}

export const search = async (req: Request<object, object, object, { name?: string }>, res: Response) => {
  try {
    const { name } = req.query
    const data = await searchCourse(name as string)

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

module.exports = { get, create, search }

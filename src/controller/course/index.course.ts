import { course } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import { Request, RequestParamHandler, Response } from 'express'
import { UserRequest } from '../../middleware/verifyToken.middleware'
import {
  createCourse,
  deleteCourse,
  getAllCourse,
  getCourseById,
  searchCourse,
  sortCourseByPrice,
  updateCourse
} from '../../services/course.service'
import { enrollUser } from '../../services/enrollment.service'
import { SortCourse } from '../../types/index'
import { cloudUploud } from '../../utils/cloudinary'

export interface CourseParams extends RequestParamHandler {
  id: string
}

export const get = async (req: Request, res: Response) => {
  try {
    if (req.query.id) {
      const data = await getCourseById(req.query.id as string)
      res.status(200).json({
        status: 'success',
        data: data
      })
    } else {
      if (req.query.sort) {
        const data = await sortCourseByPrice({ sort: req.query.sort } as SortCourse)
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
    const numericPrice = parseFloat(price.toString())
    const image = await cloudUploud(req.file?.path as string)
    const data = await createCourse(name, numericPrice, description, categoryId, image.url)
    res.status(201).json({
      status: 'success',
      data: {
        name: data.name,
        price: data.price.toString(),
        description: data.description,
        categoryId: data.categoryId,
        image: image.url
      }
    })
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      res.status(400).json({
        status: 'fail',
        message: error.message
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

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, price, description }: Pick<course, 'id' | 'name' | 'price' | 'description'> = req.body
    const data = await updateCourse({ id, name, price, description })
    res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(404).json({
        status: 'fail',
        message: error.meta?.cause
      })
    } else {
      res.status(500).send(error)
    }
  }
}
export const del = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await deleteCourse(id)
    res.status(200).json({ status: 'success', data: data })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(404).json({
        status: 'fail',
        message: error.meta?.cause
      })
    } else {
      res.status(500).send(error)
    }
  }
}

export const enrollment = async (req: UserRequest, res: Response) => {
  try {
    if (req.user && typeof req.user === 'object' && 'userId' in req.user) {
      const { id } = req.params
      const data = await enrollUser({ id: req.user.userId }, id)
      return res.status(201).json({
        status: 'success',
        data: data
      })
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(409).json({
        status: 'fail',
        message: error.meta?.cause
      })
    } else {
      res.status(500).send(error)
    }
  }
}

module.exports = { get, create, search, update, del, enrollment }

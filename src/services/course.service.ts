import { course } from '@prisma/client'
import { SortCourse } from 'src/types'
import { database } from '../utils/database'

export const createCourse = (
  name: string,
  price: number,
  description: string,
  categoryId: string,
  image: string
): Promise<course> => {
  return database.course.create({
    data: {
      name: name,
      price: price,
      description: description,
      image: image,
      categoryId: categoryId
    }
  })
}

export const getAllCourse = (): Promise<course[]> => {
  return database.course.findMany({})
}

export const getCourseById = (id: string): Promise<course> => {
  return database.course.findFirstOrThrow({
    where: {
      id: id
    },
    include: {
      category: true
    }
  })
}

export const updateCourse = ({
  id,
  name,
  price,
  description
}: Pick<course, 'id' | 'name' | 'price' | 'description'>): Promise<course> => {
  const updatedAt = new Date().toISOString()

  return database.course.update({
    where: {
      id: id
    },
    data: {
      name: name != null ? name : undefined,
      price: price != null ? price : undefined,
      description: description != null ? description : undefined,
      updateAt: updatedAt
    }
  })
}

export const softDelete = ({ id }: course): Promise<course> => {
  return database.course.update({
    where: {
      id: id
    },
    data: {
      delete: true
    }
  })
}
export const deleteCourse = (id: string): Promise<course> => {
  return database.course.delete({
    where: {
      id: id
    }
  })
}

export const searchCourse = (name: string): Promise<course[]> => {
  return database.course.findMany({
    where: {
      name: {
        contains: name
      }
    }
  })
}

export const countCourse = async () => {
  const result = await database.course.groupBy({
    by: ['price'],
    _count: {
      _all: true
    }
  })
  const totalCount = result.reduce((acc, entry) => {
    return acc + (entry._count?._all || 0)
  }, 0)

  return {
    totalCount,
    paidCourse: result.find((entry) => entry.price !== 0)?._count?._all || 0,
    freeCourse: result.find((entry) => entry.price === 0)?._count?._all || 0
  }
}

export const sortCourseByPrice = async ({ sort }: SortCourse) => {
  switch (sort) {
    case 'lowest':
      return database.course.findMany({
        orderBy: {
          price: 'asc'
        }
      })
    case 'highest':
      return database.course.findMany({
        orderBy: {
          price: 'desc'
        }
      })
    case 'free':
      return database.course.findMany({
        where: {
          price: 0
        }
      })
    default:
      throw new Error('Invalid Sort Option')
  }
}

module.exports = {
  createCourse,
  updateCourse,
  softDelete,
  getAllCourse,
  getCourseById,
  searchCourse,
  countCourse,
  deleteCourse,
  sortCourseByPrice
}

import { category } from '@prisma/client'
import { PopularCategory } from 'src/types'
import { database } from '../utils/database'

export const findCategoryById = (id: string): Promise<category[]> => {
  return database.category.findMany({
    where: {
      id: id
    },
    include: {
      coruse: true
    }
  })
}

export const createCategory = (name: string): Promise<category | null> => {
  return database.category.create({
    data: {
      name: name
    }
  })
}

export const getAllCategory = (): Promise<category[]> => {
  return database.category.findMany({})
}

export const popularCategory = async (): Promise<PopularCategory[]> => {
  const data = await database.category.findMany({
    select: {
      id: true,
      name: true,
      coruse: {
        select: {
          id: true,
          enrollement: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })
  const formatedCategory: PopularCategory[] = data.map((category) => ({
    categoryId: category.id,
    categoryName: category.name,
    enrollementCount: category.coruse.reduce(
      (count, course) => count + (course.enrollement ? course.enrollement.length : 0),
      0
    )
  }))

  formatedCategory.sort((value, preValue) => preValue.enrollementCount - value.enrollementCount)
  return formatedCategory
}

module.exports = { findCategoryById, createCategory, popularCategory, getAllCategory }

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Request, Response } from 'express'
import { countCourse } from '../../services/course.service'
import { countUsers, deleteUser } from '../../services/user.service'

export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const id = req.params.id
      await deleteUser({ id })
      res.status(200).json({ status: 'success', message: 'User soft deleted successfully' })
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(404).json({ message: error.meta?.cause })
    } else {
      res.status(500).json({ message: 'Error deleting user' })
    }
  }
}

export const simpleStatistic = async (req: Request, res: Response) => {
  try {
    const user = await countUsers()
    const course = await countCourse()

    res.send({
      user: user,
      course: course
    })
  } catch (error) {
    res.send(error)
  }
}

module.exports = { softDeleteUser, simpleStatistic }

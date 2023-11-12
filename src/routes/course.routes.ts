import { get, search } from '../controller/course/index.course'
import { verifyToken } from '../middleware/verifyToken.middleware'
import { createNewRouter } from '../utils/router'

export const courseRoute = createNewRouter()

courseRoute.get('/search/:name?', verifyToken, search)
courseRoute.get('/:id?', verifyToken, get)

module.exports = { courseRoute }

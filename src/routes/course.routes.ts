import { enrollment, get, search } from '../controller/course/index.course'
import { verifyToken } from '../middleware/verifyToken.middleware'
import { createNewRouter } from '../utils/router'

export const courseRoute = createNewRouter()

courseRoute.get('/search/:name?', verifyToken, search)
courseRoute.get('/', verifyToken, get)
courseRoute.post('/enrollment/:id', verifyToken, enrollment)

module.exports = { courseRoute }

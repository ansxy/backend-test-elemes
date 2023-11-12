import { create, get, popular } from '../controller/category/index.category'
import { requireAdmin, verifyToken } from '../middleware/verifyToken.middleware'
import { createNewRouter } from '../utils/router'

export const categoryRoute = createNewRouter()

categoryRoute.post('/', [verifyToken, requireAdmin], create)
categoryRoute.get('/popular', popular)
categoryRoute.get('/', get)

module.exports = { categoryRoute }

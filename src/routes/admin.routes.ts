import { simpleStatistic, softDeleteUser } from '../controller/admin/index.admin'
import * as category from '../controller/category/index.category'
import * as course from '../controller/course/index.course'
import { requireAdmin, verifyRefreshToken, verifyToken } from '../middleware/verifyToken.middleware'
import { createNewRouter } from '../utils/router'

export const adminRoute = createNewRouter()

adminRoute.put('/user/:id', [verifyToken, requireAdmin], softDeleteUser)
adminRoute.post('/cetegory', [verifyToken, requireAdmin], category.create)
adminRoute.post('/course', [verifyToken, requireAdmin], course.create)
adminRoute.get('/simple-statistic', [verifyToken, requireAdmin, verifyRefreshToken], simpleStatistic)

module.exports = { adminRoute }

import { simpleStatistic, softDeleteUser } from '../controller/admin/index.admin'
import * as category from '../controller/category/index.category'
import * as course from '../controller/course/index.course'
import { requireAdmin, verifyRefreshToken, verifyToken } from '../middleware/verifyToken.middleware'
import { multerUploud } from '../utils/multer'
import { createNewRouter } from '../utils/router'

export const adminRoute = createNewRouter()

adminRoute.put('/user/:id', [verifyToken, requireAdmin], softDeleteUser)
adminRoute.post('/cetegory', [verifyToken, requireAdmin], category.create)
adminRoute.post('/course', [verifyToken, requireAdmin, multerUploud], course.create)
adminRoute.put('/course/:id', [verifyToken, requireAdmin], course.update)
adminRoute.delete('/course/:id', [verifyToken, requireAdmin], course.del)
adminRoute.get('/simple-statistic', [verifyToken, requireAdmin, verifyRefreshToken], simpleStatistic)

module.exports = { adminRoute }

import { create, getRefreshToken, login } from '../controller/auth/index.auth'
import { createNewRouter } from '../utils/router'

export const userRoute = createNewRouter()

userRoute.post('/register', create)
userRoute.post('/login', login)
userRoute.get('/refresh-token', getRefreshToken)

module.exports = { userRoute }

import cookieParser from 'cookie-parser'
import express, { Application, Request, Response } from 'express'
import { adminRoute } from './routes/admin.routes'
import { categoryRoute } from './routes/category.routes'
import { courseRoute } from './routes/course.routes'
import { userRoute } from './routes/user.routes'

export const app: Application = express()
const port = process.env.PORT || 8000

declare global {
  interface BigInt {
    toJSON(): string | number
  }
}

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString())
  return Number.isNaN(int) ? this.toString() : int
}

app.use(express.json())
app.use(cookieParser())

app.use('/', userRoute)
app.use('/admin', adminRoute)

app.use('/category', categoryRoute)
app.use('/course', courseRoute)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    author: 'Ansar Fadillah',
    email: 'ansarfadillah17@gmail.com',
    documentation: 'https://github.com/ansxy/backend-test-elemes/'
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

module.exports = { app }

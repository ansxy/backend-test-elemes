import { Request } from 'express'

export interface PopularCategory {
  categoryId: string
  categoryName: string
  enrollementCount: number
}

export interface RequestParams extends Request {
  id: string
  name: string
}

export interface UserRegister {
  name: string
  email: string
  password: string
}

export interface SortCourse {
  sort: 'lowest' | 'highest' | 'free'
}

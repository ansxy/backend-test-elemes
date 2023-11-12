import { RequestHandler } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
const multerStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, './uplouds')
  },
  filename: (request, file, callback) => {
    const random = uuidv4()
    callback(null, `${random}.png`)
  }
})

export const multerUploud: RequestHandler = multer({ storage: multerStorage }).single('file')

module.exports = { multerUploud }

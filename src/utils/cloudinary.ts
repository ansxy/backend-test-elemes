import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const cloudUploud = async (file: string) => {
  return await cloudinary.v2.uploader.upload(
    file,
    (err: cloudinary.UploadApiErrorResponse, result: cloudinary.UploadApiResponse) => {
      return result
    }
  )
}

module.exports = { cloudUploud }

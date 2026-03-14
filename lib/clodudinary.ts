import { v2 as cloudinary } from "cloudinary"

let configured = false

function ensureConfigured() {
  if (configured) {
    return
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary configuration")
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  })

  configured = true
}

const cloudinaryClient = {
  uploader: cloudinary.uploader,
  config: ensureConfigured
}

export default cloudinaryClient


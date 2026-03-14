import { CLOUDINARY_DELIVERY_TRANSFORMS, type ImageDeliveryPreset } from "@/lib/image-presets"

const CLOUDINARY_HOST = "res.cloudinary.com"
const UPLOAD_MARKER = "/upload/"

export function isCloudinaryUrl(url: string) {
  return url.includes(CLOUDINARY_HOST) && url.includes(UPLOAD_MARKER)
}

export function buildCloudinaryImageUrl(url: string, preset: ImageDeliveryPreset) {
  if (!url || !isCloudinaryUrl(url)) {
    return url
  }

  const markerIndex = url.indexOf(UPLOAD_MARKER)
  const prefix = url.slice(0, markerIndex + UPLOAD_MARKER.length)
  const suffix = url.slice(markerIndex + UPLOAD_MARKER.length)
  const versionIndex = suffix.search(/v\d+\//)
  const assetPath = versionIndex >= 0 ? suffix.slice(versionIndex) : suffix

  return `${prefix}${CLOUDINARY_DELIVERY_TRANSFORMS[preset]}/${assetPath}`
}

export function buildCloudinaryDownloadUrl(fileUrl: string) {
  if (!fileUrl || !isCloudinaryUrl(fileUrl)) {
    return fileUrl
  }

  const markerIndex = fileUrl.indexOf(UPLOAD_MARKER)
  return `${fileUrl.slice(0, markerIndex + UPLOAD_MARKER.length)}fl_attachment/${fileUrl.slice(markerIndex + UPLOAD_MARKER.length)}`
}

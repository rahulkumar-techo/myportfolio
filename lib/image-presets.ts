export type ImageUploadKind = "avatar" | "cover" | "gallery" | "asset-image"

export type ImageDeliveryPreset =
  | "avatar"
  | "thumbnail"
  | "gallery"
  | "hero"
  | "asset-preview"

type ImageUploadPreset = {
  width: number
  height: number
  minBytes: number
  maxBytes: number
  outputType: "image/webp"
  mode: "cover" | "contain"
  maxQuality: number
  minQuality: number
}

export const IMAGE_UPLOAD_PRESETS: Record<ImageUploadKind, ImageUploadPreset> = {
  avatar: {
    width: 500,
    height: 500,
    minBytes: 100 * 1024,
    maxBytes: 200 * 1024,
    outputType: "image/webp",
    mode: "cover",
    maxQuality: 0.9,
    minQuality: 0.76
  },
  cover: {
    width: 1600,
    height: 900,
    minBytes: 250 * 1024,
    maxBytes: 500 * 1024,
    outputType: "image/webp",
    mode: "cover",
    maxQuality: 0.9,
    minQuality: 0.76
  },
  gallery: {
    width: 1200,
    height: 700,
    minBytes: 200 * 1024,
    maxBytes: 400 * 1024,
    outputType: "image/webp",
    mode: "contain",
    maxQuality: 0.9,
    minQuality: 0.76
  },
  "asset-image": {
    width: 1600,
    height: 1600,
    minBytes: 150 * 1024,
    maxBytes: 2 * 1024 * 1024,
    outputType: "image/webp",
    mode: "contain",
    maxQuality: 0.9,
    minQuality: 0.72
  }
}

export const CLOUDINARY_DELIVERY_TRANSFORMS: Record<ImageDeliveryPreset, string> = {
  avatar: "f_webp,q_auto:best,fl_strip_profile,c_fill,g_face,w_500,h_500",
  thumbnail: "f_webp,q_auto:best,fl_strip_profile,c_fill,g_auto,w_600,h_400",
  gallery: "f_webp,q_auto:best,fl_strip_profile,c_fit,w_1200,h_700",
  hero: "f_webp,q_auto:best,fl_strip_profile,c_fill,g_auto,w_1600,h_900",
  "asset-preview": "f_webp,q_auto:good,fl_strip_profile,c_fit,w_600,h_600"
}

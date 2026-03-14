"use client"

import { IMAGE_UPLOAD_PRESETS, type ImageUploadKind } from "@/lib/image-presets"

const COMPRESSIBLE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"])

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Unable to read image."))
    }

    image.src = objectUrl
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

function replaceExtension(fileName: string, extension: string) {
  return fileName.replace(/\.[^.]+$/, "") + extension
}

function drawImageToCanvas(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  mode: "cover" | "contain"
) {
  const widthRatio = targetWidth / image.width
  const heightRatio = targetHeight / image.height
  const scale = mode === "cover" ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio)
  const scaledWidth = image.width * scale
  const scaledHeight = image.height * scale
  const offsetX = (targetWidth - scaledWidth) / 2
  const offsetY = (targetHeight - scaledHeight) / 2

  context.clearRect(0, 0, targetWidth, targetHeight)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight)
}

async function encodeWithinBudget(
  canvas: HTMLCanvasElement,
  minQuality: number,
  maxQuality: number,
  maxBytes: number
) {
  let quality = maxQuality
  let blob = await canvasToBlob(canvas, "image/webp", quality)

  while (blob && blob.size > maxBytes && quality > minQuality) {
    quality = Math.max(minQuality, Number((quality - 0.04).toFixed(2)))
    blob = await canvasToBlob(canvas, "image/webp", quality)
  }

  return blob
}

export async function prepareImageForUpload(file: File, kind: ImageUploadKind): Promise<File> {
  if (!COMPRESSIBLE_IMAGE_TYPES.has(file.type)) {
    return file
  }

  const preset = IMAGE_UPLOAD_PRESETS[kind]

  try {
    const image = await loadImage(file)
    let targetWidth = Math.min(preset.width, image.width)
    let targetHeight = Math.min(preset.height, image.height)

    if (preset.mode === "contain") {
      const scale = Math.min(targetWidth / image.width, targetHeight / image.height)
      targetWidth = Math.max(1, Math.round(image.width * scale))
      targetHeight = Math.max(1, Math.round(image.height * scale))
    }

    const canvas = document.createElement("canvas")
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext("2d")
    if (!context) {
      return file
    }

    drawImageToCanvas(context, image, targetWidth, targetHeight, preset.mode)

    let blob = await encodeWithinBudget(canvas, preset.minQuality, preset.maxQuality, preset.maxBytes)
    let iterations = 0

    while (blob && blob.size > preset.maxBytes && iterations < 4) {
      iterations += 1
      targetWidth = Math.max(320, Math.round(targetWidth * 0.9))
      targetHeight = Math.max(180, Math.round(targetHeight * 0.9))
      canvas.width = targetWidth
      canvas.height = targetHeight
      drawImageToCanvas(context, image, targetWidth, targetHeight, preset.mode)
      blob = await encodeWithinBudget(canvas, preset.minQuality, preset.maxQuality, preset.maxBytes)
    }

    if (!blob) {
      return file
    }

    const shouldKeepOriginal =
      file.size <= preset.maxBytes &&
      file.size <= blob.size &&
      file.type === "image/webp"

    if (shouldKeepOriginal) {
      return file
    }

    return new File([blob], replaceExtension(file.name, ".webp"), {
      type: "image/webp",
      lastModified: file.lastModified
    })
  } catch {
    return file
  }
}

import { useCallback, useEffect, useRef } from "react"
import useSWR from "swr"
import api from "@/lib/axios"
import { fetchWithTimeout, readJsonResponse } from "@/lib/http"
import type { AssetItem } from "@/lib/types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_PDF_SIZE = 2 * 1024 * 1024

function validateAssetFile(file: File) {
  if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE) {
    throw new Error("PDF files must be 2MB or smaller.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File must be 10MB or smaller.")
  }
}

export function useAssets() {
  const { data, error, isLoading, mutate } = useSWR("/assets", fetcher)
  const pendingUploadRef = useRef<string | null>(null)
  const pendingCleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

const sendCleanupBeacon = useCallback((publicId: string) => {
  const payload = JSON.stringify({ action: "cleanup", publicId })

  const ok =
    typeof navigator !== "undefined" && navigator.sendBeacon
      ? navigator.sendBeacon(
          "/api/assets/temp",
          new Blob([payload], { type: "application/json" })
        )
      : false

  if (!ok) {
    void fetch("/api/assets/temp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true
    })
  }
}, []);

const cleanupPendingUpload = useCallback(() => {
  const publicId = pendingUploadRef.current
  if (!publicId) return

  pendingUploadRef.current = null
  sendCleanupBeacon(publicId)
}, [sendCleanupBeacon])

  useEffect(() => {
    const handlePageHide = () => {
      cleanupPendingUpload()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (pendingCleanupTimeoutRef.current) {
          clearTimeout(pendingCleanupTimeoutRef.current)
          pendingCleanupTimeoutRef.current = null
        }
        return
      }

      if (pendingCleanupTimeoutRef.current || !pendingUploadRef.current) {
        return
      }

      pendingCleanupTimeoutRef.current = setTimeout(() => {
        pendingCleanupTimeoutRef.current = null
        cleanupPendingUpload()
      }, 5000)
    }

    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("beforeunload", handlePageHide)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("beforeunload", handlePageHide)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (pendingCleanupTimeoutRef.current) {
        clearTimeout(pendingCleanupTimeoutRef.current)
        pendingCleanupTimeoutRef.current = null
      }
    }
  }, [cleanupPendingUpload])

  const requestUploadSignature = async (file: File) => {
    const response = await fetchWithTimeout("/api/assets/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, fileType: file.type })
    })

    const result = await readJsonResponse<{
      error?: string
      data?: {
        cloudName?: string
        apiKey?: string
        timestamp?: number
        signature?: string
        folder?: string
        publicId?: string
        resourceType?: string
      }
    }>(response)

    if (!response.ok) {
      const rawMessage = result.isJson ? result.json?.error : result.raw
      throw new Error(rawMessage ? String(rawMessage) : "Unable to start upload.")
    }

    if (!result.isJson || !result.json?.data?.cloudName || !result.json?.data?.apiKey || !result.json?.data?.signature) {
      throw new Error("Unable to start upload: invalid signature response.")
    }

    return result.json.data
  }

  const registerTempUpload = async (publicId: string, url: string) => {
    const response = await fetchWithTimeout("/api/assets/temp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", publicId, url })
    })

    if (!response.ok) {
      const result = await readJsonResponse<{ error?: string }>(response)
      const rawMessage = result.isJson ? result.json?.error : result.raw
      throw new Error(rawMessage ? String(rawMessage) : "Unable to register asset upload.")
    }
  }

  const cleanupTempUpload = async (publicId: string) => {
    try {
      const response = await fetchWithTimeout("/api/assets/temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup", publicId })
      })

      if (!response.ok) {
        await readJsonResponse(response)
      }
    } catch {
      // Best-effort cleanup.
    }
  }

  const uploadToCloudinary = async (file: File) => {
    const signature = await requestUploadSignature(file)
    const cloudName = signature.cloudName
    const apiKey = signature.apiKey
    const timestamp = signature.timestamp
    const signatureValue = signature.signature
    const folder = signature.folder
    const publicId = signature.publicId
    const resourceType = signature.resourceType ?? "auto"

    if (!cloudName || !apiKey || !timestamp || !signatureValue || !folder || !publicId) {
      throw new Error("Unable to start upload: missing signature fields.")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", apiKey)
    formData.append("timestamp", String(timestamp))
    formData.append("signature", signatureValue)
    formData.append("folder", folder)
    formData.append("public_id", publicId)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body: formData
    })

    const result = await readJsonResponse<{
      error?: { message?: string }
      public_id?: string
      secure_url?: string
      bytes?: number
      resource_type?: string
      format?: string
    }>(response)

    if (!response.ok || !result.isJson) {
      const message = result.isJson ? result.json?.error?.message : result.raw
      throw new Error(message ? String(message) : "Unable to upload to Cloudinary.")
    }

    return {
      publicId: result.json?.public_id ?? publicId,
      url: result.json?.secure_url ?? "",
      bytes: result.json?.bytes ?? file.size,
      resourceType: result.json?.resource_type ?? resourceType,
      format: result.json?.format
    }
  }

  const uploadAsset = async (payload: { label: string; category: AssetItem["category"]; file: File }) => {
    validateAssetFile(payload.file)

    const uploadResult = await uploadToCloudinary(payload.file)
    if (!uploadResult.url) {
      throw new Error("Unable to upload asset.")
    }

    pendingUploadRef.current = uploadResult.publicId
    await registerTempUpload(uploadResult.publicId, uploadResult.url)

    try {
      const response = await fetchWithTimeout("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: payload.label,
          category: payload.category,
          upload: {
            publicId: uploadResult.publicId,
            url: uploadResult.url,
            originalName: payload.file.name,
            fileType: payload.file.type,
            size: uploadResult.bytes
          }
        })
      })

      const result = await readJsonResponse<{ error?: string; data?: AssetItem }>(response)

      if (!response.ok) {
        const rawMessage = result.isJson ? result.json?.error : result.raw
        throw new Error(rawMessage ? String(rawMessage) : "Unable to upload asset.")
      }

      if (!result.isJson || !result.json?.data) {
        throw new Error("Unable to upload asset: invalid server response.")
      }

      pendingUploadRef.current = null
      await mutate()

      return result.json.data as AssetItem
    } catch (error) {
      await cleanupTempUpload(uploadResult.publicId)
      pendingUploadRef.current = null
      throw error
    }
  }

  const deleteAsset = async (assetId: string) => {
    await api.delete(`/assets/${assetId}`)
    await mutate()
  }

  const updateAsset = async (assetId: string, payload: { label: string; category: AssetItem["category"]; featured?: boolean; file?: File | null }) => {
    if (!payload.file) {
      const response = await fetchWithTimeout(`/api/assets/${assetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: payload.label,
          category: payload.category,
          featured: Boolean(payload.featured)
        })
      })

      const result = await readJsonResponse<{ error?: string; data?: AssetItem }>(response)

      if (!response.ok) {
        const rawMessage = result.isJson ? result.json?.error : result.raw
        throw new Error(rawMessage ? String(rawMessage) : "Unable to update asset.")
      }

      if (!result.isJson || !result.json?.data) {
        throw new Error("Unable to update asset: invalid server response.")
      }

      await mutate()

      return result.json.data as AssetItem
    }

    validateAssetFile(payload.file)

    const uploadResult = await uploadToCloudinary(payload.file)
    if (!uploadResult.url) {
      throw new Error("Unable to update asset.")
    }

    pendingUploadRef.current = uploadResult.publicId
    await registerTempUpload(uploadResult.publicId, uploadResult.url)

    try {
      const response = await fetchWithTimeout(`/api/assets/${assetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: payload.label,
          category: payload.category,
          featured: Boolean(payload.featured),
          upload: {
            publicId: uploadResult.publicId,
            url: uploadResult.url,
            originalName: payload.file.name,
            fileType: payload.file.type,
            size: uploadResult.bytes
          }
        })
      })

      const result = await readJsonResponse<{ error?: string; data?: AssetItem }>(response)

      if (!response.ok) {
        const rawMessage = result.isJson ? result.json?.error : result.raw
        throw new Error(rawMessage ? String(rawMessage) : "Unable to update asset.")
      }

      if (!result.isJson || !result.json?.data) {
        throw new Error("Unable to update asset: invalid server response.")
      }

      pendingUploadRef.current = null
      await mutate()

      return result.json.data as AssetItem
    } catch (error) {
      await cleanupTempUpload(uploadResult.publicId)
      pendingUploadRef.current = null
      throw error
    }
  }

  return {
    assets: (data?.data as AssetItem[] | undefined) ?? [],
    isLoading,
    error,
    uploadAsset,
    deleteAsset,
    updateAsset
  }
}

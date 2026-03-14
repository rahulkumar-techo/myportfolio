export type ReadJsonResult<T> = {
  json: T | null
  raw: string
  isJson: boolean
}

export async function readJsonResponse<T = unknown>(response: Response): Promise<ReadJsonResult<T>> {
  const raw = await response.text()

  if (!raw) {
    return { json: null, raw: "", isJson: false }
  }

  try {
    return { json: JSON.parse(raw) as T, raw, isJson: true }
  } catch {
    return { json: null, raw, isJson: false }
  }
}

export class FetchTimeoutError extends Error {
  constructor(message = "Request timed out.") {
    super(message)
    this.name = "FetchTimeoutError"
  }
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 55000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new FetchTimeoutError()
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

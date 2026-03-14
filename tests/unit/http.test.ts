import { FetchTimeoutError, fetchWithTimeout, readJsonResponse } from "@/lib/http"

const makeResponse = (body: string) =>
  ({
    text: async () => body
  } as Response)

describe("readJsonResponse", () => {
  it("returns parsed json when response is valid json", async () => {
    const response = makeResponse(JSON.stringify({ ok: true, value: 42 }))
    const result = await readJsonResponse<{ ok: boolean; value: number }>(response)

    expect(result.isJson).toBe(true)
    expect(result.json).toEqual({ ok: true, value: 42 })
    expect(result.raw).toContain('"ok":true')
  })

  it("returns raw text when response is not valid json", async () => {
    const response = makeResponse("An error occurred with your deployment")
    const result = await readJsonResponse(response)

    expect(result.isJson).toBe(false)
    expect(result.json).toBeNull()
    expect(result.raw).toContain("An error occurred")
  })
})

describe("fetchWithTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it("throws FetchTimeoutError when the request times out", async () => {
    const fetchMock = jest.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"))
        })
      })
    })

    // @ts-expect-error - override fetch for test
    global.fetch = fetchMock

    const promise = fetchWithTimeout("/api/assets", {}, 10)
    jest.advanceTimersByTime(20)

    await expect(promise).rejects.toBeInstanceOf(FetchTimeoutError)
  })
})

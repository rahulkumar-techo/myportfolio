/// <reference types="jest" />

import "@testing-library/jest-dom"
import { webcrypto } from "node:crypto"
import { ReadableStream, TransformStream, WritableStream } from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"

if (!global.TextEncoder) {
  Object.defineProperty(global, "TextEncoder", {
    value: TextEncoder
  })
}

if (!global.TextDecoder) {
  Object.defineProperty(global, "TextDecoder", {
    value: TextDecoder
  })
}

if (!global.ReadableStream) {
  Object.defineProperty(global, "ReadableStream", {
    value: ReadableStream
  })
}

if (!global.TransformStream) {
  Object.defineProperty(global, "TransformStream", {
    value: TransformStream
  })
}

if (!global.WritableStream) {
  Object.defineProperty(global, "WritableStream", {
    value: WritableStream
  })
}

if (!global.ResizeObserver) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(global, "ResizeObserver", {
    value: ResizeObserverMock
  })
}

const originalFetch = global.fetch?.bind(globalThis)
const originalRequest = global.Request
const originalResponse = global.Response
const originalHeaders = global.Headers

// Provide a lightweight fetch mock that tests can override per suite.
global.fetch = jest.fn(async (...args: Parameters<typeof fetch>) => {
  if (!originalFetch) {
    throw new Error(`Unhandled fetch in test environment: ${String(args[0])}`)
  }

  return originalFetch(...args)
}) as typeof fetch

// Next.js route handlers and tests commonly rely on Web Crypto in Node.
if (!global.crypto) {
  Object.defineProperty(global, "crypto", {
    value: webcrypto
  })
}

// Ensure Web API request primitives exist in the Jest environment.
afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  global.fetch = originalFetch as typeof fetch

  if (originalRequest) {
    Object.defineProperty(global, "Request", { value: originalRequest })
  }

  if (originalResponse) {
    Object.defineProperty(global, "Response", { value: originalResponse })
  }

  if (originalHeaders) {
    Object.defineProperty(global, "Headers", { value: originalHeaders })
  }
})

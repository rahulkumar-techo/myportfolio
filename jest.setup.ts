import "@testing-library/jest-dom"
import { webcrypto } from "node:crypto"
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

const { fetch: undiciFetch, Headers: UndiciHeaders, Request: UndiciRequest, Response: UndiciResponse } = require("undici")

// Provide a lightweight fetch mock that tests can override per suite.
if (!global.fetch) {
  global.fetch = jest.fn(undiciFetch)
}

// Next.js route handlers and tests commonly rely on Web Crypto in Node.
if (!global.crypto) {
  Object.defineProperty(global, "crypto", {
    value: webcrypto
  })
}

// Ensure Web API request primitives exist in the Jest environment.
if (!global.Request) {
  Object.defineProperty(global, "Request", {
    value: UndiciRequest
  })
}

if (!global.Response) {
  Object.defineProperty(global, "Response", {
    value: UndiciResponse
  })
}

if (!global.Headers) {
  Object.defineProperty(global, "Headers", {
    value: UndiciHeaders
  })
}

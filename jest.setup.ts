import "@testing-library/jest-dom"
import { webcrypto } from "node:crypto"

// Provide a lightweight fetch mock that tests can override per suite.
if (!global.fetch) {
  global.fetch = jest.fn()
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
    value: Request
  })
}

if (!global.Response) {
  Object.defineProperty(global, "Response", {
    value: Response
  })
}

if (!global.Headers) {
  Object.defineProperty(global, "Headers", {
    value: Headers
  })
}

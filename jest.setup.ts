import "@testing-library/jest-dom"

// Provide a lightweight fetch mock that tests can override per suite.
if (!global.fetch) {
  global.fetch = jest.fn()
}

// Next.js route handlers and tests commonly rely on Web Crypto in Node.
if (!global.crypto) {
  Object.defineProperty(global, "crypto", {
    value: require("node:crypto").webcrypto
  })
}

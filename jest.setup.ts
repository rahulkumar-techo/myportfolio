/// <reference types="jest" />

import "@testing-library/jest-dom"
import { webcrypto } from "node:crypto"
import { ReadableStream, TransformStream, WritableStream } from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"
import { MessageChannel, MessagePort } from "node:worker_threads"

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

if (!global.MessageChannel) {
  Object.defineProperty(global, "MessageChannel", {
    value: MessageChannel
  })
}

if (!global.MessagePort) {
  Object.defineProperty(global, "MessagePort", {
    value: MessagePort
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

/**
 * This test exercises a full user flow:
 * form input -> fetch request -> API route -> repository write -> UI success state.
 */

import { FormEvent, useState } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { POST } from "@/app/api/messages/route"
import { createPortfolioItem } from "@/repositories/portfolio-repository"

jest.mock("@/repositories/portfolio-repository", () => ({
  createPortfolioItem: jest.fn()
}))

const mockedCreatePortfolioItem = jest.mocked(createPortfolioItem)

function IntegratedMessageForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject: "Integration Test",
        message
      })
    })

    if (response.ok) {
      setStatus("success")
      return
    }

    setStatus("error")
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        aria-label="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        aria-label="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <textarea
        aria-label="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit">Submit</button>
      {status === "success" && <p>Saved</p>}
      {status === "error" && <p>Failed</p>}
    </form>
  )
}

describe("contact form integration flow", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("submits the form, calls the API, writes to storage, and updates the UI", async () => {
    const writtenMessages: Array<Record<string, unknown>> = []

    mockedCreatePortfolioItem.mockImplementation(async (_collection, payload) => {
      writtenMessages.push(payload as Record<string, unknown>)
      return payload as any
    })

    ;(global.fetch as jest.Mock).mockImplementation(async (_url: string, init?: RequestInit) => {
      const response = await POST(
        new Request("http://localhost/api/messages", {
          method: "POST",
          headers: init?.headers,
          body: init?.body
        })
      )

      return {
        ok: response.ok,
        status: response.status,
        json: async () => response.json()
      }
    })

    render(<IntegratedMessageForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText("name"), "Rahul")
    await user.type(screen.getByLabelText("email"), "rahul@example.com")
    await user.type(screen.getByLabelText("message"), "Please contact me")
    await user.click(screen.getByRole("button", { name: "Submit" }))

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument()
    })

    expect(writtenMessages).toHaveLength(1)
    expect(writtenMessages[0]).toEqual(
      expect.objectContaining({
        name: "Rahul",
        email: "rahul@example.com",
        message: "Please contact me"
      })
    )
  })
})

import { FormEvent, useState } from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

function TestContactForm({ buttonLabel = "Send message" }: { buttonLabel?: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: "Testing",
          message
        })
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={(event) => setName(event.target.value)} />

      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />

      <label htmlFor="message">Message</label>
      <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} />

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : buttonLabel}
      </button>

      {status === "success" && <p role="status">Message sent successfully.</p>}
      {status === "error" && <p role="alert">Something went wrong.</p>}
    </form>
  )
}

describe("TestContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form fields and custom button label", () => {
    render(<TestContactForm buttonLabel="Submit form" />)

    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Message")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit form" })).toBeInTheDocument()
  })

  it("submits successfully and shows a success state", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<TestContactForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText("Name"), "Rahul")
    await user.type(screen.getByLabelText("Email"), "rahul@example.com")
    await user.type(screen.getByLabelText("Message"), "Hello from tests")
    await user.click(screen.getByRole("button", { name: "Send message" }))

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Message sent successfully.")
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/messages",
      expect.objectContaining({
        method: "POST"
      })
    )
  })

  it("shows a loading state while submitting and an error state on failure", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"))

    render(<TestContactForm />)

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Rahul" } })
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "rahul@example.com" } })
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Please respond" } })
    fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!)

    expect(screen.getByRole("button")).toHaveTextContent("Sending...")

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong.")
    })
  })
})

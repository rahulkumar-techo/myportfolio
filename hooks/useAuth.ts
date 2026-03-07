import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react"

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: "admin" | "user"
}

export function useAuth() {
  const { data: session, status } = useSession()

  const normalizeAuthError = (error?: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid admin email or password"
      case "AccessDenied":
        return "This account does not have admin access"
      case "Configuration":
        return "Authentication is not configured correctly"
      default:
        return error ?? null
    }
  }

  const login = async (payload: LoginPayload) => {
    try {
      const result = await signIn("credentials", {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        redirect: false
      })

      return {
        success: !result?.error,
        error: normalizeAuthError(result?.error)
      }
    } catch (err) {
      console.error("Login error:", err)
      return {
        success: false,
        error: "Unable to sign in"
      }
    }
  }

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      return {
        success: res.ok,
        error: res.ok ? null : normalizeAuthError(data.message ?? data.error ?? "Registration failed")
      }
    } catch (err) {
      console.error("Register error:", err)
      return {
        success: false,
        error: "Unable to register"
      }
    }
  }

  const logout = () => {
    return signOut({
      redirect: true,
      callbackUrl: "/admin/login"
    })
  }

  const loginWithGoogle = (callbackUrl = "/admin") => {
    return (async () => {
      const csrfToken = await getCsrfToken()

      if (!csrfToken) {
        return {
          success: false,
          error: "Unable to start Google sign-in"
        }
      }

      const form = document.createElement("form")
      form.method = "POST"
      form.action = "/api/auth/signin/google"
      form.style.display = "none"

      const fields = {
        csrfToken,
        callbackUrl
      }

      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = name
        input.value = value
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit()

      return {
        success: true,
        error: null
      }
    })()
  }

  return {
    user: session?.user ?? null,
    status,
    login,
    loginWithGoogle,
    register,
    logout
  }
}

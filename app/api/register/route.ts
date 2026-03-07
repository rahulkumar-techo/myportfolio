import { requireAdminApiSession } from "@/lib/auth"
import { createUser, findUserByEmail, hasAdminUser } from "@/repositories/user-repository"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json()
  const normalizedName = typeof name === "string" ? name.trim() : ""
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""
  const normalizedRole = role === "admin" || role === "user" ? role : "user"

  if (!normalizedName || !normalizedEmail || !password) {
    return Response.json({ message: "Name, email, and password are required" }, { status: 400 })
  }

  if (password.length < 8) {
    return Response.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
  }

  const adminExists = await hasAdminUser()

  if (adminExists) {
    const { response } = await requireAdminApiSession()

    if (response) {
      return response
    }
  }

  const existing = await findUserByEmail(normalizedEmail)

  if (existing) {
    return Response.json({ message: "User already exists" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await createUser({
    name: normalizedName,
    email: normalizedEmail,
    password: hashed,
    role: adminExists ? normalizedRole : "admin"
  })

  return Response.json({
    message: "User created",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
}

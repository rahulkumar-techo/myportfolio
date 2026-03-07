/**
 * Login with email + password
 */


import { connectDB } from "@/lib/db"
import { UserModel } from "@/model/user.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    const { email, password } = await req.json()

    await connectDB()

    const user = await UserModel.findOne({ email })

    if (!user) {
        return Response.json(
            { message: "Invalid credentials" },
            { status: 401 }
        )
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
        return Response.json(
            { message: "Invalid password" },
            { status: 401 }
        )
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    )

    return Response.json({
        message: "Login successful",
        token
    })
}
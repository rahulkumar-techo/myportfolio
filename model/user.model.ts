import { Schema, model, models } from "mongoose"

// User now stores only authentication and account-level fields.
// Portfolio content lives in dedicated collections in `portfolio.model.ts`.
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: null },
  lastLoginProvider: { type: String, default: null },
})

export const UserModel = models.User || model("User", UserSchema)

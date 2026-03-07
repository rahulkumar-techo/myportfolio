/**
 * @jest-environment node
 */

import mongoose, { Schema, model } from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

describe("mongodb-memory-server integration", () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it("creates, fetches, updates, and deletes a document in memory", async () => {
    const portfolioSchema = new Schema({
      title: { type: String, required: true },
      category: { type: String, required: true },
      featured: { type: Boolean, default: false }
    })

    const PortfolioModel =
      mongoose.models.TestPortfolio || model("TestPortfolio", portfolioSchema)

    const created = await PortfolioModel.create({
      title: "In-memory project",
      category: "Web"
    })

    expect(created.title).toBe("In-memory project")
    expect(created.featured).toBe(false)

    const fetched = await PortfolioModel.findById(created._id)
    expect(fetched?.category).toBe("Web")

    const updated = await PortfolioModel.findByIdAndUpdate(
      created._id,
      { featured: true },
      { new: true }
    )

    expect(updated?.featured).toBe(true)

    await PortfolioModel.findByIdAndDelete(created._id)
    const deleted = await PortfolioModel.findById(created._id)

    expect(deleted).toBeNull()
  })

  it("enforces schema validation rules for missing required fields", async () => {
    const testimonialSchema = new Schema({
      name: { type: String, required: true },
      content: { type: String, required: true }
    })

    const TestimonialModel =
      mongoose.models.TestimonialValidation || model("TestimonialValidation", testimonialSchema)

    await expect(
      TestimonialModel.create({
        name: "Rahul"
      })
    ).rejects.toThrow(/content/i)
  })
})

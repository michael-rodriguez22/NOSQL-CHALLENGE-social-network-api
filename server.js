require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()
const PORT = process.env.PORT || 3003

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/social-network-api"
  )
  .then(() => {
    console.log("Successfully connected to mongodb")
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  })
  .catch(err => console.error(err))

mongoose.set("debug", true)

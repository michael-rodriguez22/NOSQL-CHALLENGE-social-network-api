require("colors")
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require("./routes"))
app.use(require("./middleware/error-handler"))

const { MONGODB_URI, NODE_ENV = "development", PORT = 3003 } = process.env

const connect = async () => {
  try {
    console.log("\nConnecting to MongoDB...".grey.bold)

    const conn = await mongoose.connect(MONGODB_URI)

    NODE_ENV !== "production" && mongoose.set("debug", true)

    console.log(`Connection successful. DB: ${conn.connection.name}`.green.bold)

    app.listen(PORT, console.log(`Server started on port ${PORT}\n`.cyan.bold))
  } catch (err) {
    console.error("Something went wrong\n".red.bold, err)
    process.exit(1)
  }
}

connect()

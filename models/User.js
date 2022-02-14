const { Schema, model } = require("mongoose")
const { isEmail, formatDate } = require("../utils")

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: [email => isEmail(email), "Invalid Email Address"],
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    createdAt: {
      type: Date,
      get: timestamp => ({
        timestamp,
        formatted: formatDate(timestamp),
      }),
    },

    updatedAt: {
      type: Date,
      get: timestamp => ({
        timestamp,
        formatted: formatDate(timestamp),
      }),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
)

userSchema.virtual("friendCount").get(function () {
  return this.friends ? this.friends.length : 0
})

const User = new model("User", userSchema)

module.exports = User

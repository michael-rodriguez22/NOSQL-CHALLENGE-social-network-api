const { Schema, model } = require("mongoose")
const { isEmail } = require("../utils")

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
)

userSchema.virtual("friendCount").get(function () {
  return this.friends ? this.friends.length : 0
})

const User = new model("User", userSchema)

module.exports = User

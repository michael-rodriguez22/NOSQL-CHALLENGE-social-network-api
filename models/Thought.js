const { Schema, Mongoose, model } = require("mongoose")
const { isValidLength, validLengthMessage, formatDate } = require("../utils")

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Mongoose.Types.ObjectId(),
    },

    reactionBody: {
      type: String,
      required: true,
      trim: true,
      validate: [
        body => isValidLength(body),
        () => validLengthMessage("Reaction body"),
      ],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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
    id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
)

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      validate: [
        text => isValidLength(text),
        () => validLengthMessage("Thought text"),
      ],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reactions: [reactionSchema],

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
  }
)

thoughtSchema.virtual("reactionCount").get(function () {
  this.reactions ? this.reactions.length : 0
})

const Thought = new model("Thought", thoughtSchema)

module.exports = Thought

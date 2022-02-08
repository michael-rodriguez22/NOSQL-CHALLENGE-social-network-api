const { Schema, model } = require("mongoose")
const { isValidLength, validLengthMessage, formatDate } = require("../utils")

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Schema.Types.ObjectId(),
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
  },
  {
    timestamps: {
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    },
    toJSON: {
      virtuals: true,
    },
    // TODO: pass id and _id options if necessary
    // id: false ?
    // _id: false ?
  }
)

reactionSchema
  .virtual("createdAt")
  .get(() => formatDate(this.timestampCreatedAt))

reactionSchema
  .virtual("updatedAt")
  .get(() => formatDate(this.timestampUpdatedAt))

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
  },
  {
    timestamps: {
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

thoughtSchema
  .virtual("createdAt")
  .get(() => formatDate(this.timestampCreatedAt))

thoughtSchema
  .virtual("updatedAt")
  .get(() => formatDate(this.timestampUpdatedAt))

thoughtSchema.virtual("reactionCount").get(() => this.reactions.length)

const Thought = new model("Thought", thoughtSchema)

module.exports = Thought

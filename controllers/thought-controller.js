const { Thought, User } = require("../models"),
  { handleThoughtControllerErrors } = require("../utils"),
  handleErr = handleThoughtControllerErrors

const handle404 = (res, message = "No thought was found with this id") => {
  return res.status(404).json({ message })
}

const thoughtController = {
  async getAllThoughts(req, res) {
    try {
      const thoughtData = await Thought.find({})
        .populate({
          path: "author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .populate({
          path: "reactions.author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .select({
          __v: 0,
          timestampCreatedAt: 0,
          timestampUpdatedAt: 0,
          "reactions.timestampCreatedAt": 0,
          "reactions.timestampUpdatedAt": 0,
        })
        .sort({ serverTimeStamp: 1 })

      return res.json({ thoughts: thoughtData })
    } catch (err) {
      handleErr(res, err)
    }
  },

  async getThoughtById({ params }, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: params.id })
        .populate({
          path: "author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .populate({
          path: "reactions.author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .select({
          __v: 0,
          timestampCreatedAt: 0,
          timestampUpdatedAt: 0,
          "reactions.timestampCreatedAt": 0,
          "reactions.timestampUpdatedAt": 0,
        })

      return thoughtData ? res.json(thoughtData) : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },

  async createThought({ body }, res) {
    try {
      const thoughtData = await Thought.create({
        thoughtText: body.thoughtText,
        author: body.author,
      })

      const userData = await User.findOneAndUpdate(
        { _id: body.author },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      )

      if (!userData) return handle404(res, "No user was found with this id")

      return res.status(201).json({
        message: "New thought successfully created",
        thought: thoughtData,
      })
    } catch (err) {
      handleErr(res, err)
    }
  },

  async updateThought({ params, body }, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: params.id },
        { thoughtText: body.thoughtText },
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      )
        .populate({
          path: "author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .populate({
          path: "reactions.author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .select({
          __v: 0,
          timestampCreatedAt: 0,
          timestampUpdatedAt: 0,
          "reactions.timestampCreatedAt": 0,
          "reactions.timestampUpdatedAt": 0,
        })

      return thoughtData
        ? res.json({
            message: "This thought was successfully updated",
            thought: thoughtData,
          })
        : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },

  async deleteThought({ params }, res) {
    try {
      const thoughtData = await Thought.findOneAndDelete({
        _id: params.id,
      })
        .populate({
          path: "author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .populate({
          path: "reactions.author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .select({
          __v: 0,
          timestampCreatedAt: 0,
          timestampUpdatedAt: 0,
          "reactions.timestampCreatedAt": 0,
          "reactions.timestampUpdatedAt": 0,
        })

      if (!thoughtData) return handle404(res)

      // TODO: cascade delete from user's thoughts list
      res.json({
        message:
          "This thought has been successfully deleted (TODO: cascade delete from user's thoughts list)",
        thought: thoughtData,
      })
    } catch (err) {
      handleErr(res, err)
    }
  },

  async addReaction({ params, body }, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: params.id },
        {
          $push: {
            reactions: { reactionBody: body.reactionBody, author: body.author },
          },
        },
        { new: true }
      )
        .populate({
          path: "author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .populate({
          path: "reactions.author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .select({
          __v: 0,
          timestampCreatedAt: 0,
          timestampUpdatedAt: 0,
          "reactions.timestampCreatedAt": 0,
          "reactions.timestampUpdatedAt": 0,
        })

      return thoughtData
        ? res.json({
            message: "Reaction has been successfully added to this thought",
            thought: thoughtData,
          })
        : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },

  async removeReaction({ params }, res) {
    // TODO: send 404 if reaction id isn't in reactions
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { _id: params.reactionId } } },
        { new: true }
      )
        .populate({
          path: "author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .populate({
          path: "reactions.author",
          select: {
            _id: 1,
            username: 1,
          },
        })
        .select({
          __v: 0,
          timestampCreatedAt: 0,
          timestampUpdatedAt: 0,
          "reactions.timestampCreatedAt": 0,
          "reactions.timestampUpdatedAt": 0,
        })

      return thoughtData
        ? res.json({
            message: "Reaction successfully removed from this thought",
            thought: thoughtData,
          })
        : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },
}

module.exports = thoughtController

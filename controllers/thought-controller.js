const asyncHandler = require("express-async-handler")
const { Thought, User } = require("../models")

const notFound = (resource = "thought") =>
  `No ${resource} was found with this id`

// method GET
// route  /api/thoughts
const getAllThoughts = asyncHandler(async (req, res) => {
  const thoughts = await Thought.find({})
    .sort({ createdAt: 0 })
    .select({ __v: 0 })

  return res.status(200).json(thoughts)
})

// method GET
// route  /api/thoughts/:id
const getThoughtById = asyncHandler(async ({ params }, res) => {
  const thought = await Thought.findById(params.id)
    .populate({
      path: "author",
      select: { _id: 1, username: 1 },
    })
    .populate({
      path: "reactions.author",
      select: { _id: 1, username: 1 },
    })
    .select({ __v: 0 })

  if (!thought) {
    res.status(404)
    throw new Error(notFound())
  }

  return res.status(200).json(thought)
})

// method POST
// route  /api/thoughts/
const createThought = asyncHandler(async ({ body }, res) => {
  const { thoughtText, author } = body

  if (!thoughtText || !author) {
    res.status(400)
    throw new Error("Thought text and author are both required")
  }

  const user = await User.findById(author)

  if (!user) {
    res.status(404)
    throw new Error(notFound("user"))
  }

  const thought = await Thought.create({ thoughtText, author })

  await User.findOneAndUpdate(
    { _id: user._id },
    { $push: { thoughts: thought._id } },
    { new: true }
  )

  return res.status(201).json(thought)
})

// method PUT
// route  /api/thoughts/:id
const updateThought = asyncHandler(async ({ params, body }, res) => {
  const { thoughtText } = body

  if (!thoughtText) {
    res.status(400)
    throw new Error("Updated thought text required")
  }

  const thought = await Thought.findById(params.id)

  if (!thought) {
    res.status(404)
    throw new Error(notFound())
  }

  const updatedThought = await Thought.findOneAndUpdate(
    { _id: thought._id },
    { thoughtText },
    { new: true }
  )
    .populate({
      path: "author",
      select: { _id: 1, username: 1 },
    })
    .populate({
      path: "reactions.author",
      select: { _id: 1, username: 1 },
    })
    .select({ __v: 0 })

  return res.status(200).json(updatedThought)
})

// method DELETE
// route  /api/thoughts/:id
const deleteThought = asyncHandler(async ({ params, body }, res) => {
  const thought = await Thought.findById(params.id)

  if (!thought) {
    res.status(404)
    throw new Error(notFound())
  }

  const user = User.findById(thought.author)

  if (user) {
    await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { thoughts: thought._id } },
      { new: true }
    )
  }

  await Thought.findOneAndDelete({ _id: thought._id })

  return res
    .status(200)
    .json({ message: "This thought was successfully deleted", thought })
})

// method PUT
// route  /api/thoughts/:id/reactions
const addReaction = asyncHandler(async ({ params, body }, res) => {
  const { reactionBody, author } = body

  if (!reactionBody || !author) {
    res.status(400)
    throw new Error("Reaction body and author are required to add a reaction")
  }

  const thought = await Thought.findById(params.id)

  if (!thought) {
    res.status(404)
    throw new Error(notFound())
  }

  const updatedThought = await Thought.findOneAndUpdate(
    { _id: thought._id },
    { $push: { reactions: { reactionBody, author } } },
    { new: true }
  )
    .populate({
      path: "author",
      select: { _id: 1, username: 1 },
    })
    .populate({
      path: "reactions.author",
      select: { _id: 1, username: 1 },
    })
    .select({ __v: 0 })

  return res.status(200).json(updatedThought)
})

// method PUT
// route  /api/thoughts/:thoughtId/reactions/:reactionId
const removeReaction = asyncHandler(async ({ params }, res) => {
  const thought = await Thought.findById(params.thoughtId)

  if (!thought) {
    res.status(404)
    throw new Error(notFound())
  }

  const reaction = thought.reactions.filter(reaction => {
    return reaction._id.toString() === params.reactionId
  })[0]

  if (!reaction) {
    res.status(404)
    throw new Error(notFound("reaction"))
  }

  const updatedThought = await Thought.findOneAndUpdate(
    { _id: thought._id },
    { $pull: { reactions: reaction } },
    { new: true }
  )
    .populate({
      path: "author",
      select: { _id: 1, username: 1 },
    })
    .populate({
      path: "reactions.author",
      select: { _id: 1, username: 1 },
    })
    .select({ __v: 0 })

  return res.status(200).json(updatedThought)
})

module.exports = {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
}

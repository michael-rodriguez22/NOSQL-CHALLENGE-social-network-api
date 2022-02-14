const asyncHandler = require("express-async-handler")
const { User } = require("../models")

const notFound = resource => `No ${resource} was found with this id`

// method GET
// route  /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ username: 1 })
  return res.status(200).json(users)
})

// method GET
// route  /api/users/:id
const getUserById = asyncHandler(async ({ params }, res) => {
  const user = await User.findById(params.id)
    .populate({ path: "thoughts" })
    .populate({ path: "friends" })

  if (!user) {
    res.status(404)
    throw new Error(notFound("user"))
  }

  return res.status(200).json(user)
})

// method POST
// route  /api/users
const createUser = asyncHandler(async ({ body }, res) => {
  const { username, email } = body

  if (!username || !email) {
    res.status(400)
    throw new Error("Username and email are required")
  }

  const isTaken = await User.find({ $or: [{ username }, { email }] })

  if (isTaken[0]) {
    res.status(400)
    throw isTaken[0].username === username
      ? new Error("That username is already in use")
      : new Error("That email address is already in use")
  }

  const user = await User.create({ username, email })

  return res.status(201).json(user)
})

// method PUT
// route  /api/users/:id
const updateUserInfo = asyncHandler(async ({ params, body }, res) => {
  const { username, email } = body

  if (!username && !email) {
    res.status(400)
    throw new Error("New username or email are required to update profile info")
  }

  const user = await User.findById(params.id)

  if (!user) {
    res.status(404)
    throw new Error(notFound("user"))
  }

  const updatedUser = await User.findOneAndUpdate(
    { id: user.id },
    { username, email },
    { new: true }
  )

  return res.status(200).json(updatedUser)
})

// method DELETE
// route  /api/users/:id
const deleteUser = asyncHandler(async ({ params }, res) => {
  const user = await User.findById(params.id)

  if (!user) {
    res.status(404)
    throw new Error(notFound("user"))
  }

  await user.remove()

  return res.status(200).json({ message: "User successfully deleted", user })
})

// method PUT
// route  /api/users/:userId/add-friend/:friendId
const addFriend = asyncHandler(async ({ params }, res) => {
  // TODO: Only add friend if not currently in user's friends list
  const friend = await User.findById(params.friendId)

  if (!friend) {
    res.status(404)
    throw new Error(notFound("friend"))
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: params.userId },
    { $addToSet: { friends: params.friendId } },
    { new: true }
  )

  if (!updatedUser) {
    res.status(404)
    throw new Error(notFound("user"))
  }

  return res.status(200).json({
    message: "Friend successfully added to user's friends list",
    friend: {
      _id: friend._id,
      username: friend.username,
    },
    user: updatedUser,
  })
})

// method PUT
// route  /api/users/:userId/remove-friend/:friendId
const removeFriend = asyncHandler(async ({ params }, res) => {
  // TODO: only remove friend if currently in user's friends list
  const updatedUser = await User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId } },
    { new: true }
  )

  if (!updatedUser) {
    res.status(404)
    throw new Error(notFound("user"))
  }

  return res.status(200).json({
    message: "Friend successfully removed from user's friends list",
    friend: { _id: params.friendId },
    user: updatedUser,
  })
})

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  deleteUser,
  addFriend,
  removeFriend,
}

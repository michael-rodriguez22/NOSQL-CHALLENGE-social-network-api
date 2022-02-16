const asyncHandler = require("express-async-handler")
const { User } = require("../models")

const notFound = (resource = "user") => `No ${resource} was found with this id`

// method GET
// route  /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ username: 1 }).select({ __v: 0 })
  return res.status(200).json(users)
})

// method GET
// route  /api/users/:id
const getUserById = asyncHandler(async ({ params }, res) => {
  const user = await User.findById(params.id)
    .populate({ path: "thoughts" })
    .populate({ path: "friends" })
    .select({ __v: 0 })

  if (!user) {
    res.status(404)
    throw new Error(notFound())
  }

  return res.status(200).json(user)
})

// method POST
// route  /api/users
const createUser = asyncHandler(async ({ body }, res) => {
  const { username, email } = body

  if (!username || !email) {
    res.status(400)
    throw new Error("Username and email are both required")
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
    throw new Error(notFound())
  }

  const updatedUser = await User.findOneAndUpdate(
    { id: user.id },
    { username, email },
    { new: true }
  ).select({ __v: 0 })

  return res.status(200).json(updatedUser)
})

// method DELETE
// route  /api/users/:id
const deleteUser = asyncHandler(async ({ params }, res) => {
  const user = await User.findById(params.id).select({ __v: 0 })

  if (!user) {
    res.status(404)
    throw new Error(notFound())
  }

  await user.remove()

  return res.status(200).json({ message: "User successfully deleted", user })
})

// method PUT
// route  /api/users/:userId/add-friend/:friendId
const addFriend = asyncHandler(async ({ params }, res) => {
  const friend = await User.findById(params.friendId)

  if (!friend) {
    res.status(404)
    throw new Error(notFound("friend"))
  }

  const user = await User.findById(params.userId)

  if (!user) {
    res.status(404)
    throw new Error(notFound())
  }

  if (user.friends.includes(friend._id)) {
    res.status(400)
    throw new Error("That friend is already in this user's friends list")
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $addToSet: { friends: params.friendId } },
    { new: true }
  ).select({ __v: 0 })

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
  const user = await User.findById(params.userId)

  if (!user) {
    res.status(404)
    throw new Error(notFound())
  }

  if (!user.friends.includes(params.friendId)) {
    res.status(400)
    throw new Error("That friend was not found in this user's friends list")
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId } },
    { new: true }
  ).select({ __v: 0 })

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

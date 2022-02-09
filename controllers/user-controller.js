const { User } = require("../models"),
  { handleUserControllerErrors } = require("../utils"),
  handleErr = handleUserControllerErrors

const handle404 = (res, message = "No user was found with this id") => {
  return res.status(404).json({ message })
}

const userController = {
  async getAllUsers(req, res) {
    try {
      const usersData = await User.find({})
        .populate({
          path: "thoughts",
          select: { __v: 0, timestampCreatedAt: 0, timestampUpdatedAt: 0 },
        })
        .select({ __v: 0, createdAt: 0, updatedAt: 0 })
        .sort({ username: 1 })

      return res.json({ users: usersData })
    } catch (err) {
      handleErr(res, err)
    }
  },

  async getUserById({ params }, res) {
    try {
      const userData = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: { __v: 0, timestampCreatedAt: 0, timestampUpdatedAt: 0 },
        })
        .populate({
          path: "friends",
          select: {
            thoughts: 0,
            email: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        })
        .select({ __v: 0 })

      return userData ? res.json(userData) : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },

  async createUser({ body }, res) {
    try {
      const userData = await User.create({
        username: body.username,
        email: body.email,
      })

      return res.status(201).json({
        message: "New user successfully created",
        user: userData,
      })
    } catch (err) {
      handleErr(res, err)
    }
  },

  async updateUser({ params, body }, res) {
    const payload = {}
    if (body.username) payload.username = body.username
    if (body.email) payload.email = body.email
    try {
      const userData = await User.findOneAndUpdate(
        { _id: params.id },
        payload,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      ).select({ __v: 0 })

      return userData
        ? res.json({
            message: "This user's information was successfully updated",
            user: userData,
          })
        : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },

  async deleteUser({ params }, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: params.id }).select({
        __v: 0,
      })

      if (!userData) return handle404(res)

      // TODO: delete all associated thoughts and cascade delete from friends lists
      return res.json({
        message:
          "This user has been successfully deleted (TODO: delete all associated thoughts and cascade delete from friends lists)",
        user: userData,
      })
    } catch (err) {
      handleErr(res, err)
    }
  },

  async addFriend({ params }, res) {
    try {
      const friendData = await User.findOne({ _id: params.friendId }).select({
        thoughts: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      })

      if (!friendData)
        return handle404(res, "The friend you are trying to add was not found")

      // TODO: don't add friend if already in friends list
      const userData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true }
      ).select({
        thoughts: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      })

      return userData
        ? res.json({
            message:
              "This friend has been successfully added to this user's friends list",
            friend: friendData,
            user: userData,
          })
        : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },

  async removeFriend({ params }, res) {
    try {
      // TODO: return 404 if friend is not in user's friends list
      const userData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
        .populate({
          path: "friends",
          select: {
            thoughts: 0,
            email: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        })
        .select({
          thoughts: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        })

      return userData
        ? res.json({
            message:
              "This friend has been successfully removed from this user's friends list",
            user: userData,
          })
        : handle404(res)
    } catch (err) {
      handleErr(res, err)
    }
  },
}

module.exports = userController

const router = require("express").Router(),
  {
    getAllUsers,
    getUserById,
    createUser,
    updateUserInfo,
    deleteUser,
    addFriend,
    removeFriend,
  } = require("../../controllers/user-controller")

router.route("/").get(getAllUsers).post(createUser)

router.route("/:id").get(getUserById).put(updateUserInfo).delete(deleteUser)

router.put("/:userId/add-friend/:friendId", addFriend)

router.put("/:userId/remove-friend/:friendId", removeFriend)

module.exports = router

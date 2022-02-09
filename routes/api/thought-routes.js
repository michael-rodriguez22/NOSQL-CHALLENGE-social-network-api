const router = require("express").Router(),
  {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
  } = require("../../controllers/thought-controller")

router.route("/").get(getAllThoughts).post(createThought)

router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought)

router.route("/:id/reactions").put(addReaction)

router.route("/:thoughtId/reactions/:reactionId").put(removeReaction)

module.exports = router

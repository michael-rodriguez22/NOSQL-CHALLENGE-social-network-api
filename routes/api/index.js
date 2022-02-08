const router = require("express").Router(),
  userRoutes = require("./user-routes"),
  thoughtRoutes = require("./thought-routes")

router.use("/users", userRoutes)
router.use("/thoughts", thoughtRoutes)

module.exports = router

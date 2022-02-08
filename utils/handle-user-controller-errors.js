module.exports = (res, err) => {
  console.error(err)

  if (err.kind === "ObjectId") {
    return res.status(400).json({
      message: "Invalid _id value",
      _id: err.value,
    })
  } else if (err.keyValue?.username) {
    return res.status(400).json({
      message: `The username "${err.keyValue.username}" is already in use`,
    })
  } else if (err.keyValue?.email) {
    return res.status(400).json({
      message: `The email address "${err.keyValue.email}" is already in use`,
    })
  } else {
    return res.status(500).json({
      message: "Something went wrong",
      error: err,
    })
  }
}

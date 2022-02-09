module.exports = (res, err) => {
  console.error(err)

  if (err.kind === "ObjectId") {
    return res.status(400).json({
      message: "Invalid _id value",
      _id: err.value,
    })
  } else if (err.errors?.thoughtText?.properties.path === "thoughtText") {
    return res
      .status(400)
      .json({ message: err.errors.thoughtText.properties.message })
  } else {
    return res.status(500).json({
      message: "Something went wrong",
      error: err,
    })
  }
}

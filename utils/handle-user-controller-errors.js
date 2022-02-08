module.exports = err => {
  const response = {}
  if (err.kind === "ObjectId") {
    response.status = 400
    response.body = {
      message: "Invalid _id value",
      _id: err.value,
    }
  } else if (err.keyValue?.username) {
    response.status = 400
    response.body = {
      message: `The username "${err.keyValue.username}" is already in use`,
    }
  } else if (err.keyValue?.email) {
    response.status = 400
    response.body = {
      message: `The email address "${err.keyValue.email}" is already in use`,
    }
  } else {
    response.status = 500
    response.body = {
      message: "Something went wrong",
      error: err,
    }
  }
  console.error(err)
  return response
}

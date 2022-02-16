module.exports = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode
  const body = { message: err.message }

  // mongoose error code for duplicate unique identifier
  if (err.code === 11000) {
    let field

    if (err.keyPattern.username === 1) field = "username"
    else if (err.keyPattern.email === 1) field = "email"

    return res.status(400).json({
      message: `The ${field} "${
        err.keyValue.username || err.keyValue.email
      }" is already in use.`,
    })
  }

  console.log(`\nError: ${body.message}`.red.bold)
  if (process.env.NODE_ENV !== "production") {
    body.stack = err.stack
    console.log(body.stack.grey)
  }

  return res.status(status).json(body)
}

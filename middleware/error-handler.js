module.exports = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode
  const body = { message: err.message }

  if (err.code === 11000) {
    console.log(err)
    return res.json(err)
  }

  console.log(`\nError: ${body.message}`.red.bold)
  if (process.env.NODE_ENV !== "production") {
    body.stack = err.stack
    console.log(body.stack.grey)
  }

  return res.status(status).json(body)
}

module.exports = (err, req, res) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode
  const body = { message: err.message }

  console.error(`\nError: ${err.message}`.red.bold)

  if (proccess.env.NODE_ENV !== "production") {
    body.stack = err.stack
    console.error(err.stack.red)
  }

  res.status(status).json(body)
}

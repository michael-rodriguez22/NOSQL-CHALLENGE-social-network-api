const handleUserControllerErrors = require("./handle-user-controller-errors"),
  handleThoughtControllerErrors = require("./handle-thought-controller-errors")

const isEmail = email => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)

const isValidLength = string => string.length > 0 && string.length < 280

const validLengthMessage = text =>
  `${text} must be between 0 and 280 characters`

// TODO: return formatted date string
const formatDate = date => "write date formatting function"

module.exports = {
  isEmail,
  isValidLength,
  validLengthMessage,
  formatDate,
  handleUserControllerErrors,
  handleThoughtControllerErrors,
}

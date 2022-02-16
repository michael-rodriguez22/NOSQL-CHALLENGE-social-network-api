const isEmail = email => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)

const isValidLength = string => string.length > 0 && string.length < 280

const validLengthMessage = text =>
  `${text} must be between 0 and 280 characters`

const formatDate = timestamp => new Date(timestamp).toLocaleString()

module.exports = {
  isEmail,
  isValidLength,
  validLengthMessage,
  formatDate,
}

function formatMessage(username, msg) {
  return {
    id: Math.random(),
    username,
    msg,
  }
}

module.exports = formatMessage;
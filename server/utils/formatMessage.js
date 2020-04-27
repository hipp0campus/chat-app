const { uuid } = require('uuidv4');

function formatMessage(username, msg) {
  return {
    message: msg,
    user: username,
    _id: uuid(),
  }
}

module.exports = formatMessage;
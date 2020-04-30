function validate(msg) {
  if (!!msg.room && !!msg.user && !!msg.message) return true;

  return false;
}

module.exports = validate;
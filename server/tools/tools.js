const bcrypt = require('bcrypt')

const tools = {
  encrypt (password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}

module.exports = tools
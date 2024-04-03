const crypto = require('crypto');

/**
 * 
 * @param {string} password -> raw password
 * @param {string} hashedPassword -> hashed password
 * @returns a boolean whether the input password matches with a hashedPassword
 */
const verifyPassword = (password, hashedPassword) => {
  const parts = hashedPassword.split('$')

  var iterations = parseInt(parts[1])
  var salt = parts[2]
  var savedHash = parts[3]

  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString("base64");
  return hash === savedHash;
}

const hashedPassword = (password) => {
  const iterations = 320000
  const salt = crypto.randomBytes(11).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString("base64");

  return "pbkdf2_sha256$" + iterations + "$" + salt + "$" + hash;
}

module.exports = {
  verifyPassword, 
  hashedPassword
}
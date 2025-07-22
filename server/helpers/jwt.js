const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

module.exports = {
  generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1d' });
  },

  verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
};
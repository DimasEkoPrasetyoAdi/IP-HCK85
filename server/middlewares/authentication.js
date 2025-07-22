// middlewares/authentication.js
const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: 'Unauthorized', message: 'Access token required' };
    }

    const decoded = verifyToken(access_token);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw { name: 'Unauthorized', message: 'Invalid token' };
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;

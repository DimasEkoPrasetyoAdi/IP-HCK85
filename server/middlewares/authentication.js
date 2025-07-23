const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw { name: 'Unauthorized', message: 'Access token required' };
    }

    const rawToken = authorization.split(' ');
    const tokenType = rawToken[0];
    const tokenValue = rawToken[1];

    if (tokenType !== 'Bearer' || !tokenValue) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    const payload = verifyToken(tokenValue);
    
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

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

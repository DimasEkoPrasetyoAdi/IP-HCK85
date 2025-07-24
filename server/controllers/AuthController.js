const { User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class AuthController {
  static async register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password: hashPassword(password)
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    next(err);
  }
}


  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user || !comparePassword(password, user.password)) {
        throw { name: 'Unauthorized', message: 'Invalid email or password' };
      }

      const access_token = generateToken({ id: user.id, email: user.email });
      res.json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

const { User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const WEB_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

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

  static async googleLogin(req, res, next) {

    const { id_token } = req.headers;

    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: WEB_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name, sub: userid } = payload;

      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: hashPassword(userid),
        });
      }

      const access_token = generateToken({ id: user.id, email: user.email });
      res.status(200).json({ access_token });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }

}

module.exports = AuthController;

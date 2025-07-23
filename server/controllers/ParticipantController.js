const { SessionParticipant } = require('../models');

class ParticipantController {
  static async join(req, res, next) {
    try {
      const { session_id } = req.body;

      const participant = await SessionParticipant.create({
        session_id,
        user_id: req.user.id
      });

      res.status(201).json(participant);
    } catch (error) {
      next(error);
    }
  }

  static async leave(req, res, next) {
    try {
      const { session_id } = req.params;

      const count = await SessionParticipant.destroy({
        where: {
          session_id,
          user_id: req.user.id
        }
      });

      if (!count) throw { name: 'NotFound', message: 'Not participating in this session' };

      res.json({ message: 'You left the session' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ParticipantController;

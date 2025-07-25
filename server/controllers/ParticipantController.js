const { SessionParticipant, Session, User, sequelize } = require('../models');

class ParticipantController {
  static async join(req, res, next) {
    try {
    
      const { session_id } = req.body;

      if (!session_id) {
        return res.status(400).json({ 
          status: "error",
          message: "session_id is required" 
        });
      }

      // Validate user authentication
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: "error",
          message: "Authentication required"
        });
      }

      // Verify user exists
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "User not found"
        });
      }

      // Check if session exists
      const session = await Session.findByPk(session_id);
      if (!session) {
        return res.status(404).json({
          status: "error",
          message: "Session not found"
        });
      }

      // Check if user already joined
      const existingParticipant = await sequelize.query(
        'SELECT session_id, user_id FROM "SessionParticipants" WHERE session_id = ? AND user_id = ? LIMIT 1',
        {
          replacements: [session_id, req.user.id],
          type: sequelize.QueryTypes.SELECT,
          plain: true
        }
      );

      if (existingParticipant) {
        return res.status(400).json({ 
          status: "error",
          message: "Already joined this session" 
        });
      }

      
      const [participant] = await sequelize.query(
        'INSERT INTO "SessionParticipants" (session_id, user_id, "createdAt", "updatedAt") VALUES (?, ?, NOW(), NOW()) RETURNING session_id, user_id',
        {
          replacements: [session_id, req.user.id],
          type: sequelize.QueryTypes.INSERT,
          plain: true
        }
      );

      res.status(201).json({
        message: "Successfully joined session",
        data: participant
      });
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

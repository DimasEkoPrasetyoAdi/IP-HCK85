const { Session, User, Sport } = require('../models');

class PublicController {
  static async listPublic(req, res, next) {
    try {
      const sessions = await Session.findAll({
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name']
          },
          {
            model: Sport,
            attributes: ['id', 'name']
          }
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['session_date', 'ASC']]
      })

      const mappedSessions = sessions.map(session => {
        return {
          id: session.id,
          title: session.title,
          description: session.description,
          session_date: session.session_date,
          duration: session.duration_hours,                //  sama dengan frontend
          max_participants: session.max_participants,
          image_url: session.image_url,
          sport: session.Sport?.name || "-",
          host: session.host?.name || "Unknown",

          category: session.category || "-",              // ini harus ada di model/table kamu
          province: session.provinsi_id || "-",
          regency: session.kabupaten_id || "-",
          district: session.kecamatan_id || "-"
        };
      });
      

      res.status(200).json(mappedSessions);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicController;

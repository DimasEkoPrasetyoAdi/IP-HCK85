const { Session, Sport, User, sequelize, SessionParticipant} = require('../models')

class SessionController {
    static async create(req, res, next) {
        try {
            const {
                sport_id, provinsi_id, kabupaten_id, kecamatan_id,
                title, description, session_date, duration_hours } = req.body;

            const session = await Session.create({
                host_id: req.user.id,
                sport_id,
                provinsi_id,
                kabupaten_id,
                kecamatan_id,
                title,
                description,
                session_date,
                duration_hours,
                ai_recommendation: null
            });

            res.status(201).json(session);
        } catch (error) {
            next(error);
        }
    }

  static async list(req, res, next) {
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
          },
          {
            model: User,
            as: 'participants',
            attributes: ['id'],
            through: { attributes: [] }
          }
        ],
        order: [['session_date', 'ASC']]
      });

      const result = sessions.map(s => {
        const json = s.toJSON();
        json.current_participants = json.participants.length;
        json.joined = json.participants.some(p => p.id === req.user.id);
        delete json.participants;
        return json;
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }



    static async SportList(req, res, next) {
        try {
            const sport = await Sport.findAll({
                attributes: ['id', 'name'],
                order: [['name', 'ASC']]
            })
            res.status(200).json(sport);
        } catch (error) {
            next(error);
        }
    }

    static async detail(req, res, next) {
        try {
            const { id } = req.params;
            const session = await Session.findByPk(id, {
                include: [Sport, { model: User, as: 'host', attributes: ['id', 'name'] }]
            })
            if (!session) throw { name: 'NotFound', message: 'Session not found' }

            res.json(session);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params
            const {
                sport_id, provinsi_id, kabupaten_id, kecamatan_id,
                title, description, session_date, duration_hours
            } = req.body;

            const session = await Session.findByPk(id);

            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }

            await session.update({
                sport_id,
                provinsi_id,
                kabupaten_id,
                kecamatan_id,
                title,
                description,
                session_date,
                duration_hours
            });

            res.status(200).json(session);

        } catch (error) {
            next(error);
        }
    }


    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const session = await Session.findByPk(id);

            if (!session) throw { name: 'NotFound', message: 'Session not found' }

            await session.destroy();
            res.json({ message: 'Session deleted' });
        } catch (error) {
            console.error(error)
            if (error.name === 'NotFound') {
                return res.status(404).json({ error: error.message });
            }

            next(error);
        }
    }
}

module.exports = SessionController

const { Session, Sport, User } = require('../models')

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
        } catch (err) {
            next(err);
        }
    }

    static async list(req, res, next) {
        try {
            const sessions = await Session.findAll({
                include: [Sport, 
                    { model: User, as: 'host', attributes: ['id', 'name'] }
                ]
            });
            res.json(sessions);
        } catch (err) {
            next(err);
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
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const session = await Session.findByPk(id);
            if (!session) throw { name: 'NotFound', message: 'Session not found' }

            await session.destroy();
            res.json({ message: 'Session deleted' });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = SessionController

const { Session, Sport, User, sequelize, SessionParticipant} = require('../models')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class SessionController {
    static async create(req, res, next) {
        try {
            console.log('Create session request body:', req.body);
            
            const {
                sport_id, provinsi_id, kabupaten_id, kecamatan_id,
                title, description, session_date, duration_hours 
            } = req.body || {};

            // Convert string values to proper types
            const sessionData = {
                host_id: req.user.id,
                sport_id: sport_id ? parseInt(sport_id) : null,
                provinsi_id: provinsi_id || null,
                kabupaten_id: kabupaten_id || null,
                kecamatan_id: kecamatan_id || null,
                title: title || null,
                description: description || null,
                session_date: session_date || null,
                duration_hours: duration_hours ? parseInt(duration_hours) : null,
                ai_recommendation: null
            };

            console.log('Processed session data:', sessionData);

            const session = await Session.create(sessionData);

            res.status(201).json(session);
        } catch (error) {
            console.error('Create session error:', error);
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
        // Only check if user is joined if req.user exists
        json.joined = req.user ? json.participants.some(p => p.id === req.user.id) : false;
        delete json.participants;
        return json;
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

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
        json.joined = false; // For public endpoint, always false
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
            const { id } = req.params;
            
            const session = await Session.findByPk(id);

            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }

            // If no body provided, return current session
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(200).json(session);
            }

            const {
                sport_id, provinsi_id, kabupaten_id, kecamatan_id,
                title, description, session_date, duration_hours
            } = req.body;

            // Update with provided data
            await session.update({
                sport_id: sport_id || session.sport_id,
                provinsi_id: provinsi_id || session.provinsi_id,
                kabupaten_id: kabupaten_id || session.kabupaten_id,
                kecamatan_id: kecamatan_id || session.kecamatan_id,
                title: title || session.title,
                description: description !== undefined ? description : session.description,
                session_date: session_date || session.session_date,
                duration_hours: duration_hours || session.duration_hours
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

    static async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
      }

      const sessionId = +req.params.id;
      if (!sessionId || isNaN(sessionId)) {
        return res.status(400).json({ message: 'Valid Session ID is required in URL' });
      }

      const session = await Session.findByPk(sessionId);
      if (!session) {
        return res.status(404).json({ message: `Session with id ${sessionId} not found` });
      }

      // Upload ke Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'sessions',
            resource_type: 'image',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      // Simpan URL hasil Cloudinary ke DB
      await session.update({ image_url: uploadResult.secure_url });

      res.status(200).json({
        message: 'Image uploaded and session updated successfully',
        image_url: uploadResult.secure_url,
        session: session
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ 
        message: 'Failed to upload image',
        error: err.message 
      });
    }
  }
}

module.exports = SessionController

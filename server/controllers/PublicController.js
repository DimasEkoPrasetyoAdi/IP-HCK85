const {Session, User, Sport} = require('../models');

class PublicController {

    static async list(req, res, next) {
        try {
            const sessions = await Session.findAll({
                include: [Sport, 
                    { model: User, as: 'host', attributes: ['id', 'name'] }
                ]
            });
            res.json(sessions);
        } catch (error) {
            next(error);
        }
    }
   
}

module.exports = PublicController;
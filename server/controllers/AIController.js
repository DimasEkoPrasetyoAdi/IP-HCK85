const { Configuration, OpenAIApi } = require('openai');
const { Session, Sport } = require('../models');

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

class AIController {
  static async generateRecommendation(req, res, next) {
    try {
      const { sessionId } = req.params;

      const session = await Session.findByPk(sessionId, {
        include: [Sport]
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      const sportName = session.Sport.name;
      const duration = session.duration_hours;
      const caloriesPerHour = session.Sport.calories_per_hour;

      const prompt = `
Saya ingin tahu berapa kira-kira total kalori yang dibakar untuk olahraga ${sportName} selama ${duration} jam untuk level intermediate.
Olahraga ini membakar sekitar ${caloriesPerHour} kalori per jam untuk level intermediate. 
Berikan jawaban singkat dalam 1 kalimat beserta sedikit saran tentang kesehatan saat berolahraga.
`;

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });

      const recommendation = completion.data.choices[0].message.content.trim();

      session.ai_recommendation = recommendation;
      await session.save();

      res.status(200).json({
        message: 'AI recommendation generated',
        recommendation
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AIController;

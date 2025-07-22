"use strict";
require("dotenv").config();
const { Session, Sport } = require("../models");

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


class AIController {
  static async generateRecommendation(req, res, next) {
    try {
      const { sessionId } = req.params;

      const session = await Session.findByPk(sessionId, {
        include: [Sport],
      });

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const sportName = session.Sport.name;
      const duration = session.duration_hours;
      const caloriesPerHour = session.Sport.calories_per_hour;

      const prompt = `
Saya ingin tahu berapa kira-kira total kalori yang dibakar untuk olahraga ${sportName} selama ${duration} jam untuk level intermediate.
Olahraga ini membakar sekitar ${caloriesPerHour} kalori per jam untuk level intermediate.
Berikan jawaban singkat dalam 1 kalimat beserta sedikit saran tentang kesehatan saat berolahraga.
`;

      const model = ai.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recommendation = response.text();

      session.ai_recommendation = recommendation;
      await session.save();

      res.status(200).json({
        message: "AI recommendation generated",
        recommendation,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AIController
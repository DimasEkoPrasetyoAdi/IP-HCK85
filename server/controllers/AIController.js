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

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        
        console.log("Debug - Full Result:", JSON.stringify(result, null, 2));
        
        if (!result || !result.response || !result.response.candidates || !result.response.candidates[0]) {
          throw new Error("No valid response from Gemini API");
        }

        // Get the text from the first candidate's content
        const text = result.response.candidates[0].content.parts[0].text;
        console.log("Debug - Generated Text:", text);
        
        if (!text) {
          throw new Error("Empty response from AI");
        }

        // Update the session with the AI recommendation
        await session.update({ ai_recommendation: text });

        return res.status(200).json({
          message: "AI recommendation generated successfully",
          recommendation: text,
          session_id: sessionId,
          sport: sportName,
          duration: duration,
          calories_per_hour: caloriesPerHour
        });
      } catch (aiError) {
        console.error("Gemini API Error:", aiError);
        return res.status(500).json({
          message: "Failed to generate AI recommendation",
          error: aiError.message
        });
      }
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
}

module.exports = AIController;

import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_PROMPT =
    "You are a helpful and friendly assistant for Maa Janki Bakery & Farsan Store. " +
    "Help users find bakery items, sweets, snacks, and farsan. Be polite, concise, and helpful.";

// PUBLIC route - no auth middleware
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ success: false, error: "Message is required." });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("[Chatbot] GROQ_API_KEY not set in .env");
            return res.status(500).json({ success: false, error: "AI service is not configured (Groq Cloud)." });
        }

        console.log(`[Chatbot] Sending to Grok Cloud | llama-3.3-70b-versatile | Message: "${message.substring(0, 60)}"`);

        // Using standard OpenAI-compatible completions endpoint
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: message.trim() }
                ],
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content;

        if (reply) {
            console.log("[Chatbot] ✅ Reply received successfully from Groq.");
            return res.status(200).json({ success: true, reply });
        }

        console.error("[Chatbot] No reply found in Groq response:", JSON.stringify(response.data).substring(0, 500));
        return res.status(500).json({
            success: false,
            error: "Could not extract reply from AI response.",
            raw: response.data
        });

    } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        const details = data?.error?.message || data?.error || error.message;

        console.error(`[Chatbot] ❌ Groq API Error | HTTP ${status || 'N/A'} | ${JSON.stringify(details)}`);

        if (status === 401) {
            return res.status(401).json({
                success: false,
                error: "Invalid API key. Please update GROQ_API_KEY in your .env file."
            });
        }

        if (status === 429) {
            return res.status(429).json({
                success: false,
                error: "Rate limit reached on Groq free tier. Please wait a moment."
            });
        }

        return res.status(status || 500).json({
            success: false,
            error: "AI service error (Groq).",
            details: typeof details === 'string' ? details : JSON.stringify(details)
        });
    }
});

export default router;


const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-6-luna",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI API error:", data);
      return res.status(502).json({
        error: "AI service is temporarily unavailable."
      });
    }

    res.json({
      reply: data.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Nexora AI server running on ${PORT}`);
});

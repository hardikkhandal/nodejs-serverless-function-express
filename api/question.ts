
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import bodyParser from 'body-parser';
import { getTranscript } from 'youtube-transcript-api';
let {generateText} = require("../services/groqServices");
let {extractVideoId} = require("../services/extractVideoId");


const app = express();
app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.post('/api/question', async (req: VercelRequest, res: VercelResponse) => {
  const { message, videoUrl } = req.body;

  console.log("Received question on question.js:", message);

  try {
    const videoId = extractVideoId(videoUrl);
    const transcript = await getTranscript(videoId, { timeout: 60000 });
    const transcriptText = transcript.map((entry) => entry.text).join(" ");

    const prompt = `${message} from the youtube url ${videoUrl} and having transcript ${transcriptText}. Only tell answer in shortest sentence`;
    const answer = await generateText("llama3-8b-8192", prompt);

    console.log(answer);
    res.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Error generating answer:", error.message);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

export default app;
    // import type { VercelRequest, VercelResponse } from '@vercel/node'
    // import bodyParser from 'body-parser';

    // const express = require("express");
    // const { getTranscript } = require("youtube-transcript-api");
    // import { YoutubeTranscript } from 'youtube-transcript';
    // const { generateText } = require("../services/groqServices");
    // const { extractVideoId } = require("../services/extractVideoId");


    // const router = express.Router();
    

    // export default async function handler(req: VercelRequest, res: VercelResponse) {
    //     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // try {
    //     console.log("Request body:", req.body);
    //     console.log("Req body:", req.body);
    //     const { videoUrl } = req.body;
    //     console.log("Request received to summarize video:", videoUrl);
    //     const videoId = extractVideoId(videoUrl);

    //     const transcript = await getTranscript(videoId, { timeout: 60000 });
    // const transcriptText = transcript.map((entry) => entry.text).join(" ");
    // console.log("Fetched transcript:", transcriptText);

    //     const prompt = `Summarize the video at the following URL: ${videoUrl}. Transcript: ${transcriptText} in few words`;
    //     const summary =await generateText("llama3-8b-8192", prompt);

    //     console.log(summary);
    //     res.json({ summary: summary});
    // } catch (error) {
    //     console.error("Error summarizing video:", error.message);
    //     res.status(500).json({ error: "Failed to summarize video" });
    // }
    // }























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

app.post('/api/summarize', async (req: VercelRequest, res: VercelResponse) => {
  try {
    console.log("Request body:", req.body);
    const { videoUrl } = req.body;
    console.log("Request received to summarize video:", videoUrl);

    if (!videoUrl) {
      return res.status(400).json({ error: 'videoUrl is required' });
    }

    const videoId = extractVideoId(videoUrl);
    const transcript = await getTranscript(videoId, { timeout: 60000 });
    const transcriptText = transcript.map((entry) => entry.text).join(" ");
    console.log("Fetched transcript:", transcriptText);

    const prompt = `Summarize the video at the following URL: ${videoUrl}. Transcript: ${transcriptText} in few words`;
    const summary = await generateText("llama3-8b-8192", prompt);

    console.log(summary);
    res.json({ summary: summary });
  } catch (error) {
    console.error("Error summarizing video:", error.message);
    res.status(500).json({ error: "Failed to summarize video" });
  }
});

export default app;

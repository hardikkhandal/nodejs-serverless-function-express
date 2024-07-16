    import type { VercelRequest, VercelResponse } from '@vercel/node'
    import express from 'express';
    const { getTranscript } = require("youtube-transcript-api");
    import { YoutubeTranscript } from 'youtube-transcript';
    const { generateText } = require("../services/groqServices");
    const { extractVideoId } = require("../services/extractVideoId");

    const router = express.Router();

    export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Request body:", req.body);
    const { videoUrl } = req.body;
    console.log("Request received to summarize video:", videoUrl);
    const videoId = extractVideoId(videoUrl);

    // Fetch transcript
    const transcript = await getTranscript(videoId, { timeout: 60000 });
    const transcriptText = transcript.map((entry: any) => entry.text).join(" ");
    console.log("Fetched transcript:", transcriptText);

    // Temporary static summary for testing
    const summary = "This is a test summary";

    console.log("Generated summary:", summary);
    res.json({ summary });
  } catch (error: any) {
    console.error("Error summarizing video:", error.message);
    res.status(500).json({ error: "Failed to summarize video" });
  }
}

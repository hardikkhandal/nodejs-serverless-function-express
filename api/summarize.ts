    import type { VercelRequest, VercelResponse } from '@vercel/node'
    const express = require("express");
    const { getTranscript } = require("youtube-transcript-api");
    import { YoutubeTranscript } from 'youtube-transcript';
    const { generateText } = require("../services/groqServices");
    const { extractVideoId } = require("../services/extractVideoId");

    const router = express.Router();

    export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        console.log("Request body:", req.body);
        const { videoUrl } = req.body;
        console.log("Request received to summarize video:", videoUrl);
        const videoId = extractVideoId(videoUrl);

        // const transcript = getTranscript(videoId, { timeout: 60000 });
        let transcriptText = YoutubeTranscript.fetchTranscript(`${videoId}`).then(console.log);
        console.log("Fetched transcript:", transcriptText);

        const prompt = `Summarize the video at the following URL: ${videoUrl}. Transcript: ${transcriptText} in few words`;
        const summary = generateText("llama3-8b-8192", prompt);

        console.log(summary);
        res.json({ summary: summary});
    } catch (error) {
        console.error("Error summarizing video:", error.message);
        res.status(500).json({ error: "Failed to summarize video" });
    }
    }

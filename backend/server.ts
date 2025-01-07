import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
import { Request, Response, RequestHandler } from 'express';
import * as fs from 'fs';
import { Readable } from 'stream';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    methods: ['GET', 'POST']
  },
  transports: ['websocket'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected, ID:', socket.id);

  socket.on('audioChunk', async (audioData: number[]) => {
    console.log('Received audio chunk, size:', audioData.length);
    try {
      const transcription = await processAudioChunk(audioData);
      console.log('Transcription result:', transcription);
      socket.emit('transcription', transcription);
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      socket.emit('error', 'Failed to process audio chunk');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected, ID:', socket.id);
  });
});

// Audio processing function
async function processAudioChunk(audioData: number[]): Promise<string> {
  try {
    const audioBuffer = Buffer.from(audioData);
    const tempFilePath = `temp-${Date.now()}.webm`;
    
    // Check if this is a valid WebM file by looking for the EBML header
    const hasEBMLHeader = audioBuffer.includes(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
    
    if (!hasEBMLHeader) {
      console.log('Invalid WebM format, skipping chunk');
      return ''; // Return empty string for invalid chunks
    }
    
    await fs.promises.writeFile(tempFilePath, audioBuffer);
    
    console.log('Processing audio chunk with OpenAI...');
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      response_format: 'text',
    });

    await fs.promises.unlink(tempFilePath).catch(console.error);
    return response;
  } catch (error) {
    console.error('Detailed transcription error:', error);
    throw error;
  }
}

async function cleanupTranscript(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical transcription assistant. Your task is to clean up transcribed text by removing duplicates while ensuring no information is lost. Maintain all medical terms, numbers, and punctuation exactly as they appear. Keep the text in its original order."
        },
        {
          role: "user",
          content: `Please clean up this transcription by removing any duplicated phrases while preserving all unique information: "${text}"`
        }
      ],
      temperature: 0
    });

    return response.choices[0].message!.content!;
  } catch (error) {
    console.error('Error cleaning up transcript:', error);
    return text; // Return original text if cleanup fails
  }
}

interface Summary {
  text: string;
  subjective: string;
  pmh: string;
  medications: string;
  familyHistory: string;
  examination: string;
  assessment: string;
  plan: string;
}

async function generateSummary(transcription: string): Promise<Summary> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a medical transcription assistant. Generate a structured medical consultation summary as a JSON object from the transcription. 
          The JSON response must include these exact fields:
          {
            "text": "Complete cleaned transcript with duplicates removed",
            "subjective": "Patient's reported symptoms and concerns",
            "pmh": "Past Medical History",
            "medications": "Current and relevant past medications",
            "familyHistory": "Relevant family medical history",
            "examination": "Physical examination findings",
            "assessment": "Diagnosis and clinical impressions",
            "plan": "Treatment plan, follow-up, and recommendations"
          }`
        },
        {
          role: "user",
          content: `Please create a JSON formatted medical consultation summary from this transcription: "${transcription}"`
        }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const summary = JSON.parse(response.choices[0].message.content!) as Summary;
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      text: transcription,
      subjective: "Error generating summary",
      pmh: "",
      medications: "",
      familyHistory: "",
      examination: "",
      assessment: "",
      plan: ""
    };
  }
}

app.post('/generate-summary', async (req, res) => {
  try {
    const { transcription } = req.body;
    const cleanedTranscription = await cleanupTranscript(transcription);
    const summary = await generateSummary(cleanedTranscription);
    res.json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      summary: {
        text: req.body.transcription,
        subjective: "Error generating summary",
        pmh: "",
        medications: "",
        familyHistory: "",
        examination: "",
        assessment: "",
        plan: ""
      }
    });
  }
});

// app.get('/test-openai', async (req, res) => {
//   try {
//     const models = await openai.models.list();
//     res.json({ success: true, models });
//   } catch (error) {
//     console.error('OpenAI test failed:', error);
//     res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
//   }
// });

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
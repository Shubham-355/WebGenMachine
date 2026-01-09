import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {defaultPrompt, getSystemPrompt } from './prompts.js';
const multer = require('multer');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY as string });

const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint to generate website based on prompt
app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    const userprompt = req.body.prompt;
    
    if (!userprompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }
    
    const systemPrompt = getSystemPrompt();
    
    let baseImage = null;
    let mimeType = null;

    // Check if an image uploaded
    if (req.file) {
      const imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      baseImage = imageBuffer.toString("base64");
    }

    // Construct the parts array conditionally
    const parts = [];

    if (baseImage && mimeType) {
      parts.push({
        inlineData: {
          data: baseImage,
          mimeType: mimeType,
        },
      });
    }

    parts.push(
      { text: systemPrompt },
      { text: `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${defaultPrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n` },
      { text: userprompt }
    );

    // Generate content using the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: parts,
        }
      ],
      config: {
        maxOutputTokens: 8000,
        temperature: 0.1,
      }
    });
    
    // Get the generated text
    const generatedText = response.text || '';
    console.log('Generated text:', generatedText);
    
    res.status(200).json({
      steps: generatedText, basefiles: defaultPrompt
    });
    
  } catch (error) {
    console.error('Error generating website:', error);
    res.status(500).json({ 
      error: 'Failed to generate website',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

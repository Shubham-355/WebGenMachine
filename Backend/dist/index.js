"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const prompts_js_1 = require("./prompts.js");
const multer = require('multer');
const cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ALLOWED_ORIGINS = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));
app.use(express_1.default.json());
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });
// Endpoint to generate website based on prompt
app.post('/api/generate', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userprompt = req.body.prompt;
        if (!userprompt) {
            res.status(400).json({ error: 'Prompt is required' });
            return;
        }
        const systemPrompt = (0, prompts_js_1.getSystemPrompt)();
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
        parts.push({ text: systemPrompt }, { text: `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${prompts_js_1.defaultPrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n` }, { text: userprompt });
        // Generate content using the Gemini API
        const response = yield ai.models.generateContent({
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
            steps: generatedText, basefiles: prompts_js_1.defaultPrompt
        });
    }
    catch (error) {
        console.error('Error generating website:', error);
        res.status(500).json({
            error: 'Failed to generate website',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

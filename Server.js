const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files (index.html, CSS, JS)

app.post('/generate-question', async (req, res) => {
    const { level, type } = req.body;
    let questionData = {};

    try {
        switch (type) {
            case 'translation':
                questionData = await generateTranslationQuestion(level);
                break;
            case 'fillInTheBlank':
                questionData = await generateFillInTheBlankQuestion(level);
                break;
            // Add more cases as per your game types (e.g., verbConjugation, matching)
            default:
                questionData = { question: 'Unknown question type', correctAnswer: '', options: [] };
        }

        res.json(questionData);
    } catch (error) {
        res.status(500).json({ error: 'Error generating question' });
    }
});

async function generateTranslationQuestion(level) {
    const sentenceToTranslate = 'How are you today?'; // Example sentence to translate

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es',
            { inputs: sentenceToTranslate },
            {
                headers: {
                    'Authorization': `Bearer YOUR_HUGGINGFACE_API_KEY`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const translatedText = response.data[0].translation_text;
        const options = [
            translatedText,
            "¿Cómo te llamas?", // Wrong options (example)
            "¿Qué hora es?", 
            "¿Dónde está la biblioteca?"
        ];

        return { 
            question: `Translate the following sentence into Spanish: "${sentenceToTranslate}"`,
            correctAnswer: translatedText,
            options: options.sort(() => Math.random() - 0.5),  // Shuffle options for randomness
        };
    } catch (error) {
        console.error('Error generating question:', error);
        return { question: 'Error generating question', correctAnswer: '', options: [] };
    }
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

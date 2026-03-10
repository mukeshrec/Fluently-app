import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Configuration ---
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

// Check if Supabase keys exist
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase URL or Key in .env file.");
} else {
    console.log("✅ Supabase Configuration loaded.");
}

const supabase = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_KEY || 'placeholder');

// --- Health Check ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'Fluently Backend is running' });
});

// --- Ollama Proxy Route: Chat ---
app.post('/api/chat', async (req, res) => {
    try {
        // Node 18+ has global fetch, but if not we'd use node-fetch
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error(`Ollama returned status ${response.status}`);
        }

        // Setup streaming response back to the client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Node fetch streams use NodeJS Readable stream if it's node-fetch, 
        // but native fetch uses Web Streams. We handle Web Streams here:
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                res.end();
                break;
            }
            res.write(decoder.decode(value, { stream: true }));
        }

    } catch (error) {
        console.error('Error connecting to Ollama:', error);
        res.status(500).json({ error: 'Failed to communicate with Local AI.' });
    }
});

// --- Ollama Proxy Route: Assessment ---
app.post('/api/assessment', async (req, res) => {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', // or user configured model
                prompt: req.body.prompt,
                stream: false,
                format: 'json',
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama returned status ${response.status}`);
        }

        const data = await response.json();
        res.json({ response: data.response });

    } catch (error) {
        console.error('Error in assessment generation:', error);
        res.status(500).json({ error: 'Failed to generate assessment.' });
    }
});

// --- User Profile Handling ---
app.post('/api/profile', async (req, res) => {
    const { user_id, assessment_data } = req.body;

    if (!user_id || !assessment_data) {
        return res.status(400).json({ error: 'Missing user_id or assessment_data' });
    }

    try {
        // Upsert user profile into Supabase
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                user_id,
                assessment_data: assessment_data,
                updated_at: new Date()
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, profile: data });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

app.get('/api/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"

        if (!data) return res.status(404).json({ error: 'Profile not found' });

        res.json({ profile: data });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Fluently Server running on port ${PORT}`);
    console.log(`🔗 Proxying LLM to ${OLLAMA_URL}`);
});

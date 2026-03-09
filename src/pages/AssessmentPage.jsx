import { useState, useRef, useEffect } from 'react';

// Using the same Llama3 backend URL you use for ChatPage
const OLLAMA_BASE_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3';

const READING_PASSAGE = `"When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon."`;

const SYSTEM_PROMPT = `You are an expert AI speech-language pathologist specializing in stuttering. 
A user with a suspected or confirmed stutter has just read a standard passage.

Your job:
1. Briefly analyze the provided transcript of their speech for potential stutters, blocks, repetitions, or reading difficulties.
2. Provide a short, highly encouraging, and empathetic paragraph diagnosis/feedback.
3. Determine 3 to 5 targeted therapy tasks they should practice (e.g., "Breathing Basics", "Gentle Onsets on Plosives", "Pacing Control", "Light Articulatory Contacts", "Reading Aloud Practice"). The tasks should be short string labels.

You MUST respond ONLY with valid JSON in exactly this format, and absolutely nothing else:
{
  "diagnosis": "Short, encouraging paragraph about what you observed and how they can improve.",
  "assigned_tasks": ["Task 1", "Task 2", "Task 3"]
}`;

export default function AssessmentPage({ onComplete }) {
    const [step, setStep] = useState(1); // 1: Intro, 2: Reading, 3: Analyzing, 4: Result
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let currentTranscript = '';
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setError('Microphone access was denied. Please allow microphone permissions to continue.');
                    setIsRecording(false);
                }
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
            setError('Your browser does not support the Web Speech API. Please use Chrome or Edge.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setError('');
            // Optional: reset transcript each time they start, or keep appending. Here we reset.
            setTranscript('');
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error(e); // Might throw if already started
            }
        }
    };

    const analyzeSpeech = async () => {
        if (!transcript.trim()) {
            setError('Please read the passage out loud before continuing.');
            return;
        }

        setStep(3); // Move to analyzing step
        setError('');

        try {
            const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    prompt: `User Transcript:\n"${transcript}"\n\nOriginal Passage:\n${READING_PASSAGE}`,
                    system: SYSTEM_PROMPT,
                    stream: false,
                    format: 'json' // Request JSON output format from Ollama (works well in llama3)
                }),
            });

            if (!response.ok) throw new Error('Failed to reach AI Backend.');

            const data = await response.json();
            const parsed = JSON.parse(data.response); // Parse the JSON string from Llama3

            if (parsed.diagnosis && parsed.assigned_tasks) {
                setResult(parsed);
                setStep(4);
            } else {
                throw new Error("Invalid format returned by AI.");
            }

        } catch (err) {
            console.error(err);
            setError('There was an error analyzing your speech. Make sure Ollama is running (`ollama serve`).');
            setStep(2); // Go back to reading step so they can try again without losing transcript
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Step 1: Welcome Intro */}
            {step === 1 && (
                <div className="fade-in text-center" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎙️</div>
                    <h1 className="section-title">Let's Personalize Your <em>Journey</em></h1>
                    <p className="section-sub" style={{ margin: '0 auto 40px' }}>
                        To create the best therapy plan for you, Aria (our AI Coach) needs to hear you speak.
                        We'll ask you to read a short passage out loud. It's completely private and processed locally on your device.
                    </p>
                    <button className="btn-primary" onClick={() => setStep(2)}>
                        I'm Ready
                    </button>
                </div>
            )}

            {/* Step 2: Reading & Recording */}
            {step === 2 && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem', margin: 0 }}>Reading Check</h2>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Step 1 of 2</div>
                    </div>

                    {error && (
                        <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #FECACA' }}>
                            {error}
                        </div>
                    )}

                    <div className="assessment-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '40px', boxShadow: 'var(--shadow-soft)', marginBottom: '30px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: '500' }}>
                            {READING_PASSAGE}
                        </p>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <button
                            className={`mic-record-btn ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                            style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                border: 'none', cursor: 'pointer', fontSize: '2rem',
                                background: isRecording ? '#ef4444' : 'var(--teal)',
                                color: 'white',
                                boxShadow: isRecording ? '0 0 0 10px rgba(239, 68, 68, 0.2)' : '0 10px 25px rgba(44, 181, 160, 0.4)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isRecording ? '⏹️' : '🎙️'}
                        </button>
                        <div style={{ marginTop: '16px', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            {isRecording ? 'Listening... Tap to stop' : 'Tap the microphone to start reading'}
                        </div>
                    </div>

                    {transcript && (
                        <div style={{ background: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '8px' }}>Live Transcript</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                "{transcript}"
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-primary"
                            disabled={isRecording || !transcript.trim()}
                            onClick={analyzeSpeech}
                            style={{ opacity: (isRecording || !transcript.trim()) ? 0.5 : 1 }}
                        >
                            Analyze My Speech &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Analyzing / Loading */}
            {step === 3 && (
                <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="analyze-loader" style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 30px' }}>
                        <div className="mic-ring" style={{ border: '3px solid var(--teal)' }}></div>
                        <div className="mic-ring-2" style={{ border: '2px solid var(--blue)' }}></div>
                        <div style={{ fontSize: '2.5rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>🤖</div>
                    </div>
                    <h2 className="section-title" style={{ fontSize: '1.8rem' }}>AI is Analyzing Your Speech...</h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>Building your personalized stuttering therapy plan.</p>
                </div>
            )}

            {/* Step 4: Results */}
            {step === 4 && result && (
                <div className="fade-in">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
                        <h2 className="section-title">Your Personalized Plan is Ready</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: '1fr 1fr' }}>
                        <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-soft)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--teal-deep)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📋 Assessment Feedback
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {result.diagnosis}
                            </p>
                        </div>

                        <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-soft)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🎯 Recommended Focus Areas
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {result.assigned_tasks.map((task, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--sky)', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                        <div style={{ background: 'var(--blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {i + 1}
                                        </div>
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <button className="btn-hero-primary" style={{ margin: '0 auto' }} onClick={() => onComplete(result)}>
                            Start My Gamified Journey
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

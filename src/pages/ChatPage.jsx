import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Point to our new Express/Supabase backend
const BACKEND_URL = 'http://localhost:3001';

// ─── Stutter-Therapy System Prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are Aria, a compassionate and expert AI speech-language pathologist specializing in stuttering therapy. You work within the Fluently app.

Your expertise covers:
- Stuttering fluency techniques: Gentle Onset, Easy Start, Light Contacts, Cancellation, Pull-out, Preparatory Set
- Breathing techniques: Diaphragmatic breathing, breath support, calm-before-speaking exercises
- Pacing and rhythm strategies: Slow speech, pausing power, syllable-timed speech
- Cognitive-behavioral approaches: Desensitization, self-disclosure, acceptance
- Real-life practice: Phone calls, presentations, social situations, ordering food
- Mental wellness: Managing speech anxiety, building confidence, growth mindset
- Child and adult stuttering differences

Persona guidelines:
- Be warm, encouraging, non-judgmental, and patient at all times
- Celebrate even the smallest victories and progress
- Never make the user feel embarrassed or ashamed about stuttering
- Refer to the user as Alex
- Keep responses concise (2-4 short paragraphs max) — wall-of-text is overwhelming
- Use bullet points and numbered steps when giving exercises or techniques
- Occasionally use supportive emojis (not excessively)
- If the user seems distressed, acknowledge feelings before giving advice
- Always end with a gentle, encouraging closing line or question to keep conversation going
- If asked about topics unrelated to speech therapy, gently redirect back to the user's speech journey

Remember: Stuttering is not something to be "fixed" or "cured" — it is managed. Your goal is to help Alex communicate with confidence and reduce the distress associated with stuttering.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGES = [
    {
        role: 'assistant',
        text: "Hi Alex! 👋 Great to see you today. I'm Aria, your personal speech coach. I noticed you've been on a 14-day streak — that's absolutely wonderful!\n\nHow are you feeling about your speech practice lately? Is there a specific technique or situation you'd like to work on today?",
        time: now(),
    },
];

const QUICK_SUGGESTIONS = [
    { label: '🧘 Breathing exercises', text: 'Can you guide me through a breathing exercise for before I speak?' },
    { label: '📞 Phone anxiety', text: 'I get very anxious before phone calls. How can I manage this?' },
    { label: '🎯 Gentle onset', text: 'Can you explain the gentle onset technique and how to practice it?' },
    { label: '📈 My progress', text: 'My fluency score is 87 and I\'ve done 22 sessions this month. How am I doing?' },
    { label: '😰 Bad day', text: 'I had a really bad stuttering day. I feel discouraged.' },
    { label: '🗣️ Presentation tips', text: 'I have a work presentation next week. How do I prepare?' },
];

// ─── Ollama Streaming API Call ────────────────────────────────────────────────
async function streamOllamaChat(conversationHistory, onChunk, signal) {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(m => ({
            role: m.role,
            content: m.text,
        })),
    ];

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
            model: 'llama3', // Optionally driven by backend setting
            messages,
            stream: true,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                num_predict: 512,
            },
        }),
    });

    if (!response.ok) {
        const err = await response.text().catch(() => 'Unknown error');
        throw new Error(`Ollama error ${response.status}: ${err}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.message?.content) {
                    onChunk(parsed.message.content);
                }
                if (parsed.done) return;
            } catch {
                // Partial JSON line — skip
            }
        }
    }
}

// ─── Typing Indicator Component ───────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="msg ai" style={{ animation: 'fadeUp 0.3s ease both' }}>
            <div className="msg-avatar msg-av-ai">🤖</div>
            <div>
                <div className="msg-bubble typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    );
}

// ─── Connection Status Banner ─────────────────────────────────────────────────
function StatusBanner({ status }) {
    if (status === 'connected') return null;

    const configs = {
        connecting: { bg: '#FFF3CD', color: '#856404', icon: '⏳', text: 'Connecting to Llama3…' },
        error: { bg: '#FFF0F0', color: '#9B1C1C', icon: '⚠️', text: 'Cannot reach Ollama. Make sure it\'s running: ollama serve' },
        offline: { bg: '#F0F4FF', color: '#374151', icon: '📡', text: 'Offline mode — using sample responses' },
    };

    const cfg = configs[status] || configs.offline;

    return (
        <div style={{
            background: cfg.bg, color: cfg.color,
            padding: '8px 16px', borderRadius: '10px',
            fontSize: '0.78rem', fontWeight: 600,
            marginBottom: '12px', display: 'flex',
            alignItems: 'center', gap: '8px',
        }}>
            {cfg.icon} {cfg.text}
        </div>
    );
}

// ─── Main ChatPage ────────────────────────────────────────────────────────────
export default function ChatPage() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputVal, setInputVal] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [connStatus, setConnStatus] = useState('connecting'); // 'connecting' | 'connected' | 'error'
    const [suggestions, setSuggestions] = useState(QUICK_SUGGESTIONS);
    const [isTyping, setIsTyping] = useState(false);

    // --- Voice Mode State ---
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // --- Refs ---
    const messagesRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);

    // --- Voice API Refs ---
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const accumulatedTTSChunkRef = useRef(''); // Holds text waiting for a sentence boundary


    // Auto-scroll on new messages
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // ─── Initialize Speech Recognition ───
    useEffect(() => {
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
                setInputVal(currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setIsVoiceMode(false);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                // Auto-send if there is text when recognition naturally stops
                if (inputRef.current?.value.trim()) {
                    sendMessage(inputRef.current.value.trim());
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    // Toggle Voice Mode
    const toggleVoiceMode = () => {
        if (!recognitionRef.current) {
            alert("Your browser doesn't support Voice Mode. Please use Chrome or Edge.");
            return;
        }

        if (isVoiceMode) {
            // Turning OFF
            setIsVoiceMode(false);
            if (isListening) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
        } else {
            // Turning ON
            setIsVoiceMode(true);
            setInputVal(''); // clear input
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    // ─── Read Aloud helper (TTS) ───
    const speakSentence = (text) => {
        if (!isVoiceMode || !synthRef.current) return;

        // Strip markdown before speaking
        let plainText = text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/`/g, '')
            .trim();

        if (!plainText) return;

        const utterance = new SpeechSynthesisUtterance(plainText);
        // Try to pick a female/pleasant voice if available
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // When TTS finishes reading the final chunk, automatically restart listening if in voice mode
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (isVoiceMode && !synthRef.current.speaking && !isStreaming) {
                // Wait a tiny bit then restart mic
                setTimeout(() => {
                    if (isVoiceMode && !isListening && recognitionRef.current) {
                        try {
                            setInputVal(''); // Clear input for next query
                            recognitionRef.current.start();
                            setIsListening(true);
                        } catch (e) { }
                    }
                }, 500);
            }
        };

        synthRef.current.speak(utterance);
    };

    // Check Ollama health on mount via Backend
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/health`, {
                    signal: AbortSignal.timeout(4000),
                });
                if (res.ok) {
                    setConnStatus('connected');
                } else {
                    setConnStatus('error');
                }
            } catch {
                setConnStatus('error');
            }
        };
        checkHealth();
    }, []);

    // Cleanup abort controller on unmount
    useEffect(() => () => abortRef.current?.abort(), []);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isStreaming) return;

        const userMsg = { role: 'user', text: text.trim(), time: now() };
        const updatedHistory = [...messages, userMsg];

        setMessages(updatedHistory);
        setInputVal('');
        setIsTyping(true);
        setIsStreaming(true);
        setSuggestions([]); // hide suggestions after first interaction

        // Stop listening while generating
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        // Cancel any ongoing TTS before reading the new answer
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        accumulatedTTSChunkRef.current = '';

        // Create new AbortController
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const assistantMsg = { role: 'assistant', text: '', time: now() };

        try {
            setIsTyping(false);
            setMessages(prev => [...prev, assistantMsg]);

            await streamOllamaChat(
                updatedHistory,
                (chunk) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            ...updated[updated.length - 1],
                            text: updated[updated.length - 1].text + chunk,
                        };
                        return updated;
                    });

                    // Route to TTS if Voice Mode active
                    if (isVoiceMode) {
                        accumulatedTTSChunkRef.current += chunk;
                        // Regex matching sentence boundaries: . ! ? followed by space or newline
                        const match = accumulatedTTSChunkRef.current.match(/[^.!?]+[.!?]+(\s|\n|$)/);
                        if (match) {
                            const sentence = match[0];
                            speakSentence(sentence);
                            // Remove the spoken sentence from the accumulated buffer
                            accumulatedTTSChunkRef.current = accumulatedTTSChunkRef.current.substring(match.index + sentence.length);
                        }
                    }
                },
                controller.signal,
            );

            // Flush any remaining text in the buffer after stream completes
            if (isVoiceMode && accumulatedTTSChunkRef.current.trim().length > 0) {
                speakSentence(accumulatedTTSChunkRef.current);
                accumulatedTTSChunkRef.current = '';
            }

        } catch (err) {
            if (err.name === 'AbortError') return;

            console.error('[Ollama Error]', err);
            setIsTyping(false);
            setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                // If the last message is an empty assistant bubble, replace with error
                if (last.role === 'assistant' && last.text === '') {
                    updated[updated.length - 1] = {
                        role: 'assistant',
                        text: "⚠️ I'm having trouble connecting to my AI brain right now. Please make sure Ollama is running (`ollama serve`) and that the llama3 model is installed (`ollama pull llama3`). Try again in a moment!",
                        time: now(),
                        isError: true,
                    };
                }
                return updated;
            });
            setConnStatus('error');
        } finally {
            setIsStreaming(false);
            setIsTyping(false);
            inputRef.current?.focus();

            // Note: If voice mode is active, the TTS utterance.onend will handle restarting the mic 
            // once it finishes reading the final response chunk aloud.
        }
    }, [messages, isStreaming, isVoiceMode, isListening]);

    const handleSend = () => {
        const text = inputVal.trim();
        if (text) sendMessage(text);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = (suggestion) => {
        sendMessage(suggestion.text);
    };

    const handleStop = () => {
        abortRef.current?.abort();
        if (synthRef.current) synthRef.current.cancel();
        setIsStreaming(false);
        setIsTyping(false);
    };

    const handleClearChat = () => {
        abortRef.current?.abort();
        if (synthRef.current) synthRef.current.cancel();
        if (isListening && recognitionRef.current) recognitionRef.current.stop();
        setMessages(INITIAL_MESSAGES);
        setSuggestions(QUICK_SUGGESTIONS);
        setIsStreaming(false);
        setIsTyping(false);
        setIsVoiceMode(false);
        setIsListening(false);
        setIsSpeaking(false);
        setConnStatus(prev => prev); // keep current status
        setInputVal(''); // Clean input field
    };

    // Render message text — preserve newlines as <br> for display
    const renderText = (text) => {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.07);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className="chat-layout">
            <div className="chat-inner">

                {/* Header */}
                <div className="chat-header-card fade-in">
                    <div className="ai-avatar">
                        🤖
                        <div className="ai-status" style={{ background: connStatus === 'connected' ? '#10b981' : connStatus === 'error' ? '#ef4444' : '#f59e0b' }}></div>
                    </div>
                    <div className="ai-info">
                        <h3>Aria — Your Speech Coach</h3>
                        <p>Powered by Llama3 · Local AI · Always private</p>
                    </div>

                    <div style={{ margin: '0 20px 0 auto', display: 'flex' }}>
                        <button
                            className={`mic-record-btn ${isVoiceMode && isListening ? 'recording' : ''}`}
                            onClick={toggleVoiceMode}
                            title="Toggle Voice Mode"
                            style={{
                                width: '45px', height: '45px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                                fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isVoiceMode ? '#ef4444' : 'var(--card-bg)', // match assessment UI
                                color: isVoiceMode ? 'white' : 'var(--text-primary)',
                                boxShadow: isVoiceMode && isListening ? '0 0 0 8px rgba(239, 68, 68, 0.2)' : 'var(--shadow-soft)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isVoiceMode ? '⏹️' : '🎙️'}
                        </button>
                    </div>
                    {/* Only show clear chat when not in voice mode */}
                    {!isVoiceMode && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{
                                padding: '7px 14px', borderRadius: '50px',
                                background: connStatus === 'connected' ? 'var(--mint)' : connStatus === 'error' ? '#FEE2E2' : '#FEF9C3',
                                fontSize: '0.75rem', fontWeight: 700,
                                color: connStatus === 'connected' ? 'var(--teal-deep)' : connStatus === 'error' ? '#991B1B' : '#92400E',
                            }}>
                                {connStatus === 'connected' ? '● Llama3 Ready' : connStatus === 'error' ? '● Offline' : '● Connecting…'}
                            </div>
                            <button
                                onClick={handleClearChat}
                                title="Clear chat"
                                style={{
                                    background: 'var(--sky-mid)', border: 'none', borderRadius: '50%',
                                    width: '34px', height: '34px', cursor: 'pointer',
                                    fontSize: '0.85rem', color: 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                🗑️
                            </button>
                        </div>
                    )}
                </div>

                {!isVoiceMode && (
                    <>
                        {/* Status Banner */}
                        <StatusBanner status={connStatus} />

                        {/* Messages */}
                        <div className="chat-messages fade-in-2" ref={messagesRef}>
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`msg ${msg.role === 'assistant' ? 'ai' : 'user'}`}
                                    style={i > 0 ? { animation: 'fadeUp 0.3s ease both' } : {}}
                                >
                                    <div className={`msg-avatar ${msg.role === 'assistant' ? 'msg-av-ai' : 'msg-av-user'}`}>
                                        {msg.role === 'assistant' ? '🤖' : 'A'}
                                    </div>
                                    <div style={{ maxWidth: '100%' }}>
                                        <div
                                            className={`msg-bubble${msg.isError ? ' msg-error' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                                        />
                                        {/* Streaming cursor */}
                                        {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                                            <span className="streaming-cursor">▍</span>
                                        )}
                                        <div className="msg-time">{msg.time}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && <TypingIndicator />}
                        </div>

                        {/* Quick Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="suggestion-chips" style={{ flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        className="suggestion-chip"
                                        onClick={() => handleSuggestion(s)}
                                        disabled={isStreaming}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Row */}
                        <div className="chat-input-row">
                            <input
                                ref={inputRef}
                                className="chat-input"
                                type="text"
                                placeholder={isStreaming ? 'Aria is thinking…' : 'Ask Aria anything about your speech journey…'}
                                value={inputVal}
                                onChange={e => setInputVal(e.target.value)}
                                onKeyDown={handleKey}
                                disabled={isStreaming}
                                autoComplete="off"
                            />

                            {isStreaming ? (
                                <button
                                    className="chat-send-btn"
                                    onClick={handleStop}
                                    title="Stop generating"
                                    style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}
                                >
                                    ⏹
                                </button>
                            ) : (
                                <button
                                    className="chat-send-btn"
                                    onClick={handleSend}
                                    title="Send message"
                                    disabled={!inputVal.trim()}
                                    style={{ opacity: inputVal.trim() ? 1 : 0.5 }}
                                >
                                    ➤
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* ─── Voice Mode Overlay ─── */}
                <AnimatePresence>
                    {isVoiceMode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{
                                flex: 1, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                padding: '40px 20px', gap: '40px'
                            }}
                        >
                            <motion.div
                                animate={
                                    isListening ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.4)', '0 0 0 20px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)'] }
                                        : isSpeaking ? { scale: [1, 1.05, 1], boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.4)', '0 0 0 15px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)'] }
                                            : { scale: 1 }
                                }
                                transition={{ repeat: Infinity, duration: isListening ? 1.5 : 2 }}
                                style={{
                                    width: '120px', height: '120px', borderRadius: '50%',
                                    background: isSpeaking ? 'var(--mint)' : isListening ? '#ef4444' : 'var(--card-bg)',
                                    color: isSpeaking ? 'var(--teal-deep)' : isListening ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem', cursor: 'pointer',
                                    border: isListening || isSpeaking ? 'none' : '2px solid var(--border-color)'
                                }}
                                onClick={toggleVoiceMode}
                            >
                                {isSpeaking ? '🤖' : '🎙️'}
                            </motion.div>

                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                    {isSpeaking ? 'Aria is speaking...'
                                        : isListening ? 'Listening...'
                                            : isStreaming ? 'Aria is thinking...'
                                                : 'Voice Mode Active'}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
                                    {inputVal && isListening ? `"${inputVal}"` : 'Conversation is private. Text hidden for focus.'}
                                </p>
                            </div>

                            {/* Stop active generation if needed */}
                            {isStreaming && !isSpeaking && (
                                <button className="btn-ghost" style={{ color: '#ef4444' }} onClick={handleStop}>Stop Generating</button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Model info footer */}
                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    🔒 All conversations processed locally on your device · Powered by Llama3 via Ollama
                </div>
            </div>
        </div>
    );
}

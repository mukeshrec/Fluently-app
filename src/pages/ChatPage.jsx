import { useState, useRef, useEffect } from 'react';

const AI_RESPONSES = [
    "That's a great question! Based on your recent practice data, I'd suggest focusing on slow, deliberate speech for the next few sessions. Remember: slower is smoother! 🐢✨",
    "You're making incredible progress, Alex. Your fluency score has increased by 23 points since you started. Keep celebrating those small wins! 🌟",
    "I recommend starting with the Gentle Onset technique today. It's perfect for building confidence on challenging sounds. Want me to guide you through it?",
    "Reducing anxiety before speaking is all about preparation and breathing. Your 14-day streak shows you have the commitment — now let's refine the technique. 💪",
    "Let's review your week! Your best session was Friday — you scored 91 on clarity. What felt different that day? Understanding that can help us replicate it.",
];

const INITIAL_MESSAGES = [
    { type: 'ai', text: "Hi Alex! 👋 Great to see you today. I noticed you've been on a 14-day streak — that's absolutely wonderful. How are you feeling about your speech practice lately?", time: '10:32 AM' },
    { type: 'user', text: "I feel like I've been improving, but I still struggle with certain sounds when I'm nervous.", time: '10:33 AM' },
    { type: 'ai', text: "That's completely normal, and you're not alone! Nervousness activates your body's stress response, which can temporarily affect speech fluency. The good news? Your data shows consistent improvement. 📈<br/><br/>Let's try a grounding exercise today — it's specifically designed for pre-speech anxiety. Would you like to start with a breathing technique?", time: '10:33 AM' },
    { type: 'user', text: "Yes, that sounds great! I'd love that.", time: '10:34 AM' },
    { type: 'ai', text: "Perfect! Here's a simple technique called <strong>Diaphragmatic Breathing</strong>:<br/><br/>1. Place one hand on your chest, one on your belly<br/>2. Breathe in slowly through your nose for 4 counts<br/>3. Hold for 2 counts<br/>4. Exhale through your mouth for 6 counts<br/><br/>Do this 3 times before speaking. Your nervous system will thank you! 🧘‍♀️", time: '10:35 AM' },
];

const INITIAL_SUGGESTIONS = [
    'Tell me about today\'s exercises',
    'How can I reduce anxiety?',
    'Review my progress',
    'Start a practice session',
];

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function ChatPage() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
    const [inputVal, setInputVal] = useState('');
    const aiIdx = useRef(0);
    const messagesRef = useRef(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const sendUserMessage = (text) => {
        setMessages(prev => [...prev, { type: 'user', text: escHtml(text), time: now() }]);
        setTimeout(() => {
            const resp = AI_RESPONSES[aiIdx.current % AI_RESPONSES.length];
            aiIdx.current++;
            setMessages(prev => [...prev, { type: 'ai', text: resp, time: now() }]);
        }, 900);
    };

    const handleSuggestion = (text, idx) => {
        sendUserMessage(text);
        setSuggestions(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSend = () => {
        const text = inputVal.trim();
        if (!text) return;
        sendUserMessage(text);
        setInputVal('');
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chat-layout">
            <div className="chat-inner">
                <div className="chat-header-card fade-in">
                    <div className="ai-avatar">
                        🤖
                        <div className="ai-status"></div>
                    </div>
                    <div className="ai-info">
                        <h3>Aria — Your Speech Coach</h3>
                        <p>AI-powered · Always encouraging · Personalized to you</p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <div style={{ padding: '7px 14px', borderRadius: '50px', background: 'var(--mint)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--teal-deep)' }}>
                            ● Online
                        </div>
                    </div>
                </div>

                <div className="chat-messages fade-in-2" ref={messagesRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`msg ${msg.type}`} style={i >= INITIAL_MESSAGES.length ? { animation: 'fadeUp 0.3s ease both' } : {}}>
                            <div className={`msg-avatar ${msg.type === 'ai' ? 'msg-av-ai' : 'msg-av-user'}`}>
                                {msg.type === 'ai' ? '🤖' : 'A'}
                            </div>
                            <div>
                                <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                                <div className="msg-time">{msg.time}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="suggestion-chips">
                    {suggestions.map((s, i) => (
                        <button key={i} className="suggestion-chip" onClick={() => handleSuggestion(s, i)}>{s}</button>
                    ))}
                </div>

                <div className="chat-input-row">
                    <input
                        className="chat-input"
                        type="text"
                        placeholder="Ask Aria anything about your speech journey…"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        onKeyPress={handleKey}
                    />
                    <button className="chat-mic-btn" title="Voice input">🎙️</button>
                    <button className="chat-send-btn" onClick={handleSend} title="Send message">➤</button>
                </div>
            </div>
        </div>
    );
}

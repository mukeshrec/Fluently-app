import { useState } from 'react';
import WaveBar from '../components/WaveBar';

export default function PracticePage() {
    const [isRecording, setIsRecording] = useState(false);

    const toggleMic = () => setIsRecording(prev => !prev);

    const waveData = [
        { d: '0.7s', h: '16px' }, { d: '0.9s', h: '40px' }, { d: '0.8s', h: '28px' },
        { d: '1.1s', h: '52px' }, { d: '0.75s', h: '36px' }, { d: '1.0s', h: '20px' },
        { d: '0.85s', h: '44px' }, { d: '1.2s', h: '32px' }, { d: '0.7s', h: '56px' },
        { d: '0.95s', h: '24px' }, { d: '1.1s', h: '48px' }, { d: '0.8s', h: '18px' },
        { d: '1.0s', h: '38px' }, { d: '0.9s', h: '60px' }, { d: '0.75s', h: '28px' },
        { d: '1.15s', h: '42px' },
    ];

    return (
        <div className="practice-layout">
            <div className="practice-inner">
                <div className="mic-center fade-in">
                    <div className="practice-heading">Reading Exercise</div>
                    <div className="practice-sub">Read the passage aloud at a comfortable pace. Press the mic when ready.</div>
                    <div className="script-box">
                        "The <span className="highlight">soft morning light</span> filtered through the trees, casting gentle patterns
                        on the ground. <span className="highlight">She breathed slowly</span>, feeling calm and confident. Today was
                        going to be a good day."
                    </div>
                    <div className="mic-button-wrap">
                        <div className="mic-ring-outer"></div>
                        <div className="mic-ring-outer-2"></div>
                        <button
                            className={`mic-button${isRecording ? ' recording' : ''}`}
                            onClick={toggleMic}
                            aria-label="Start/Stop recording"
                        >
                            {isRecording ? '⏹️' : '🎙️'}
                        </button>
                    </div>
                    <div className="mic-hint" style={isRecording ? { color: 'var(--teal)' } : {}}>
                        {isRecording ? 'Recording… tap to stop' : 'Tap to start speaking'}
                    </div>
                    <div className="waveform-large">
                        {waveData.map((w, i) => (
                            <WaveBar key={i} duration={w.d} height={w.h} large />
                        ))}
                    </div>
                </div>
                <div className="ai-panel fade-in-2">
                    {/* Score Card */}
                    <div className="score-card">
                        <div className="score-title">🤖 AI Analysis</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                <svg width="80" height="80" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="var(--sky-mid)" strokeWidth="8" />
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                                        strokeDasharray="201" strokeDashoffset="50" strokeLinecap="round"
                                        transform="rotate(-90 40 40)" />
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#2cb5a0" />
                                            <stop offset="100%" stopColor="#4a90d9" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>87</span>
                                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>SCORE</span>
                                </div>
                            </div>
                        </div>
                        {[
                            { label: 'Fluency', fill: 'fill-teal', w: '87%', val: '87%' },
                            { label: 'Pace', fill: 'fill-purple', w: '74%', val: '74%' },
                            { label: 'Clarity', fill: 'fill-yellow', w: '91%', val: '91%' },
                        ].map((s, i) => (
                            <div className="score-row" key={i}>
                                <div className="score-label-sm">{s.label}</div>
                                <div className="score-bar-bg">
                                    <div className={`score-bar-fill ${s.fill}`} style={{ width: s.w }}></div>
                                </div>
                                <div className="score-val">{s.val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tips Card */}
                    <div className="score-card">
                        <div className="score-title">💡 Pronunciation Tips</div>
                        <ul className="tips-list">
                            <li className="tip-item">
                                <div className="tip-dot"></div>Pause briefly before words starting with consonant clusters
                            </li>
                            <li className="tip-item">
                                <div className="tip-dot" style={{ background: 'var(--purple-soft)' }}></div>Your "s" sounds are clear — great improvement this week!
                            </li>
                            <li className="tip-item">
                                <div className="tip-dot" style={{ background: '#f59e0b' }}></div>Try the "light laryngeal contact" technique on harder words
                            </li>
                        </ul>
                    </div>

                    {/* Suggested Exercises */}
                    <div className="score-card">
                        <div className="score-title">🎯 Suggested Next</div>
                        <div className="exercise-chips-wrap">
                            {['Gentle Onset', 'Diaphragm Breathing', 'Slow Speech', 'Cancellation'].map(e => (
                                <div className="exercise-chip" key={e}>{e}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

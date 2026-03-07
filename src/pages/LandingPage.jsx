import WaveBar from '../components/WaveBar';

export default function LandingPage({ onNavigate }) {
    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <div className="hero-badge-dot"></div>
                            AI-Powered Speech Therapy
                        </div>
                        <h1>Speak With<br /><em>Confidence.</em></h1>
                        <p>
                            Fluently uses advanced AI to give you real-time feedback, personalized exercises, and the encouragement you
                            need to find your voice — at your own pace.
                        </p>
                        <div className="hero-cta">
                            <button className="btn-hero-primary" onClick={() => onNavigate('practice')}>
                                🎙️ Start Practice
                            </button>
                            <button className="btn-hero-secondary" onClick={() => onNavigate('dashboard')}>
                                ✨ Try Demo
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-num">94%</span>
                                <span className="stat-label">Report improvement</span>
                            </div>
                            <div className="stat">
                                <span className="stat-num">50K+</span>
                                <span className="stat-label">Active users</span>
                            </div>
                            <div className="stat">
                                <span className="stat-num">4.9★</span>
                                <span className="stat-label">App rating</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-card-main">
                            <div className="hero-avatar-wrap">
                                🎙️
                                <div className="mic-ring"></div>
                                <div className="mic-ring-2"></div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                Live AI Session
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Reading Exercise • Level 3
                            </div>
                            <div className="waveform-mini">
                                {[
                                    { d: '0.8s', h: '12px' }, { d: '1.1s', h: '28px' }, { d: '0.7s', h: '36px' },
                                    { d: '1.3s', h: '24px' }, { d: '0.9s', h: '40px' }, { d: '1.0s', h: '20px' },
                                    { d: '0.75s', h: '32px' }, { d: '1.2s', h: '16px' }, { d: '0.85s', h: '38px' },
                                    { d: '1.1s', h: '22px' }, { d: '0.95s', h: '30px' }, { d: '0.8s', h: '14px' },
                                ].map((w, i) => (
                                    <WaveBar key={i} duration={w.d} height={w.h} />
                                ))}
                            </div>
                            <div className="feedback-chip">✅ Great rhythm! Keep going</div>
                            <div className="feedback-chip" style={{ marginTop: '8px', background: 'var(--lavender)', color: 'var(--purple-deep)' }}>
                                💡 Slow down slightly on 's' sounds
                            </div>
                            <div className="score-badge">
                                <span>87</span>
                                Fluency
                            </div>
                            <div className="floating-pill">🔥 14-day streak</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: 0 }}>
                        <div className="section-label">What Fluently offers</div>
                        <h2 className="section-title">Your personal <em>speech coach,</em><br />always with you</h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            Four powerful tools that work together to help you build confidence and fluency at your own pace.
                        </p>
                    </div>
                    <div className="features-grid">
                        {[
                            { icon: '🤖', cls: 'icon-teal', title: 'AI Speech Coach', desc: 'Your personalized AI coach learns your speech patterns and adapts exercises to your specific needs and challenges.' },
                            { icon: '📊', cls: 'icon-blue', title: 'Real-time Feedback', desc: 'Instant pronunciation and fluency analysis as you speak, with gentle, actionable suggestions in the moment.' },
                            { icon: '🌱', cls: 'icon-mint', title: 'Daily Exercises', desc: 'Short, structured daily practice sessions designed by speech-language pathologists and optimized by AI.' },
                            { icon: '📈', cls: 'icon-lavender', title: 'Progress Tracking', desc: "Visual charts and milestone badges show how far you've come, celebrating every improvement along the way." },
                        ].map((f, i) => (
                            <div className="feature-card animate-on-scroll" key={i}>
                                <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
                                <div className="feature-title">{f.title}</div>
                                <div className="feature-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-bg">
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                        <div className="section-label">Success Stories</div>
                        <h2 className="section-title">Real voices, <em>real change</em></h2>
                    </div>
                    <div className="testi-grid">
                        {[
                            { text: '"After 3 months with Fluently, I gave my first presentation at work without fear. The daily exercises and AI feedback made all the difference."', name: 'James Thornton', role: 'Software Engineer, 28', av: 'av-a', letter: 'J' },
                            { text: '"The AI coach never makes me feel judged. It\'s patient, encouraging, and celebrates every small win. My fluency score went from 42 to 79 in 8 weeks."', name: 'Maya Patel', role: 'College Student, 22', av: 'av-b', letter: 'M' },
                            { text: '"I tried many apps before Fluently. None felt so calm and supportive. The waveform feedback helped me understand my own speech in a completely new way."', name: 'Ryan Okafor', role: 'Teacher, 35', av: 'av-c', letter: 'R' },
                        ].map((t, i) => (
                            <div className="testi-card animate-on-scroll" key={i}>
                                <div className="testi-stars">★★★★★</div>
                                <div className="testi-text">{t.text}</div>
                                <div className="testi-author">
                                    <div className={`testi-avatar ${t.av}`}>{t.letter}</div>
                                    <div>
                                        <div className="testi-name">{t.name}</div>
                                        <div className="testi-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="cta-banner animate-on-scroll">
                    <h2>Ready to find your voice?</h2>
                    <p>Join 50,000+ people who've transformed their speech with Fluently. Free to start, no credit card needed.</p>
                    <div className="cta-btns">
                        <button className="btn-white" onClick={() => onNavigate('practice')}>🎙️ Start Practice Free</button>
                        <button className="btn-outline-white" onClick={() => onNavigate('chat')}>💬 Chat with AI Coach</button>
                    </div>
                </div>
            </section>
        </>
    );
}

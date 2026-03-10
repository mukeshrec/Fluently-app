export default function DashboardPage({ userProfile, onNavigate }) {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-section">
                    <div className="sidebar-label">Main</div>
                    <button className="sidebar-item active" onClick={() => onNavigate('dashboard')}>
                        <span className="sidebar-icon">🏠</span> Dashboard
                    </button>
                    <button className="sidebar-item" onClick={() => onNavigate('analytics')}>
                        <span className="sidebar-icon">📈</span> Progress
                    </button>
                    <button className="sidebar-item" onClick={() => onNavigate('chat')}>
                        <span className="sidebar-icon">🤖</span> AI Coach
                    </button>
                </div>
                <div className="streak-card">
                    <div className="streak-fire">🔥</div>
                    <span className="streak-num">1</span>
                    <span className="streak-label">Day Streak</span>
                </div>
            </aside>
            <main className="main-content">
                <div className="welcome-banner fade-in">
                    <div className="welcome-text">
                        <h2>Good morning, Alex 👋</h2>
                        <p>
                            {userProfile
                                ? "Your personalized stuttering therapy plan is ready."
                                : "You're on a great streak! Today's session is ready for you."}
                        </p>
                    </div>
                    <div className="daily-goal-card">
                        <div className="goal-label">Today's Goal</div>
                        <div className="goal-num">15<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>min</span></div>
                        <div className="goal-sub">0 min completed</div>
                    </div>
                </div>

                {userProfile && userProfile.assigned_tasks ? (
                    <div className="gamified-path fade-in-2">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}>Your Learning Path</h3>
                            <div style={{ background: 'var(--purple-soft)', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                                AI Generated
                            </div>
                        </div>

                        <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', marginBottom: '40px', boxShadow: 'var(--shadow-soft)' }}>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                "{userProfile.diagnosis}"
                            </p>
                        </div>

                        <div className="path-container" style={{ position: 'relative', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px' }}>
                            <div className="path-line" style={{ position: 'absolute', top: '40px', bottom: '100px', left: '50%', transform: 'translateX(-50%)', width: '8px', background: 'var(--card-border)', borderRadius: '4px', zIndex: 0 }}></div>

                            {userProfile.assigned_tasks.map((task, idx) => {
                                const isUnlocked = idx === 0; // First is unlocked
                                const offset = idx % 2 === 0 ? '-80px' : '80px'; // zig-zag
                                return (
                                    <div key={idx} className={`path-node ${isUnlocked ? 'unlocked' : 'locked'}`} style={{ position: 'relative', zIndex: 1, transform: `translateX(${offset})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <button
                                            className="node-circle"
                                            onClick={() => { if (isUnlocked) onNavigate('chat'); }}
                                            style={{
                                                width: '85px', height: '85px', borderRadius: '50%', border: 'none',
                                                background: isUnlocked ? 'var(--teal)' : '#e2e8f0',
                                                color: 'white', fontSize: '2rem', cursor: isUnlocked ? 'pointer' : 'default',
                                                boxShadow: isUnlocked ? '0 8px 0 var(--teal-deep), 0 15px 25px rgba(44,181,160,0.3)' : '0 8px 0 #cbd5e1',
                                                transition: 'transform 0.1s, box-shadow 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            onMouseDown={e => { if (isUnlocked) { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0 2px 0 var(--teal-deep), 0 5px 10px rgba(44,181,160,0.3)'; } }}
                                            onMouseUp={e => { if (isUnlocked) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 0 var(--teal-deep), 0 15px 25px rgba(44,181,160,0.3)'; } }}
                                            onMouseLeave={e => { if (isUnlocked) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 0 var(--teal-deep), 0 15px 25px rgba(44,181,160,0.3)'; } }}
                                        >
                                            {isUnlocked ? '⭐' : '🔒'}
                                        </button>
                                        <div style={{
                                            marginTop: '20px', fontWeight: 700, fontSize: '1.1rem',
                                            color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                                            background: 'var(--card-bg)', padding: '8px 16px', borderRadius: '50px',
                                            border: `2px solid ${isUnlocked ? 'var(--teal)' : 'transparent'}`,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }}>
                                            {task}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="path-node locked" style={{ position: 'relative', zIndex: 1, marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <button className="node-circle" style={{
                                    width: '70px', height: '70px', borderRadius: '50%', border: 'none',
                                    background: 'linear-gradient(135deg, var(--purple-soft), var(--purple-deep))',
                                    color: 'white', fontSize: '1.5rem', cursor: 'default',
                                    boxShadow: '0 8px 0 #5b4a9b, 0 15px 20px rgba(108,87,184,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    🏆
                                </button>
                                <div style={{ marginTop: '16px', fontWeight: 800, color: 'var(--purple-deep)' }}>
                                    Unit 1 Reward
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <>
                        {/* Progress */}
                        <div className="card fade-in-2" style={{ marginBottom: '20px' }}>
                            <div className="progress-label">
                                <span>Today's Practice Progress</span>
                                <span style={{ color: 'var(--teal)', fontWeight: 700 }}>53%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '53%' }}></div>
                            </div>
                            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                    ✅ Warm-up <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Done</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                    🔄 Reading Practice <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>In progress</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                    ⏳ Conversation Drill <span style={{ color: 'var(--text-muted)' }}>Upcoming</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions fade-in-3">
                            <div className="quick-btn" onClick={() => onNavigate('chat')}>
                                <div className="quick-btn-icon">🎙️</div>
                                <div className="quick-btn-label">Start Practice</div>
                            </div>
                            <div className="quick-btn" onClick={() => onNavigate('analytics')}>
                                <div className="quick-btn-icon">📊</div>
                                <div className="quick-btn-label">View Progress</div>
                            </div>
                            <div className="quick-btn">
                                <div className="quick-btn-icon">🧩</div>
                                <div className="quick-btn-label">Exercises</div>
                            </div>
                            <div className="quick-btn" onClick={() => onNavigate('chat')}>
                                <div className="quick-btn-icon">🤖</div>
                                <div className="quick-btn-label">AI Chat Coach</div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid-2 fade-in-3">
                            <div className="card">
                                <div className="card-title">📈 Weekly Improvement</div>
                                <div className="mini-chart">
                                    {[35, 45, 40, 65, 60, 80, 90].map((h, i) => (
                                        <div key={i} className={`chart-bar${i === 6 ? ' active' : ''}`} style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                        <span key={d} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d}</span>
                                    ))}
                                    <span style={{ fontSize: '0.7rem', color: 'var(--teal)', fontWeight: 700 }}>Sun</span>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <span className="card-value">+12%</span>
                                    <span className="card-delta" style={{ marginLeft: '8px' }}>↑ vs last week</span>
                                </div>
                            </div>
                            <div className="ai-summary-card">
                                <div className="ai-tag">🤖 AI Feedback Summary</div>
                                <div className="ai-summary-text">
                                    Great session yesterday! Your pacing has improved significantly — you're maintaining a calm, steady rhythm.
                                    Focus today on soft consonant transitions like <em>"s"</em> and <em>"th"</em> sounds.
                                </div>
                                <div className="ai-chips">
                                    <span className="ai-chip chip-good">✅ Rhythm: Excellent</span>
                                    <span className="ai-chip chip-good">✅ Volume: Good</span>
                                    <span className="ai-chip chip-improve">💡 Consonants: Practice</span>
                                </div>
                            </div>
                        </div>

                        {/* More metrics */}
                        <div className="grid-3 fade-in-3">
                            <div className="card">
                                <div className="card-title">🎯 Fluency Score</div>
                                <div className="card-value">87</div>
                                <div className="card-delta">↑ +4 this week</div>
                            </div>
                            <div className="card">
                                <div className="card-title">⏱️ Avg. Speaking Pace</div>
                                <div className="card-value">128</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>words/min</div>
                                <div className="card-delta">Within ideal range</div>
                            </div>
                            <div className="card">
                                <div className="card-title">🏆 Sessions This Month</div>
                                <div className="card-value">22</div>
                                <div className="card-delta">↑ Best month yet!</div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

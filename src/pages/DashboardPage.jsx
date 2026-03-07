export default function DashboardPage({ onNavigate }) {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-section">
                    <div className="sidebar-label">Main</div>
                    <button className="sidebar-item active" onClick={() => onNavigate('dashboard')}>
                        <span className="sidebar-icon">🏠</span> Dashboard
                    </button>
                    <button className="sidebar-item" onClick={() => onNavigate('practice')}>
                        <span className="sidebar-icon">🎙️</span> Practice
                    </button>
                    <button className="sidebar-item" onClick={() => onNavigate('analytics')}>
                        <span className="sidebar-icon">📈</span> Progress
                    </button>
                    <button className="sidebar-item" onClick={() => onNavigate('chat')}>
                        <span className="sidebar-icon">🤖</span> AI Coach
                    </button>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-label">Library</div>
                    <button className="sidebar-item"><span className="sidebar-icon">📚</span> Exercises</button>
                    <button className="sidebar-item"><span className="sidebar-icon">🎯</span> Goals</button>
                    <button className="sidebar-item"><span className="sidebar-icon">🏆</span> Achievements</button>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-label">Account</div>
                    <button className="sidebar-item"><span className="sidebar-icon">⚙️</span> Settings</button>
                </div>
                <div className="streak-card">
                    <div className="streak-fire">🔥</div>
                    <span className="streak-num">14</span>
                    <span className="streak-label">Day Streak</span>
                </div>
            </aside>
            <main className="main-content">
                <div className="welcome-banner fade-in">
                    <div className="welcome-text">
                        <h2>Good morning, Alex 👋</h2>
                        <p>You're on a great streak! Today's session is ready for you.</p>
                    </div>
                    <div className="daily-goal-card">
                        <div className="goal-label">Today's Goal</div>
                        <div className="goal-num">15<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>min</span></div>
                        <div className="goal-sub">8 min completed</div>
                    </div>
                </div>

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
                    <div className="quick-btn" onClick={() => onNavigate('practice')}>
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
                <div className="grid-2">
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
                <div className="grid-3">
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
            </main>
        </div>
    );
}

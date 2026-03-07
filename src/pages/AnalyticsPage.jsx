import { useState } from 'react';

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState('7 days');

    const metrics = [
        { icon: '🎯', val: '87', label: 'Fluency Score', trend: '↑ +23 from start' },
        { icon: '⏱️', val: '128', label: 'WPM Average', trend: '↑ Ideal range!' },
        { icon: '🔥', val: '14', label: 'Day Streak', trend: '↑ Personal best' },
        { icon: '⏳', val: '6.2', label: 'Hours Practiced', trend: '↑ +1.4h this week' },
    ];

    const fluencyData = [52, 61, 58, 74, 70, 84, 91];
    const speedData = [60, 55, 70, 78, 72, 85, 82];
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const badges = [
        { icon: '🔥', name: 'Hot Streak', desc: '14-day practice streak' },
        { icon: '🌟', name: 'Rising Star', desc: 'Score 80+ fluency' },
        { icon: '🎙️', name: 'Voice of the Week', desc: '7 sessions in a row' },
        { icon: '🧘', name: 'Calm Speaker', desc: 'Ideal pace for 5 days' },
        { icon: '👑', name: 'Fluency Master', desc: 'Score 95+ fluency', locked: true },
        { icon: '🌈', name: '30-Day Legend', desc: '30-day streak', locked: true },
    ];

    return (
        <div className="analytics-page">
            <div className="analytics-inner">
                <div className="analytics-header fade-in">
                    <div className="section-label">Your Journey</div>
                    <h1 className="section-title">Progress <em>Analytics</em></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Tracking your improvement over the past 30 days. You're doing amazing!
                    </p>
                </div>

                <div className="analytics-grid fade-in-2">
                    {metrics.map((m, i) => (
                        <div className="metric-card" key={i}>
                            <div className="metric-icon">{m.icon}</div>
                            <div className="metric-val">{m.val}</div>
                            <div className="metric-label">{m.label}</div>
                            <div className="metric-trend">{m.trend}</div>
                        </div>
                    ))}
                </div>

                {/* Fluency Chart */}
                <div className="big-chart-card fade-in-3">
                    <div className="chart-header">
                        <div className="chart-title">Fluency Score History</div>
                        <div className="chart-tabs">
                            {['7 days', '30 days', 'All time'].map(tab => (
                                <button
                                    key={tab}
                                    className={`chart-tab${activeTab === tab ? ' active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bar-chart">
                        {fluencyData.map((h, i) => (
                            <div className="bar-wrap" key={i}>
                                <div className="bar-col" style={{ height: `${h}%`, opacity: i === 6 ? 1 : undefined }}></div>
                                <div className="bar-label" style={i === 6 ? { color: 'var(--teal)', fontWeight: 700 } : {}}>
                                    {days[i]}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'linear-gradient(var(--teal),var(--blue))' }}></div>
                            Fluency Score
                        </div>
                    </div>
                </div>

                {/* Speaking Speed */}
                <div className="big-chart-card">
                    <div className="chart-header">
                        <div className="chart-title">Speaking Speed (WPM)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target range: 110–140 WPM</div>
                    </div>
                    <div className="bar-chart">
                        {speedData.map((h, i) => (
                            <div className="bar-wrap" key={i}>
                                <div className="bar-col secondary" style={{ height: `${h}%` }}></div>
                                <div className="bar-label">{days[i]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div style={{ marginTop: '28px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
                        🏆 Achievements & Badges
                    </h3>
                    <div className="achievements-grid">
                        {badges.map((b, i) => (
                            <div className={`badge-card${b.locked ? ' locked' : ''}`} key={i}>
                                <div className="badge-icon">{b.icon}</div>
                                <div className="badge-name">{b.name}</div>
                                <div className="badge-desc">{b.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

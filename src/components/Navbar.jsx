export default function Navbar({ activePage, onNavigate, isDark, onToggleDark }) {
    const pages = ['landing', 'dashboard', 'practice', 'analytics', 'chat'];
    const labels = ['Home', 'Dashboard', 'Practice', 'Progress', 'AI Coach'];

    return (
        <nav>
            <div className="nav-inner">
                <div className="logo">Flu<span>ently</span></div>
                <div className="nav-links">
                    {pages.map((page, i) => (
                        <button
                            key={page}
                            className={`nav-link${activePage === page ? ' active' : ''}`}
                            onClick={() => onNavigate(page)}
                        >
                            {labels[i]}
                        </button>
                    ))}
                </div>
                <div className="nav-actions">
                    <button
                        className="dark-toggle"
                        onClick={onToggleDark}
                        title="Toggle dark mode"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? '🌙' : '☀️'}
                    </button>
                    <button className="btn-ghost" onClick={() => onNavigate('dashboard')}>Sign In</button>
                    <button className="btn-primary" onClick={() => onNavigate('practice')}>Start Practice</button>
                </div>
            </div>
        </nav>
    );
}

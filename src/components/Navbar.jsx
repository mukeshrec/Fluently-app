export default function Navbar({ activePage, onNavigate, isDark, onToggleDark, isLoggedIn, onLogout }) {
    const pages = isLoggedIn ? ['dashboard', 'analytics', 'chat'] : ['landing'];
    const labels = isLoggedIn ? ['Dashboard', 'Progress', 'AI Coach'] : ['Home'];

    return (
        <nav>
            <div className="nav-inner">
                <div className="logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}>
                    Flu<span>ently</span>
                </div>
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
                    {!isLoggedIn ? (
                        <>
                            <button className="btn-ghost" onClick={() => onNavigate('login')}>Sign In</button>
                            <button className="btn-primary" onClick={() => onNavigate('login')}>Get Started</button>
                        </>
                    ) : (
                        <button className="btn-ghost" onClick={onLogout}>Sign Out</button>
                    )}
                </div>
            </div>
        </nav>
    );
}

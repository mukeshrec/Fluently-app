export default function LoginPage({ onLogin, onBack }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off-white)' }}>
            <div className="fade-in" style={{ width: '100%', maxWidth: '400px', background: 'var(--card-bg)', padding: '40px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--card-border)', position: 'relative' }}>
                <button
                    onClick={onBack}
                    style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: 'none', fontSize: '1.2rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                    &larr;
                </button>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="logo" style={{ justifyContent: 'center', marginBottom: '8px' }}>Fluent<em>ly</em></div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome back. Let's practice.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
                        <input type="email" placeholder="alex@example.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                        <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }} />
                    </div>
                </div>

                <button className="btn-primary" style={{ width: '100%' }} onClick={onLogin}>
                    Sign In / Sign Up
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
}

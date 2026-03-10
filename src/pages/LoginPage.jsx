import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginPage({ onLogin, onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                });
                if (error) throw error;
                // If email confirmation is disabled in Supabase Settings, signUp logs in automatically.
                if (data.session) {
                    onLogin(data.session.user);
                } else {
                    // Fallback just in case confirmation is still required in the dashboard
                    setErrorMsg("Signup successful. (Check your email only if Supabase still requires confirmation).");
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                if (data.session) {
                    onLogin(data.session.user);
                }
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {isSignUp ? "Create an account to track your progress." : "Welcome back. Let's practice."}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            required
                            placeholder="alex@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}
                        />
                    </div>

                    {errorMsg && (
                        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', textAlign: 'center' }}>
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '8px', opacity: isLoading ? 0.7 : 1 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--mint)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                        >
                            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
}

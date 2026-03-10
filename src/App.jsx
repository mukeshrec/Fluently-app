import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatPage from './pages/ChatPage';
import AssessmentPage from './pages/AssessmentPage';
import LoginPage from './pages/LoginPage';

export default function App() {
    const [session, setSession] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // We still use localStorage as a cache for the profile to avoid flickering, 
    // but the source of truth for auth is the Supabase session
    const [onboardingComplete, setOnboardingComplete] = useState(() => localStorage.getItem('fluently_onboarding') === 'true');
    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('fluently_profile');
        return saved ? JSON.parse(saved) : null;
    });

    const [activePage, setActivePage] = useState('landing');
    const [isDark, setIsDark] = useState(false);

    // Watch for Supabase Auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoggedIn(!!session);
            if (session) {
                setActivePage(onboardingComplete ? 'dashboard' : 'assessment');
            } else {
                setActivePage('landing');
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoggedIn(!!session);
            if (!session) {
                // Keep local storage cleared on sign out
                localStorage.removeItem('fluently_onboarding');
                localStorage.removeItem('fluently_profile');
                setOnboardingComplete(false);
                setUserProfile(null);
                setActivePage('landing');
            }
        });

        return () => subscription.unsubscribe();
    }, [onboardingComplete]);

    // Apply dark class to body
    useEffect(() => {
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    // Scroll animation observer
    const observeAnimations = useCallback(() => {
        const els = document.querySelectorAll('.animate-on-scroll');
        if (!('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('visible'));
            return;
        }
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: 0.12 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const cleanup = observeAnimations();
        return cleanup;
    }, [activePage, observeAnimations]);

    // Progress bar animation
    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll('.progress-bar-fill').forEach(bar => {
                const w = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => { bar.style.width = w; }, 100);
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [activePage]);

    const handleNavigate = (page) => {
        setActivePage(page);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardPage userProfile={userProfile} onNavigate={handleNavigate} />;
            case 'analytics':
                return <AnalyticsPage />;
            case 'chat':
                return <ChatPage />;
            case 'assessment':
                return (
                    <AssessmentPage
                        onComplete={async (profile) => {
                            // 1. Cache locally for instant UI update
                            localStorage.setItem('fluently_profile', JSON.stringify(profile));
                            localStorage.setItem('fluently_onboarding', 'true');
                            setUserProfile(profile);
                            setOnboardingComplete(true);
                            setActivePage("dashboard");
                            window.scrollTo(0, 0);

                            // 2. Persist to DB via backend if logged in
                            if (session?.user?.id) {
                                try {
                                    await fetch('http://localhost:3001/api/profile', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            user_id: session.user.id,
                                            assessment_data: profile
                                        })
                                    });
                                } catch (e) {
                                    console.error("Failed to save profile to DB", e);
                                }
                            }
                        }}
                    />
                );
            case 'login':
                return (
                    <>
                        {/* Hide navbar on login page */}
                        <style>{`nav { display: none; }`}</style>
                        <LoginPage
                            onLogin={(user) => {
                                // Real Auth is handled by the useEffect observer above, 
                                // so we just navigate based on the assumed onboarding state.
                                setActivePage(onboardingComplete ? 'dashboard' : 'assessment');
                                window.scrollTo(0, 0);
                            }}
                            onBack={() => setActivePage('landing')}
                        />
                    </>
                );
            case 'landing':
            default:
                return <LandingPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <>
            <Navbar
                activePage={activePage}
                onNavigate={handleNavigate}
                isDark={isDark}
                onToggleDark={() => setIsDark(prev => !prev)}
                isLoggedIn={isLoggedIn}
                onLogout={async () => {
                    await supabase.auth.signOut();
                    // Local state cleanup handled by the auth state change listener automatically
                }}
            />
            <div className="page active">
                {renderPage()}
            </div>
        </>
    );
}

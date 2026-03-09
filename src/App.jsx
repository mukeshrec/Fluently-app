import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatPage from './pages/ChatPage';
import AssessmentPage from './pages/AssessmentPage';
import LoginPage from './pages/LoginPage';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fluently_logged_in') === 'true');
    const [onboardingComplete, setOnboardingComplete] = useState(() => localStorage.getItem('fluently_onboarding') === 'true');
    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('fluently_profile');
        return saved ? JSON.parse(saved) : null;
    });

    const [activePage, setActivePage] = useState(() => {
        if (localStorage.getItem('fluently_logged_in') === 'true') {
            return localStorage.getItem('fluently_onboarding') === 'true' ? 'dashboard' : 'assessment';
        }
        return 'landing';
    });

    const [isDark, setIsDark] = useState(false);

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
            case 'practice':
                return <PracticePage />;
            case 'analytics':
                return <AnalyticsPage />;
            case 'chat':
                return <ChatPage />;
            case 'assessment':
                return (
                    <AssessmentPage
                        onComplete={(profile) => {
                            localStorage.setItem('fluently_profile', JSON.stringify(profile));
                            localStorage.setItem('fluently_onboarding', 'true');
                            setUserProfile(profile);
                            setOnboardingComplete(true);
                            setActivePage("dashboard");
                            window.scrollTo(0, 0);
                        }}
                    />
                );
            case 'login':
                return (
                    <>
                        {/* Hide navbar on login page */}
                        <style>{`nav { display: none; }`}</style>
                        <LoginPage
                            onLogin={() => {
                                localStorage.setItem('fluently_logged_in', 'true');
                                setIsLoggedIn(true);
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
                onLogout={() => {
                    localStorage.removeItem('fluently_logged_in');
                    localStorage.removeItem('fluently_onboarding');
                    localStorage.removeItem('fluently_profile');
                    setIsLoggedIn(false);
                    setOnboardingComplete(false);
                    setUserProfile(null);
                    setActivePage('landing');
                }}
            />
            <div className="page active">
                {renderPage()}
            </div>
        </>
    );
}

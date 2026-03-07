import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatPage from './pages/ChatPage';

export default function App() {
    const [activePage, setActivePage] = useState('landing');
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
            case 'landing': return <LandingPage onNavigate={handleNavigate} />;
            case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;
            case 'practice': return <PracticePage />;
            case 'analytics': return <AnalyticsPage />;
            case 'chat': return <ChatPage />;
            default: return <LandingPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <>
            <Navbar
                activePage={activePage}
                onNavigate={handleNavigate}
                isDark={isDark}
                onToggleDark={() => setIsDark(prev => !prev)}
            />
            <div className="page active">
                {renderPage()}
            </div>
        </>
    );
}

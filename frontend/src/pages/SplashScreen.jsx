import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashScreen({ isLoggedIn }) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setTimeout(() => navigate(isLoggedIn ? '/dashboard' : '/login', { replace: true }), 2200);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  return <section className="splash-screen" aria-label="StudentDesk is loading">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <div className="splash-status"><span /> Campus Systems Online</div><span className="version">v1.0</span>
    <div className="splash-card"><div className="splash-logo"><img src="/studentdesk-logo.png" alt="StudentDesk" /><i>✓</i></div><p className="eyebrow">Mini Help Desk <b>•</b> সমাধান</p><h1>StudentDesk</h1><p className="splash-title">Instant Campus Support<br />at Your Fingertips</p><p className="splash-copy">Your direct line to Central IT and academic support.</p><div className="splash-progress"><span /></div><div className="connecting"><span className="pulse" /> Connecting to University Network... <b>READY</b></div></div>
    <footer><span>Central IT &amp; Academic Support Hub</span><span>✓ Verified Campus Portal</span></footer>
  </section>;
}

export default SplashScreen;

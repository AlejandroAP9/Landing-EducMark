import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Comparison } from './components/Comparison';
import { SocialProof } from './components/SocialProof';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

function App() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);

  // Scroll Progress Bar
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple Exit Intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0 && !hasShownExit) {
        setShowExitPopup(true);
        setHasShownExit(true);
      }
    };
    
    // Mobile timer fallback (60s)
    const timer = setTimeout(() => {
       if (!hasShownExit) {
           // Optional: Enable this if client wants mobile popup
           // setShowExitPopup(true);
           // setHasShownExit(true);
       }
    }, 60000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(timer);
    };
  }, [hasShownExit]);

  return (
    <div className="min-h-screen text-foreground font-body bg-background selection:bg-primary/30">
      
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-[#8080ff] z-[100]" 
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <Header />
      <main>
        <Hero />
        <Features />
        <Comparison />
        <SocialProof />
        <Pricing />
        <FAQ />
      </main>
      <Footer />

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-card border border-primary/50 rounded-2xl p-8 max-w-sm text-center shadow-2xl relative">
              <button onClick={() => setShowExitPopup(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">✕</button>
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold mb-2">¡Espera!</h3>
              <p className="text-muted-foreground mb-6">¿Sabías que puedes probar <strong>3 clases GRATIS</strong>? No pierdas la oportunidad.</p>
              <button onClick={() => window.location.href='auth.html'} className="w-full bg-primary text-background font-bold py-3 rounded-full hover:brightness-110 transition-all">
                Probar Gratis Ahora
              </button>
              <button onClick={() => setShowExitPopup(false)} className="mt-4 text-xs text-muted-foreground hover:text-white underline">
                No gracias, prefiero trabajar el domingo
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
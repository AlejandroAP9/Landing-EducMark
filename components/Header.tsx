import React, { useState } from 'react';
import { NavItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: NavItem[] = [
  { label: 'Cómo funciona', href: '#pasos' },
  { label: 'Comparativa', href: '#comparativa' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Precios', href: '#planes' },
  { label: 'FAQ', href: '#faq' },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        :root {
            --nav-bg: rgba(15, 15, 26, 0.85);
            --nav-border: rgba(255, 255, 255, 0.08);
            --primary-color: #a48fff;
            --text-color: #e2e2f5;
            --hover-text-color: #0f0f1a;
        }

        .pill-nav-container {
          position: fixed;
          top: 1.5em;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none;
          padding: 0 1rem;
        }

        .pill-nav {
          pointer-events: auto;
          display: flex;
          align-items: center;
          background: var(--nav-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 5px;
          border-radius: 9999px;
          border: 1px solid var(--nav-border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
          max-width: 100%;
        }

        /* Logo Section */
        .pill-logo {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff; /* Fondo blanco como la imagen */
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 4px;
          padding: 6px; /* Espacio interno para el SVG */
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Suave y sutil */
        }

        /* Efecto de giro sutil al pasar el mouse */
        .pill-logo:hover {
            transform: rotate(20deg) scale(1.1);
        }

        /* Navigation List */
        .pill-list {
          list-style: none;
          display: flex;
          align-items: center;
          margin: 0;
          padding: 0;
          gap: 2px;
        }

        /* Individual Pill Item */
        .pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 20px;
          color: var(--text-color);
          text-decoration: none;
          border-radius: 9999px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          overflow: hidden;
          background: transparent;
          border: 1px solid transparent; /* Prepare for border transition */
          transition: color 0.2s ease, border-color 0.3s ease;
          outline: none;
        }

        /* Hover Circle Animation */
        .pill .hover-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.5);
          width: 100%;
          padding-bottom: 100%; /* Make it square based on width */
          border-radius: 50%;
          background: var(--primary-color);
          opacity: 0;
          z-index: 1;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease;
          pointer-events: none;
        }

        .pill:hover .hover-circle {
          transform: translate(-50%, -50%) scale(1.5); /* Scale up to cover */
          opacity: 1;
        }

        /* Text Label Stacking for Slide Effect */
        .pill .label-container {
            position: relative;
            z-index: 2;
            height: 1.2em;
            line-height: 1.2em;
            overflow: hidden;
            display: block;
        }
        
        .pill-label {
            display: block;
            text-align: center;
            transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            white-space: nowrap;
        }

        .pill-label.normal {
            color: var(--text-color);
            transform: translateY(0);
        }
        
        .pill-label.hover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            color: var(--hover-text-color);
            font-weight: 700;
            transform: translateY(100%);
        }

        /* Hover States for Labels */
        .pill:hover .pill-label.normal {
            transform: translateY(-120%);
            opacity: 0;
        }
        
        .pill:hover .pill-label.hover {
            transform: translateY(0);
        }

        /* CTA Button Specifics - Unified with Primary Theme */
        .pill.cta-btn {
            background: rgba(164, 143, 255, 0.1); /* Primary Dim */
            border: 1px solid rgba(164, 143, 255, 0.3);
            margin-left: 8px;
        }
        .pill.cta-btn:hover {
            background: rgba(164, 143, 255, 0.1); 
            border-color: var(--primary-color);
        }
        .pill.cta-btn .hover-circle {
            background: var(--primary-color); /* Unified Brand Color */
        }
        .pill.cta-btn .pill-label.normal {
            color: var(--primary-color);
            font-weight: 600;
        }
        .pill.cta-btn:hover .pill-label.hover {
            color: #0f0f1a; /* Dark text on bright pill */
        }

        /* Responsive Layout */
        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 900px) {
          .pill-nav-container {
             width: 100%;
             padding: 0 1.5rem;
             top: 1rem;
          }
          .pill-nav {
             width: 100%;
             justify-content: space-between;
             padding: 4px;
          }
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }

        .mobile-menu-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--nav-border);
          color: var(--text-color);
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mobile-menu-button:active { transform: scale(0.95); }
        @media (max-width: 900px) {
          .mobile-menu-button { display: flex; }
        }
      `}</style>

      <nav className="pill-nav-container">
        <div className="pill-nav">
          <a href="#" className="pill-logo" aria-label="Inicio">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%'}}>
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a48fff" />
                  <stop offset="100%" stopColor="#d8b4fe" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#logoGrad)" strokeWidth="5" fill="none" />
              {/* Barra Izquierda */}
              <rect x="28" y="45" width="12" height="25" rx="6" fill="url(#logoGrad)" />
              {/* Barra Central */}
              <rect x="44" y="32" width="12" height="38" rx="6" fill="url(#logoGrad)" />
              {/* Barra Derecha */}
              <rect x="60" y="20" width="12" height="50" rx="6" fill="url(#logoGrad)" />
            </svg>
          </a>

          {/* Desktop Menu */}
          <div className="desktop-only">
            <ul className="pill-list">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button onClick={() => handleNavClick(item.href)} className="pill">
                    <span className="hover-circle"></span>
                    <div className="label-container">
                        <span className="pill-label normal">{item.label}</span>
                        <span className="pill-label hover">{item.label}</span>
                    </div>
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => window.location.href='auth.html'} 
                  className="pill cta-btn"
                >
                   <span className="hover-circle"></span>
                   <div className="label-container">
                        <span className="pill-label normal">Acceso</span>
                        <span className="pill-label hover">Acceso</span>
                    </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="mobile-menu-button mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <span style={{fontSize: '20px'}}>✕</span> : <span style={{fontSize: '20px'}}>☰</span>}
          </button>
        </div>
      </nav>

      {/* Mobile Popover */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-6 right-6 z-[98] md:hidden"
          >
            <div className="bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 shadow-2xl overflow-hidden">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left px-6 py-4 text-[#e2e2f5] hover:bg-white/10 rounded-3xl transition-colors font-medium text-lg"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-white/10 mx-4 my-2"></div>
                <button
                   onClick={() => window.location.href='auth.html'}
                   className="w-full text-center px-6 py-4 bg-primary text-[#0f0f1a] font-bold rounded-3xl hover:brightness-110 transition-all"
                >
                  Ingresar a Plataforma
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
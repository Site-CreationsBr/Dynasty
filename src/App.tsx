import { useState, useEffect } from 'react';

export function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [crownHover, setCrownHover] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated background gradient following mouse */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* Top decorative line */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

        {/* Logo/Crown Icon with Animation */}
        <div className={`mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div 
            className="relative cursor-pointer group"
            onMouseEnter={() => setCrownHover(true)}
            onMouseLeave={() => setCrownHover(false)}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 blur-2xl rounded-full scale-150 transition-all duration-500 ${crownHover ? 'bg-white/20' : 'bg-white/10'}`} />
            
            {/* Rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            </div>
            
            {/* Sparkle particles around crown */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full animate-ping"
                  style={{
                    left: `${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                    top: `${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s',
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
            
            {/* Crown icon with float animation */}
            <svg 
              className={`relative w-20 h-20 text-white transition-all duration-500 ${crownHover ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]' : ''}`}
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <path d="M2.5 7.5L5 17h14l2.5-9.5-4 4.5L12 5l-5.5 7L2.5 7.5z" />
              <path d="M5 19h14v2H5z" opacity="0.7" />
              {/* Crown jewels */}
              <circle cx="12" cy="9" r="1" className="animate-pulse" />
              <circle cx="8" cy="11" r="0.7" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="16" cy="11" r="0.7" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            </svg>
          </div>
        </div>
        
        {/* CSS for float animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>

        {/* Main Title */}
        <div className={`text-center mb-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl font-extralight tracking-[0.3em] text-white mb-2">
            DYNASTY
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
            <span className="text-white/40 text-xs tracking-[0.5em] uppercase font-light">
              O Lugar Certo
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
          </div>
        </div>

        {/* Subtitle */}
        <p className={`text-white/60 text-center max-w-xl text-lg md:text-xl font-extralight tracking-wide mb-4 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Um servidor diferente de tudo que você já viu. 
          <span className="text-white/80"> A vibe aqui é outra.</span>
        </p>

        {/* Secondary text */}
        <p className={`text-white/40 text-center max-w-md text-sm font-light tracking-wider mb-12 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Cola com a gente e faz parte da família. 
          Tá esperando o quê?
        </p>

        {/* CTA Button */}
        <div className={`transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="https://discord.gg/dinasty"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden"
          >
            {/* Button background with border */}
            <div className="absolute inset-0 border border-white/20 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/[0.05]" />
            
            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-white" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-white" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-white" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-white" />

            {/* Discord Icon */}
            <svg 
              className="relative w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>

            {/* Button text */}
            <span className="relative text-white/80 text-sm tracking-[0.3em] uppercase font-light group-hover:text-white transition-colors duration-300">
              Entrar no Discord
            </span>

            {/* Arrow */}
            <svg 
              className="relative w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Bottom section - centered with bottom line */}
        <div className={`absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-1000 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Stats/Features - using CSS Grid for perfect alignment */}
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start justify-items-center">
            {/* Coluna 1 - CREW */}
            <div className="flex flex-col items-center justify-center text-center px-4 md:px-8">
              <div className="text-white/20 text-xs tracking-[0.2em] uppercase mb-1">Crew</div>
              <div className="text-white/60 text-sm tracking-widest">Firmeza</div>
            </div>
            
            {/* Separador 1 */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            
            {/* Coluna 2 - CALLS (central) com indicador */}
            <div className="flex flex-col items-center justify-center text-center px-4 md:px-8">
              <div className="text-white/20 text-xs tracking-[0.2em] uppercase mb-1">Calls</div>
              <div className="text-white/60 text-sm tracking-widest">Toda Noite</div>
              
              {/* Indicador visual central - dentro da coluna CALLS */}
              <div className="flex flex-col items-center justify-center mt-6">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-1 bg-white/30 rounded-full" />
                  <div className="w-2 h-2 bg-white/20 rounded-full" />
                  <div className="w-1 h-1 bg-white/30 rounded-full" />
                </div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2" />
              </div>
            </div>
            
            {/* Separador 2 */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            
            {/* Coluna 3 - RISADAS */}
            <div className="flex flex-col items-center justify-center text-center px-4 md:px-8">
              <div className="text-white/20 text-xs tracking-[0.2em] uppercase mb-1">Risadas</div>
              <div className="text-white/60 text-sm tracking-widest">Garantidas</div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent via-white/30 to-transparent transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Side decorative elements */}
      <div className={`absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-white/20" />
        <div className="text-white/20 text-xs tracking-[0.3em] uppercase writing-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Dynasty Elite
        </div>
        <div className="w-px h-20 bg-gradient-to-t from-transparent to-white/20" />
      </div>

      <div className={`absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-white/20" />
        <div className="text-white/20 text-xs tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>
          Dynasty Elite
        </div>
        <div className="w-px h-20 bg-gradient-to-t from-transparent to-white/20" />
      </div>

      {/* Credits - Bottom Left */}
      <div className={`absolute bottom-4 left-4 md:bottom-6 md:left-6 transition-all duration-1000 delay-1500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-1.5 text-white/25 hover:text-white/40 transition-colors duration-300">
          {/* Discord icon + label */}
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3 h-3 text-white/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="text-[9px] text-white/20 tracking-[0.2em] uppercase">Discord</span>
          </div>
          {/* Creators */}
          <div className="flex items-center gap-2 text-[10px] tracking-wider">
            <span className="text-white/30">›</span>
            <span className="font-light">pyreblox</span>
            <span className="text-white/15">—</span>
            <span className="text-white/20 italic">site creator</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-wider">
            <span className="text-white/30">›</span>
            <span className="font-light">ionlyfeelhatred.</span>
            <span className="text-white/15">—</span>
            <span className="text-white/20 italic">ideia do site</span>
          </div>
        </div>
      </div>
    </div>
  );
}

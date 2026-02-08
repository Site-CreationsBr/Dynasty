import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Matrix rain component - numbers falling with fade
const MatrixRain = () => {
  const columns = useMemo(() => {
    // Create fewer columns for performance
    const cols = [];
    const numColumns = 15; // Reduced number for performance
    for (let i = 0; i < numColumns; i++) {
      cols.push({
        id: i,
        left: `${(i / numColumns) * 100 + Math.random() * 5}%`,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 12,
      });
    }
    return cols;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {columns.map((col) => (
        <MatrixColumn key={col.id} left={col.left} delay={col.delay} duration={col.duration} />
      ))}
    </div>
  );
};

// Individual column of falling numbers
const MatrixColumn = ({ left, delay, duration }: { left: string; delay: number; duration: number }) => {
  const [numbers, setNumbers] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate random numbers for this column
    const generateNumbers = () => {
      const chars = '0123456789';
      const length = 15 + Math.floor(Math.random() * 10);
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]);
    };
    
    setNumbers(generateNumbers());
    
    // Regenerate numbers periodically
    const interval = setInterval(() => {
      setNumbers(generateNumbers());
    }, duration * 1000);
    
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className="absolute top-0 flex flex-col items-center"
      style={{
        left,
        animation: `matrixFall ${duration}s linear ${delay}s infinite`,
      }}
    >
      {numbers.map((num, idx) => (
        <span
          key={idx}
          className="text-[10px] sm:text-xs font-mono leading-4 select-none"
          style={{
            color: `rgba(80, 80, 80, ${0.15 - idx * 0.008})`,
            textShadow: idx < 3 ? '0 0 2px rgba(100,100,100,0.2)' : 'none',
          }}
        >
          {num}
        </span>
      ))}
    </div>
  );
};

// Declare YouTube types
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: {
        videoId: string;
        playerVars?: Record<string, number | string>;
        events?: {
          onReady?: (event: { target: YTPlayer }) => void;
          onStateChange?: (event: { data: number }) => void;
        };
      }) => YTPlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
}

export function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [crownHover, setCrownHover] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);

  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Setup callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'toLrnNkxqow',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: 'toLrnNkxqow',
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            playerReadyRef.current = true;
            event.target.setVolume(15); // 15% volume
            // If user already interacted, start playing
            if (hasInteracted) {
              event.target.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event) => {
            // 0 = ended, 1 = playing, 2 = paused
            if (event.data === 0) {
              // Video ended, it should loop automatically due to playlist param
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    return () => {
      // Cleanup
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Start playing when user interacts
  const startPlaying = useCallback(() => {
    if (playerReadyRef.current && playerRef.current && !isPlaying) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Try to play on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      startPlaying();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [startPlaying]);

  // Handle mute/unmute
  useEffect(() => {
    if (playerRef.current && playerReadyRef.current) {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.discordapp.com/attachments/1469167345330163866/1470164200750846187/image.png?ex=698a4c9b&is=6988fb1b&hm=67f35c93ffe8213638b10ea35bfb5d63cf36328922d791215b14821b79b0e460&')`,
        }}
      />
      
      {/* Dark overlay to darken the background */}
      <div className="absolute inset-0 z-0 bg-black/75" />

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
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles - reduced for mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
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

      {/* Matrix rain effect - hacker style numbers */}
      <MatrixRain />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Top decorative line - shorter on mobile */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 sm:h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

        {/* Logo/Crown Icon with Animation */}
        <div className={`mb-4 sm:mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div 
            className="relative cursor-pointer group"
            onMouseEnter={() => setCrownHover(true)}
            onMouseLeave={() => setCrownHover(false)}
            onTouchStart={() => setCrownHover(true)}
            onTouchEnd={() => setCrownHover(false)}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 blur-2xl rounded-full scale-150 transition-all duration-500 ${crownHover ? 'bg-white/20' : 'bg-white/10'}`} />
            
            {/* Rotating ring - smaller on mobile */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            </div>
            
            {/* Sparkle particles around crown - hidden on very small screens */}
            <div className="absolute inset-0 hidden sm:flex items-center justify-center">
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
            
            {/* Crown icon with float animation - smaller on mobile */}
            <svg 
              className={`relative w-14 h-14 sm:w-20 sm:h-20 text-white transition-all duration-500 ${crownHover ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]' : ''}`}
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
        
        {/* CSS for float animation and matrix rain */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes matrixFall {
            0% {
              transform: translateY(-100%);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            85% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }
        `}</style>

        {/* Main Title */}
        <div className={`text-center mb-4 sm:mb-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extralight tracking-[0.15em] sm:tracking-[0.3em] text-white mb-2">
            DYNASTY
          </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/50" />
            <span className="text-white/40 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.5em] uppercase font-light">
              O Lugar Certo
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/50" />
          </div>
        </div>

        {/* Subtitle */}
        <p className={`text-white/60 text-center max-w-[280px] sm:max-w-xl text-base sm:text-lg md:text-xl font-extralight tracking-wide mb-3 sm:mb-4 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Um servidor diferente de tudo que você já viu. 
          <span className="text-white/80"> A vibe aqui é outra.</span>
        </p>

        {/* Secondary text */}
        <p className={`text-white/40 text-center max-w-[260px] sm:max-w-md text-xs sm:text-sm font-light tracking-wider mb-8 sm:mb-12 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Cola com a gente e faz parte da família. 
          Tá esperando o quê?
        </p>

        {/* CTA Button - larger touch target on mobile */}
        <div className={`transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="https://discord.gg/dinasty"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 overflow-hidden min-h-[48px] active:scale-95 transition-transform"
          >
            {/* Button background with border */}
            <div className="absolute inset-0 border border-white/20 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/[0.05]" />
            
            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t border-l border-white/40 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5 group-hover:border-white" />
            <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t border-r border-white/40 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5 group-hover:border-white" />
            <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b border-l border-white/40 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5 group-hover:border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b border-r border-white/40 transition-all duration-300 group-hover:w-4 group-hover:h-4 sm:group-hover:w-5 sm:group-hover:h-5 group-hover:border-white" />

            {/* Discord Icon */}
            <svg 
              className="relative w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors duration-300" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>

            {/* Button text */}
            <span className="relative text-white/80 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-light group-hover:text-white transition-colors duration-300">
              Entrar no Discord
            </span>

            {/* Arrow - hidden on very small screens */}
            <svg 
              className="relative w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 hidden xs:block" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Bottom section - responsive positioning */}
        <div className={`mt-12 sm:mt-0 sm:absolute sm:bottom-28 sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center transition-all duration-1000 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Stats/Features - responsive grid */}
          <div className="flex flex-row items-start justify-center gap-4 sm:gap-0 sm:grid sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {/* Coluna 1 - CREW */}
            <div className="group relative flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-8 py-3 cursor-default transition-all duration-500 ease-in-out sm:hover:scale-105">
              {/* Hover glow effect - desktop only */}
              <div className="absolute inset-0 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent blur-xl" />
              </div>
              {/* Top line animation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-0 sm:group-hover:w-full transition-all duration-500 ease-out" />
              {/* Content */}
              <div className="text-white/20 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1 transition-all duration-300 sm:group-hover:text-white/50 sm:group-hover:tracking-[0.25em]">Crew</div>
              <div className="text-white/60 text-xs sm:text-sm tracking-widest transition-all duration-300 sm:group-hover:text-white/90 sm:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Firmeza</div>
              {/* Bottom line animation */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-0 sm:group-hover:w-full transition-all duration-500 ease-out delay-100" />
            </div>
            
            {/* Separador 1 - hidden on mobile, use border instead */}
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-300" />
            <div className="sm:hidden w-px h-8 bg-white/10" />
            
            {/* Coluna 2 - CALLS (central) com indicador */}
            <div className="group relative flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-8 py-3 cursor-default transition-all duration-500 ease-in-out sm:hover:scale-105">
              {/* Hover glow effect - desktop only */}
              <div className="absolute inset-0 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent blur-xl" />
              </div>
              {/* Top line animation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-0 sm:group-hover:w-full transition-all duration-500 ease-out" />
              {/* Content */}
              <div className="text-white/20 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1 transition-all duration-300 sm:group-hover:text-white/50 sm:group-hover:tracking-[0.25em]">Calls</div>
              <div className="text-white/60 text-xs sm:text-sm tracking-widest whitespace-nowrap transition-all duration-300 sm:group-hover:text-white/90 sm:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Toda Noite</div>
              {/* Bottom line animation */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-0 sm:group-hover:w-full transition-all duration-500 ease-out delay-100" />
              
              {/* Indicador visual central - hidden on mobile */}
              <div className="hidden sm:flex flex-col items-center justify-center mt-6 transition-all duration-300 sm:group-hover:opacity-100 opacity-70">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-1 bg-white/30 rounded-full transition-all duration-300 sm:group-hover:bg-white/50 sm:group-hover:scale-125" />
                  <div className="w-2 h-2 bg-white/20 rounded-full transition-all duration-300 sm:group-hover:bg-white/40 sm:group-hover:scale-110" />
                  <div className="w-1 h-1 bg-white/30 rounded-full transition-all duration-300 sm:group-hover:bg-white/50 sm:group-hover:scale-125" />
                </div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2 transition-all duration-300 sm:group-hover:w-12 sm:group-hover:via-white/50" />
              </div>
            </div>
            
            {/* Separador 2 */}
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-300" />
            <div className="sm:hidden w-px h-8 bg-white/10" />
            
            {/* Coluna 3 - RISADAS */}
            <div className="group relative flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-8 py-3 cursor-default transition-all duration-500 ease-in-out sm:hover:scale-105">
              {/* Hover glow effect - desktop only */}
              <div className="absolute inset-0 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent blur-xl" />
              </div>
              {/* Top line animation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-0 sm:group-hover:w-full transition-all duration-500 ease-out" />
              {/* Content */}
              <div className="text-white/20 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1 transition-all duration-300 sm:group-hover:text-white/50 sm:group-hover:tracking-[0.25em]">Risadas</div>
              <div className="text-white/60 text-xs sm:text-sm tracking-widest transition-all duration-300 sm:group-hover:text-white/90 sm:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Garantidas</div>
              {/* Bottom line animation */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-0 sm:group-hover:w-full transition-all duration-500 ease-out delay-100" />
            </div>
          </div>
          
          {/* Mobile indicator - only visible on mobile */}
          <div className="flex sm:hidden flex-col items-center justify-center mt-4">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <div className="w-1 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom decorative line - shorter on mobile */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 sm:h-24 bg-gradient-to-t from-transparent via-white/30 to-transparent transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Side decorative elements - only on large screens */}
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

      {/* Credits - Bottom Left - responsive */}
      <div className={`absolute bottom-3 left-3 sm:bottom-6 sm:left-6 transition-all duration-1000 delay-1500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-1 sm:gap-1.5 text-white/25 hover:text-white/40 transition-colors duration-300">
          {/* Discord icon + label */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="text-[8px] sm:text-[9px] text-white/20 tracking-[0.15em] sm:tracking-[0.2em] uppercase">Discord</span>
          </div>
          {/* Creators */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] tracking-wider">
            <span className="text-white/30">›</span>
            <span className="font-light">pyreblox</span>
            <span className="text-white/15">—</span>
            <span className="text-white/20 italic">site creator</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] tracking-wider">
            <span className="text-white/30">›</span>
            <span className="font-light">ionlyfeelhatred.</span>
            <span className="text-white/15">—</span>
            <span className="text-white/20 italic">ideia do site</span>
          </div>
        </div>
      </div>

      {/* YouTube Audio Player - Hidden container for YouTube IFrame API */}
      <div 
        id="youtube-player"
        className="fixed -left-[9999px] -top-[9999px] w-px h-px overflow-hidden pointer-events-none"
      />

      {/* Mute/Unmute Button - Bottom Right */}
      <div className={`absolute bottom-3 right-3 sm:bottom-6 sm:right-6 transition-all duration-1000 delay-1500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={toggleMute}
          className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm"
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {/* Sound wave animation bars */}
          <div className="flex items-end gap-0.5 h-3 sm:h-4">
            <div className={`w-0.5 bg-white/60 rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-2 animate-pulse'}`} style={{ animationDelay: '0ms' }} />
            <div className={`w-0.5 bg-white/60 rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-3 sm:h-4 animate-pulse'}`} style={{ animationDelay: '150ms' }} />
            <div className={`w-0.5 bg-white/60 rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-2 animate-pulse'}`} style={{ animationDelay: '300ms' }} />
            <div className={`w-0.5 bg-white/60 rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-3 animate-pulse'}`} style={{ animationDelay: '450ms' }} />
          </div>

          {/* Mute icon */}
          {isMuted ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
              <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" />
            </svg>
          )}

          {/* Label - hidden on very small screens */}
          <span className="hidden sm:block text-[9px] text-white/40 tracking-[0.15em] uppercase group-hover:text-white/60 transition-colors">
            {isMuted ? 'Som Off' : 'Som On'}
          </span>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-white/40 transition-colors" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-white/40 transition-colors" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-white/40 transition-colors" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-white/40 transition-colors" />
        </button>

        {/* Now playing text */}
        <div className="mt-2 text-right">
          <p className="text-[7px] sm:text-[8px] text-white/20 tracking-wider italic">
            ♪ Liquid Smooth - Mitski
          </p>
        </div>
      </div>
    </div>
  );
}

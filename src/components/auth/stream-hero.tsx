export function StreamHero() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-[-10%] top-[36%] h-36 w-[120%] rounded-[999px] bg-[linear-gradient(90deg,rgba(176,218,245,0.0)_0%,rgba(176,218,245,0.34)_24%,rgba(198,232,252,0.72)_50%,rgba(176,218,245,0.3)_78%,rgba(176,218,245,0.0)_100%)] blur-[1px]" />
      <div className="stream-glow absolute left-[-10%] top-[37%] h-28 w-[120%] rounded-[999px]" />

      <div className="fish-swim absolute left-[-8rem] top-[37%]">
        <FishSvg />
      </div>
      <div className="fish-swim-slow absolute left-[-12rem] top-[41%] opacity-90">
        <FishSvg />
      </div>
      <div className="fish-swim-delayed absolute left-[-10rem] top-[33%] opacity-80">
        <FishSvg />
      </div>
    </div>
  );
}

function FishSvg() {
  return (
    <svg width="92" height="40" viewBox="0 0 92 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="[transform:scaleX(-1)] drop-shadow-[0_6px_10px_rgba(116,173,208,0.25)]">
      <path d="M14 20C14 13.373 22.954 8 34 8H55.5C66.2696 8 75 13.373 75 20C75 26.627 66.2696 32 55.5 32H34C22.954 32 14 26.627 14 20Z" fill="url(#fishBody)" />
      <path d="M73 20L90 10V30L73 20Z" fill="url(#fishTail)" />
      <circle cx="27" cy="18" r="2" fill="#2A4A5E" fillOpacity="0.82" />
      <defs>
        <linearGradient id="fishBody" x1="14" y1="8" x2="75" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B5E1F9" />
          <stop offset="1" stopColor="#8EC7EA" />
        </linearGradient>
        <linearGradient id="fishTail" x1="73" y1="10" x2="90" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CCFEF" />
          <stop offset="1" stopColor="#7ABAE2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

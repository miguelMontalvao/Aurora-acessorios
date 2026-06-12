interface AuroraLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  color?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { icon: 28, aurora: 18, sub: 7.5, tagline: 5.5 },
  md: { icon: 40, aurora: 26, sub: 10, tagline: 7 },
  lg: { icon: 56, aurora: 36, sub: 13, tagline: 9 },
  xl: { icon: 72, aurora: 48, sub: 17, tagline: 11 },
};

const colorMap = {
  dark: { primary: '#5A3E2B', accent: '#C7A86D' },
  light: { primary: '#EAE2D3', accent: '#C7A86D' },
  gold: { primary: '#C7A86D', accent: '#EAE2D3' },
};

// Sunburst/starburst icon — matches the brand image
const SunburstIcon = ({ size, accent }: { size: number; accent: string }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const r1 = 8, r2 = i % 3 === 0 ? 22 : (i % 3 === 1 ? 16 : 13);
      return (
        <line
          key={angle}
          x1={30 + r1 * Math.cos(rad)}
          y1={22 + r1 * Math.sin(rad)}
          x2={30 + r2 * Math.cos(rad)}
          y2={22 + r2 * Math.sin(rad)}
          stroke={accent}
          strokeWidth={i % 3 === 0 ? 1.2 : 0.8}
          strokeLinecap="round"
        />
      );
    })}
    {/* Center diamond */}
    <polygon points="30,14 33,22 30,30 27,22" fill={accent} />
    {/* Side sparkles */}
    <polygon points="8,22 10,24 8,26 6,24" fill={accent} opacity="0.7" />
    <polygon points="52,22 54,24 52,26 50,24" fill={accent} opacity="0.7" />
    {/* Top sparkle */}
    <polygon points="30,2 31.2,6 30,10 28.8,6" fill={accent} opacity="0.8" />
  </svg>
);

// Icon-only variant: stylized "A" with sunburst
const IconMark = ({ size, primary, accent }: { size: number; primary: string; accent: string }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rays from top of A */}
    {[270, 300, 330, 0, 30, 60, 90].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const r1 = 10, r2 = [20, 15, 18, 22, 18, 15, 20][i];
      return (
        <line
          key={angle}
          x1={40 + r1 * Math.cos(rad)}
          y1={20 + r1 * Math.sin(rad)}
          x2={40 + r2 * Math.cos(rad)}
          y2={20 + r2 * Math.sin(rad)}
          stroke={accent}
          strokeWidth={i === 3 ? 1.4 : 0.9}
          strokeLinecap="round"
        />
      );
    })}
    <polygon points="40,10 41.5,15 40,20 38.5,15" fill={accent} />
    {/* Letter A */}
    <path d="M28 62 L40 28 L52 62" stroke={primary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="32" y1="50" x2="48" y2="50" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const AuroraLogo = ({ variant = 'full', color = 'dark', size = 'md' }: AuroraLogoProps) => {
  const { primary, accent } = colorMap[color];
  const s = sizeMap[size];

  if (variant === 'icon') {
    return <IconMark size={s.icon * 1.5} primary={primary} accent={accent} />;
  }

  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-4">
        <SunburstIcon size={s.icon} accent={accent} />
        <div className="w-px self-stretch" style={{ background: accent, opacity: 0.5 }} />
        <div className="flex flex-col">
          <span
            className="font-display font-light leading-none tracking-widest"
            style={{ fontSize: s.aurora, color: primary, letterSpacing: '0.12em' }}
          >
            AURORA
          </span>
          <span
            className="font-body font-medium uppercase"
            style={{ fontSize: s.sub, color: accent, letterSpacing: '0.4em' }}
          >
            ACESSÓRIOS
          </span>
        </div>
      </div>
    );
  }

  // Full vertical logo
  return (
    <div className="flex flex-col items-center gap-0.5">
      <SunburstIcon size={s.icon} accent={accent} />
      <span
        className="font-display font-light leading-none"
        style={{ fontSize: s.aurora, color: primary, letterSpacing: '0.08em' }}
      >
        AURORA
      </span>
      <span
        className="font-body font-medium uppercase"
        style={{ fontSize: s.sub, color: accent, letterSpacing: '0.45em' }}
      >
        ACESSÓRIOS
      </span>
      {/* Diamond divider */}
      <div className="flex items-center gap-2 my-1">
        <div className="h-px w-8" style={{ background: accent, opacity: 0.5 }} />
        <svg width="6" height="6" viewBox="0 0 6 6">
          <polygon points="3,0 6,3 3,6 0,3" fill={accent} />
        </svg>
        <div className="h-px w-8" style={{ background: accent, opacity: 0.5 }} />
      </div>
      <span
        className="font-body uppercase"
        style={{ fontSize: s.tagline, color: primary, letterSpacing: '0.35em', opacity: 0.75 }}
      >
        DO BÁSICO AO OUSADO
      </span>
    </div>
  );
};

export default AuroraLogo;

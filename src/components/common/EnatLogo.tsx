import React from 'react';

interface EnatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'badge';
  lightText?: boolean;
  className?: string;
}

export const EnatLogo: React.FC<EnatLogoProps> = ({
  size = 'md',
  showTagline = false,
  variant = 'full',
  lightText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32, text: 'text-base', sub: 'text-[9px]', motto: 'text-[8px]' },
    md: { w: 42, h: 42, text: 'text-xl', sub: 'text-[10px]', motto: 'text-[9px]' },
    lg: { w: 54, h: 54, text: 'text-2xl', sub: 'text-xs', motto: 'text-[10px]' },
    xl: { w: 68, h: 68, text: 'text-3xl', sub: 'text-sm', motto: 'text-xs' },
  }[size];

  // Authentic Enat Bank Stylized "E" Ribbon Emblem in signature Enat Purple (#6B21A8, #581C87, #7E22CE)
  const emblem = (
    <div
      className="relative flex items-center justify-center shrink-0 rounded-2xl shadow-lg shadow-purple-950/50 transition-transform hover:scale-105"
      style={{
        width: iconDimensions.w,
        height: iconDimensions.h,
        background: 'linear-gradient(145deg, #581C87 0%, #3B0764 60%, #2E0854 100%)',
        border: '1.5px solid rgba(192, 132, 252, 0.4)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-[78%] h-[78%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Signature Enat luminous purple/fuchsia gradients */}
          <linearGradient id="enatPurpleLight" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.3" stopColor="#E9D5FF" />
            <stop offset="0.7" stopColor="#C084FC" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id="enatPurpleGlow" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F472B6" />
            <stop offset="0.5" stopColor="#C084FC" />
            <stop offset="1" stopColor="#7E22CE" />
          </linearGradient>

          <linearGradient id="enatSpineGrad" x1="18" y1="18" x2="28" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.4" stopColor="#D8B4FE" />
            <stop offset="1" stopColor="#9333EA" />
          </linearGradient>

          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#C084FC" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Authentic Stylized 'E' Monogram with 3 dynamic swooping nurturing curves */}
        {/* Vertical rounded spine connecting the curves */}
        <path
          d="M24 20C24 16.5 27 14 30.5 14H33C36.5 14 39 16.5 39 20V80C39 83.5 36.5 86 33 86H30.5C27 86 24 83.5 24 80V20Z"
          fill="url(#enatSpineGrad)"
        />

        {/* Top Wing Curve of the 'E' */}
        <path
          d="M33 16C46 16 68 17 80 23C83 24.5 84 28 82 31C80 34 76.5 35 73.5 33.5C64 29 48 28 33 28V16Z"
          fill="url(#enatPurpleLight)"
          filter="url(#subtleGlow)"
        />

        {/* Middle Wing Curve of the 'E' */}
        <path
          d="M33 44C44 44 58 45 68 49C71.5 50.5 72.5 54 70.5 57C68.5 60 65 60.5 62 59C53 55 42 54.5 33 54.5V44Z"
          fill="url(#enatPurpleGlow)"
          filter="url(#subtleGlow)"
        />

        {/* Bottom Caring Cradle Curve of the 'E' */}
        <path
          d="M33 72C48 72 66 73.5 78 79C81.5 80.5 82.5 84.5 80.5 87.5C78.5 90.5 74.5 91 71.5 89.5C60 84.5 45 83.5 33 83.5V72Z"
          fill="url(#enatPurpleLight)"
          filter="url(#subtleGlow)"
        />

        {/* Delicate accent node symbolizing maternal empowerment & unity */}
        <circle cx="80" cy="24" r="4.5" fill="#FFFFFF" />
        <circle cx="80" cy="24" r="2.5" fill="#9333EA" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex ${className}`}>{emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {emblem}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className={`font-black tracking-wider uppercase ${iconDimensions.text} ${
              lightText ? 'text-white' : 'text-slate-900'
            }`}
          >
            ENAT
          </span>
          <span
            className={`font-bold tracking-wide uppercase ${iconDimensions.text} text-purple-400`}
          >
            BANK
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-semibold tracking-tight text-purple-300 ${iconDimensions.sub}`}>
            እናት ባንክ
          </span>
          <span className="text-purple-400/60 text-[8px]">•</span>
          <span className={`italic font-medium text-purple-200/90 ${iconDimensions.motto}`}>
            {showTagline ? 'ማን እንደ እናት • No One Like A Mother' : 'ማን እንደ እናት'}
          </span>
        </div>
      </div>
    </div>
  );
};

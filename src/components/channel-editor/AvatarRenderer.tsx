import React from "react";
import { AvatarConfig } from "@/types/game";

interface AvatarRendererProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({ config, size = 100, className = "" }) => {
  const {
    shape = "circle",
    bgGradient = "cyberpunk",
    eyes = "normal",
    mouth = "smile",
    brows = "neutral",
    accessory = "none",
    monogram = "",
    textColor = "#ffffff",
    border = "none",
    borderColor = "#38bdf8",
  } = config || {};

  const idSuffix = React.useId().replace(/:/g, "_");
  const gradId = `grad_${bgGradient}_${idSuffix}`;
  const clipId = `clip_${shape}_${idSuffix}`;

  // Gradients definition
  const getGradientStops = (name: string) => {
    switch (name) {
      case "sunset":
        return (
          <>
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
          </>
        );
      case "cyberpunk":
        return (
          <>
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </>
        );
      case "neon-matrix":
        return (
          <>
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </>
        );
      case "gold-rush":
        return (
          <>
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </>
        );
      case "midnight":
        return (
          <>
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </>
        );
      case "crimson":
        return (
          <>
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </>
        );
      case "amethyst":
        return (
          <>
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#581c87" />
          </>
        );
      default:
        return (
          <>
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 overflow-visible select-none ${className}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {getGradientStops(bgGradient)}
        </linearGradient>

        <clipPath id={clipId}>
          {shape === "circle" && <circle cx="50" cy="50" r="48" />}
          {shape === "square" && <rect x="2" y="2" width="96" height="96" rx="2" />}
          {shape === "rounded" && <rect x="2" y="2" width="96" height="96" rx="22" />}
          {shape === "hexagon" && (
            <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" />
          )}
        </clipPath>

        <filter id={`glow_${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Clipped Avatar Content */}
      <g clipPath={`url(#${clipId})`}>
        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill={`url(#${gradId})`} />

        {/* Subtle geometric pattern */}
        <circle cx="10" cy="10" r="30" fill="#ffffff" fillOpacity="0.05" />
        <circle cx="90" cy="90" r="40" fill="#ffffff" fillOpacity="0.04" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

        {/* Character Face / Body Silhouette */}
        <g id="character-group">
          {/* Head base */}
          <circle cx="50" cy="52" r="28" fill="#fde047" fillOpacity="0.95" />
          {/* Subtle blush */}
          <circle cx="34" cy="59" r="4" fill="#f43f5e" fillOpacity="0.25" />
          <circle cx="66" cy="59" r="4" fill="#f43f5e" fillOpacity="0.25" />

          {/* Brows */}
          {brows === "determined" && (
            <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round">
              <line x1="32" y1="42" x2="44" y2="44" />
              <line x1="68" y1="42" x2="56" y2="44" />
            </g>
          )}
          {brows === "raised" && (
            <g stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none">
              <path d="M32 40 Q38 36 44 39" />
              <path d="M56 39 Q62 36 68 40" />
            </g>
          )}
          {brows === "neutral" && (
            <g stroke="#1e293b" strokeWidth="2" strokeLinecap="round">
              <line x1="33" y1="41" x2="43" y2="41" />
              <line x1="57" y1="41" x2="67" y2="41" />
            </g>
          )}

          {/* Eyes */}
          {eyes === "normal" && (
            <g fill="#0f172a">
              <circle cx="38" cy="48" r="3.5" />
              <circle cx="62" cy="48" r="3.5" />
              <circle cx="39.2" cy="46.8" r="1.2" fill="#ffffff" />
              <circle cx="63.2" cy="46.8" r="1.2" fill="#ffffff" />
            </g>
          )}
          {eyes === "wink" && (
            <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none">
              <circle cx="38" cy="48" r="3.5" fill="#0f172a" stroke="none" />
              <circle cx="39.2" cy="46.8" r="1.2" fill="#ffffff" stroke="none" />
              <path d="M57 48 Q62 43 67 48" />
            </g>
          )}
          {eyes === "cool" && (
            <g fill="#0f172a">
              {/* Cool sunglasses */}
              <polygon points="30,44 48,44 46,54 32,54" />
              <polygon points="52,44 70,44 68,54 54,54" />
              <line x1="48" y1="46" x2="52" y2="46" stroke="#0f172a" strokeWidth="2" />
              <line x1="34" y1="46" x2="44" y2="52" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="56" y1="46" x2="66" y2="52" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.8" />
            </g>
          )}
          {eyes === "happy" && (
            <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M33 49 Q38 43 43 49" />
              <path d="M57 49 Q62 43 67 49" />
            </g>
          )}
          {eyes === "glow" && (
            <g fill="#38bdf8">
              <rect x="33" y="46" width="10" height="5" rx="2" />
              <rect x="57" y="46" width="10" height="5" rx="2" />
              <line x1="30" y1="48.5" x2="70" y2="48.5" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
            </g>
          )}
          {eyes === "stars" && (
            <g fill="#f59e0b">
              <polygon points="38,43 40,47 44,48 41,51 42,55 38,52 34,55 35,51 32,48 36,47" />
              <polygon points="62,43 64,47 68,48 65,51 66,55 62,52 58,55 59,51 56,48 60,47" />
            </g>
          )}

          {/* Mouth */}
          {mouth === "smile" && (
            <path d="M41 59 Q50 67 59 59" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          )}
          {mouth === "open" && (
            <path d="M41 57 Q50 71 59 57 Z" fill="#b91c1c" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          )}
          {mouth === "smirk" && (
            <path d="M43 62 Q54 64 61 58" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          )}
          {mouth === "neutral" && (
            <line x1="43" y1="62" x2="57" y2="62" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          )}
          {mouth === "gamer" && (
            <g>
              <ellipse cx="50" cy="62" rx="6" ry="5" fill="#0f172a" />
              <ellipse cx="50" cy="64" rx="4" ry="2.5" fill="#f87171" />
            </g>
          )}

          {/* Accessories */}
          {accessory === "headphones" && (
            <g>
              {/* Headband */}
              <path d="M22 52 C22 28, 78 28, 78 52" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
              <path d="M22 52 C22 28, 78 28, 78 52" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              {/* Left ear pad */}
              <rect x="18" y="44" width="8" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Right ear pad */}
              <rect x="74" y="44" width="8" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Mic boom */}
              <path d="M22 57 Q20 72 38 72" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="40" cy="72" r="3" fill="#38bdf8" />
            </g>
          )}
          {accessory === "crown" && (
            <g>
              <polygon points="32,32 37,18 50,26 63,18 68,32" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="37" cy="18" r="2" fill="#ef4444" />
              <circle cx="50" cy="26" r="2" fill="#38bdf8" />
              <circle cx="63" cy="18" r="2" fill="#ef4444" />
            </g>
          )}
          {accessory === "glasses" && (
            <g stroke="#1e293b" strokeWidth="2" fill="none">
              <rect x="30" y="42" width="16" height="12" rx="3" stroke="#38bdf8" fill="#38bdf8" fillOpacity="0.2" />
              <rect x="54" y="42" width="16" height="12" rx="3" stroke="#38bdf8" fill="#38bdf8" fillOpacity="0.2" />
              <line x1="46" y1="47" x2="54" y2="47" stroke="#1e293b" strokeWidth="2" />
            </g>
          )}
          {accessory === "cap" && (
            <g>
              <path d="M26 36 C30 18, 70 18, 74 36 Z" fill="#dc2626" />
              <path d="M24 36 C40 33, 70 33, 86 38 C75 42, 35 41, 24 36 Z" fill="#b91c1c" />
              <circle cx="50" cy="22" r="2" fill="#ffffff" />
            </g>
          )}
          {accessory === "cyber-visor" && (
            <g>
              <polygon points="26,42 74,42 71,53 29,53" fill="#06b6d4" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="1.5" />
              <line x1="28" y1="47" x2="72" y2="47" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
            </g>
          )}
        </g>

        {/* Monogram / Text Overlay if provided */}
        {monogram && (
          <g>
            <rect x="58" y="68" width="36" height="26" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
            <text
              x="76"
              y="86"
              fill={textColor}
              fontSize="14"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {monogram.toUpperCase().slice(0, 2)}
            </text>
          </g>
        )}
      </g>

      {/* Frame / Outer Border */}
      {border === "neon" && (
        <g filter={`url(#glow_${idSuffix})`}>
          {shape === "circle" && (
            <circle cx="50" cy="50" r="47" fill="none" stroke={borderColor} strokeWidth="3.5" />
          )}
          {shape === "square" && (
            <rect x="3" y="3" width="94" height="94" rx="2" fill="none" stroke={borderColor} strokeWidth="3.5" />
          )}
          {shape === "rounded" && (
            <rect x="3" y="3" width="94" height="94" rx="22" fill="none" stroke={borderColor} strokeWidth="3.5" />
          )}
          {shape === "hexagon" && (
            <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke={borderColor} strokeWidth="3.5" />
          )}
        </g>
      )}

      {border === "gold" && (
        <g>
          {shape === "circle" && (
            <>
              <circle cx="50" cy="50" r="48" fill="none" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#d97706" strokeWidth="1.2" />
            </>
          )}
          {shape === "square" && (
            <rect x="3" y="3" width="94" height="94" rx="3" fill="none" stroke="#fbbf24" strokeWidth="3" />
          )}
          {shape === "rounded" && (
            <rect x="3" y="3" width="94" height="94" rx="22" fill="none" stroke="#fbbf24" strokeWidth="3" />
          )}
          {shape === "hexagon" && (
            <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke="#fbbf24" strokeWidth="3" />
          )}
        </g>
      )}

      {border === "cyber" && (
        <g stroke="#06b6d4" strokeWidth="2.5" fill="none">
          <path d="M8 24 L8 8 L24 8" />
          <path d="M76 8 L92 8 L92 24" />
          <path d="M92 76 L92 92 L76 92" />
          <path d="M24 92 L8 92 L8 76" />
        </g>
      )}
    </svg>
  );
};

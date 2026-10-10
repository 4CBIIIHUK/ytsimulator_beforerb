import React from "react";
import { BannerConfig } from "@/types/game";
import { IconYouTube, IconTwitter, IconDiscord, IconTwitch } from "@/components/svg/icons";

interface BannerRendererProps {
  config: BannerConfig;
  channelName?: string;
  className?: string;
  height?: number | string;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({
  config,
  channelName = "MY CHANNEL",
  className = "",
  height = "160px",
}) => {
  const {
    bgStyle = "cyber-grid",
    colorA = "#3b82f6",
    colorB = "#1d4ed8",
    slogan = "Gaming, Reviews & Fun",
    showMascot = true,
    mascotType = "streamer",
    socials = { youtube: true, twitter: true, discord: true, twitch: false },
  } = config || {};

  const idSuffix = React.useId().replace(/:/g, "_");
  const gradId = `banner_grad_${idSuffix}`;

  return (
    <div
      style={{ height }}
      className={`relative w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-lg select-none ${className}`}
    >
      <svg
        viewBox="0 0 1200 320"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>

          <pattern id={`dot_pat_${idSuffix}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#ffffff" fillOpacity="0.15" />
          </pattern>

          <linearGradient id={`glow_line_${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorA} stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorB} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base Background */}
        <rect x="0" y="0" width="1200" height="320" fill={`url(#${gradId})`} />

        {/* Style Patterns */}
        {bgStyle === "cyber-grid" && (
          <g>
            {/* Perspective Horizon Grid */}
            <line x1="0" y1="180" x2="1200" y2="180" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`h_${i}`}
                x1="0"
                y1={180 + i * i * 2.2}
                x2="1200"
                y2={180 + i * i * 2.2}
                stroke="#ffffff"
                strokeOpacity={0.08 + i * 0.03}
                strokeWidth="1.2"
              />
            ))}
            {Array.from({ length: 19 }).map((_, i) => {
              const xPos = (i - 9) * 70 + 600;
              return (
                <line
                  key={`v_${i}`}
                  x1="600"
                  y1="180"
                  x2={xPos * 1.8 - 480}
                  y2="320"
                  stroke="#ffffff"
                  strokeOpacity="0.22"
                  strokeWidth="1.2"
                />
              );
            })}
          </g>
        )}

        {bgStyle === "synthwave" && (
          <g>
            {/* Sun */}
            <circle cx="600" cy="180" r="110" fill="#f43f5e" fillOpacity="0.75" />
            {/* Sun horizontal slices */}
            <line x1="490" y1="185" x2="710" y2="185" stroke={`url(#${gradId})`} strokeWidth="4" />
            <line x1="500" y1="195" x2="700" y2="195" stroke={`url(#${gradId})`} strokeWidth="5" />
            <line x1="515" y1="207" x2="685" y2="207" stroke={`url(#${gradId})`} strokeWidth="7" />
            <line x1="535" y1="222" x2="665" y2="222" stroke={`url(#${gradId})`} strokeWidth="9" />
            {/* Neon Mountains */}
            <polygon points="0,320 220,170 380,240 540,160 700,230 920,150 1200,320" fill="#0f172a" fillOpacity="0.65" />
            <polygon points="120,320 320,190 480,260 680,180 840,260 1060,180 1200,260 1200,320" fill="#090d16" fillOpacity="0.75" />
          </g>
        )}

        {bgStyle === "studio-waves" && (
          <g fill="none" stroke="#ffffff" strokeOpacity="0.18">
            <path d="M0,160 Q150,60 300,160 T600,160 T900,160 T1200,160" strokeWidth="4" />
            <path d="M0,140 Q180,260 360,140 T720,140 T1080,140 T1200,140" strokeWidth="2.5" />
            <path d="M0,180 Q220,90 440,180 T880,180 T1200,180" strokeWidth="3" />
            <path d="M0,200 Q280,290 560,200 T1120,200 T1200,200" strokeWidth="1.5" />
          </g>
        )}

        {bgStyle === "dots-matrix" && (
          <rect x="0" y="0" width="1200" height="320" fill={`url(#dot_pat_${idSuffix})`} />
        )}

        {bgStyle === "minimal-geo" && (
          <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="2" fill="none">
            <polygon points="100,50 180,10 260,50 260,130 180,170 100,130" />
            <polygon points="980,160 1060,120 1140,160 1140,240 1060,280 980,240" />
            <circle cx="1060" cy="200" r="28" />
            <line x1="50" y1="280" x2="350" y2="280" />
            <line x1="850" y1="50" x2="1150" y2="50" />
          </g>
        )}

        {/* Mascot / Channel Illustration */}
        {showMascot && (
          <g transform="translate(140, 70)" id="mascot">
            <circle cx="90" cy="90" r="70" fill="#0f172a" fillOpacity="0.4" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" />
            {mascotType === "streamer" && (
              <g transform="translate(45, 45) scale(0.9)">
                {/* Controller shape */}
                <rect x="15" y="30" width="70" height="42" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
                {/* Dpad */}
                <rect x="27" y="44" width="14" height="4" rx="2" fill="#38bdf8" />
                <rect x="32" y="39" width="4" height="14" rx="2" fill="#38bdf8" />
                {/* Buttons */}
                <circle cx="66" cy="45" r="3.5" fill="#ef4444" />
                <circle cx="74" cy="51" r="3.5" fill="#fbbf24" />
                <circle cx="58" cy="51" r="3.5" fill="#10b981" />
                {/* Antennas / signals */}
                <path d="M40 24 Q50 14 60 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M34 18 Q50 4 66 18" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
            {mascotType === "robot" && (
              <g transform="translate(45, 45) scale(0.9)">
                <rect x="25" y="30" width="50" height="42" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="3" />
                <rect x="35" y="42" width="10" height="6" rx="2" fill="#10b981" />
                <rect x="55" y="42" width="10" height="6" rx="2" fill="#10b981" />
                <line x1="38" y1="60" x2="62" y2="60" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="30" x2="50" y2="18" stroke="#10b981" strokeWidth="3" />
                <circle cx="50" cy="15" r="4" fill="#fbbf24" />
              </g>
            )}
            {mascotType === "camera" && (
              <g transform="translate(45, 45) scale(0.9)">
                <rect x="20" y="32" width="60" height="38" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                <circle cx="50" cy="51" r="14" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                <circle cx="50" cy="51" r="6" fill="#f43f5e" />
                <circle cx="70" cy="38" r="3" fill="#ef4444" />
              </g>
            )}
          </g>
        )}

        {/* Center / Right Content: Channel Title & Slogan */}
        <g transform="translate(420, 80)">
          {/* Subtle backdrop */}
          <rect x="-20" y="0" width="760" height="150" rx="12" fill="#0f172a" fillOpacity="0.4" stroke="#ffffff" strokeOpacity="0.08" />

          {/* Accent bar */}
          <line x1="-20" y1="0" x2="740" y2="0" stroke={`url(#glow_line_${idSuffix})`} strokeWidth="3" />

          {/* Channel Name */}
          <text
            x="20"
            y="54"
            fill="#ffffff"
            fontSize="44"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="2"
            className="uppercase"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
          >
            {channelName}
          </text>

          {/* Slogan */}
          <text
            x="22"
            y="94"
            fill="#e2e8f0"
            fontSize="22"
            fontWeight="500"
            fontFamily="sans-serif"
            letterSpacing="1"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
          >
            {slogan || "Official Gaming & Lifestyle Channel"}
          </text>

          {/* Decorative tag */}
          <g transform="translate(22, 112)">
            <rect x="0" y="0" width="115" height="22" rx="4" fill="#ffffff" fillOpacity="0.15" />
            <text x="57" y="15" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
              OFFICIAL HUB
            </text>
          </g>
        </g>
      </svg>

      {/* Social Media SVG Badges overlay in bottom right */}
      <div className="absolute bottom-3 right-4 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-md">
        {socials.youtube && (
          <div title="YouTube" className="text-red-500 hover:text-red-400 transition-colors">
            <IconYouTube size={18} />
          </div>
        )}
        {socials.twitter && (
          <div title="Twitter / X" className="text-slate-200 hover:text-white transition-colors">
            <IconTwitter size={16} />
          </div>
        )}
        {socials.discord && (
          <div title="Discord" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <IconDiscord size={18} />
          </div>
        )}
        {socials.twitch && (
          <div title="Twitch" className="text-purple-400 hover:text-purple-300 transition-colors">
            <IconTwitch size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

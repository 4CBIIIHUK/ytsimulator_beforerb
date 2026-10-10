import React from "react";
import { TOPIC_COLORS } from "@/lib/game-engine/constants";

interface Props {
  text: string;
  topic: string;
  style: string;
  tier: number;
  type: "video" | "shorts";
  className?: string;
}

function Face({ x, y, s, emotion, glow }: { x: number; y: number; s: number; emotion: "shock" | "smile" | "smirk"; glow: boolean }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {glow && <circle cx="0" cy="0" r="46" fill="#fff" opacity="0.18" />}
      <path d="M-40 70 Q0 30 40 70 L40 90 L-40 90 Z" fill="#1e293b" />
      <circle cx="0" cy="0" r="34" fill="#fcd34d" stroke="#0f172a" strokeWidth="3" />
      <path d="M-30 -14 Q0 -48 30 -14 Q22 -36 0 -38 Q-22 -36 -30 -14Z" fill="#3f2a14" />
      {emotion === "shock" ? (
        <>
          <circle cx="-12" cy="-2" r="7" fill="#fff" stroke="#0f172a" strokeWidth="2" />
          <circle cx="12" cy="-2" r="7" fill="#fff" stroke="#0f172a" strokeWidth="2" />
          <circle cx="-12" cy="-2" r="3" fill="#0f172a" />
          <circle cx="12" cy="-2" r="3" fill="#0f172a" />
          <ellipse cx="0" cy="18" rx="8" ry="10" fill="#7f1d1d" stroke="#0f172a" strokeWidth="2" />
          <path d="M-22 -14 L-6 -10 M22 -14 L6 -10" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : emotion === "smile" ? (
        <>
          <path d="M-18 -2 Q-12 -9 -6 -2 M6 -2 Q12 -9 18 -2" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-14 12 Q0 28 14 12 Z" fill="#7f1d1d" stroke="#0f172a" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="-12" cy="-2" r="3.5" fill="#0f172a" />
          <circle cx="12" cy="-2" r="3.5" fill="#0f172a" />
          <path d="M-10 16 Q4 20 14 10" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M6 -12 L20 -16" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

export const ThumbnailRenderer: React.FC<Props> = ({ text, topic, style, tier, type, className = "" }) => {
  const id = React.useId().replace(/:/g, "");
  const isShort = type === "shorts";
  const W = isShort ? 180 : 320;
  const H = isShort ? 320 : 180;
  const [c1, c2] = TOPIC_COLORS[topic] ?? ["#334155", "#64748b"];
  const label = (text || "НОВОЕ ВИДЕО").toUpperCase();
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  const maxChars = isShort ? 10 : 14;
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  const shown = lines.slice(0, 3);
  const fontSize = tier === 0 ? (isShort ? 14 : 14) : isShort ? 22 : 26;

  const emotion = style === "reaction-face" ? "shock" : style === "minimal-clean" ? "smirk" : "smile";
  const faceX = isShort ? W / 2 : W * 0.75;
  const faceY = isShort ? H * 0.62 : H * 0.55;
  const textX = isShort ? W / 2 : 16;
  const anchor = isShort ? "middle" : "start";
  const textY0 = isShort ? 44 : 42;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`block h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tier === 0 ? "#3f3f46" : c1} />
          <stop offset="1" stopColor={tier === 0 ? "#52525b" : c2} />
        </linearGradient>
        <radialGradient id={`vig${id}`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.65" />
        </radialGradient>
        <filter id={`gl${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#bg${id})`} />

      {tier === 0 && (
        <g opacity="0.35">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1={i * (H / 12)} x2={W} y2={i * (H / 12) + 6} stroke="#000" strokeWidth="1" />
          ))}
        </g>
      )}

      {tier >= 3 && (
        <g opacity="0.25">
          {Array.from({ length: 9 }).map((_, i) => (
            <polygon key={i} points={`${faceX},${faceY} ${(i * W) / 8 - 20},0 ${(i * W) / 8 + 10},0`} fill="#fff" />
          ))}
        </g>
      )}

      {tier >= 1 && style === "neon-bold" && (
        <g opacity="0.5" stroke="#fff" strokeWidth="1">
          <circle cx={faceX} cy={faceY} r={isShort ? 70 : 60} fill="none" strokeDasharray="4 6" />
        </g>
      )}

      {tier >= 2 && <Face x={faceX} y={faceY} s={isShort ? 1.2 : 1} emotion={emotion} glow={tier >= 3} />}
      {tier === 1 && <Face x={faceX} y={faceY} s={isShort ? 0.9 : 0.75} emotion="smile" glow={false} />}

      {tier >= 2 && style === "clickbait-arrow" && (
        <g filter={tier >= 3 ? `url(#gl${id})` : undefined}>
          <circle cx={isShort ? W * 0.25 : W * 0.48} cy={isShort ? H * 0.42 : H * 0.7} r="16" fill="none" stroke="#ef4444" strokeWidth="4" />
          <path
            d={isShort ? `M${W * 0.75} ${H * 0.35} L${W * 0.36} ${H * 0.42}` : `M${W * 0.62} ${H * 0.92} L${W * 0.52} ${H * 0.74}`}
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      )}

      {tier >= 2 && style === "minimal-clean" && (
        <rect x={isShort ? 20 : 12} y={isShort ? 16 : 16} width={isShort ? W - 40 : W * 0.5} height={shown.length * (fontSize + 4) + 18} rx="6" fill="#000" opacity="0.45" />
      )}

      {tier >= 3 && <rect width={W} height={H} fill={`url(#vig${id})`} />}

      <g filter={tier >= 3 ? `url(#gl${id})` : undefined}>
        {shown.map((l, i) => (
          <text
            key={i}
            x={textX}
            y={textY0 + i * (fontSize + 4)}
            textAnchor={anchor}
            fontFamily="Impact, 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize={fontSize}
            fill={tier === 0 ? "#e4e4e7" : i === 0 && tier >= 2 ? "#facc15" : "#ffffff"}
            stroke={tier >= 1 ? "#000" : "none"}
            strokeWidth={tier >= 1 ? 4 : 0}
            paintOrder="stroke"
            opacity={tier === 0 ? 0.8 : 1}
          >
            {l}
          </text>
        ))}
      </g>

      {tier >= 4 && (
        <g fill="#fde047">
          {[
            [W * 0.12, H * 0.85],
            [W * 0.9, H * 0.15],
            [W * 0.55, H * 0.12],
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z`} />
          ))}
          <rect x={W - 46} y={H - 24} width="38" height="16" rx="3" fill="#dc2626" />
          <text x={W - 27} y={H - 12.5} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="sans-serif">
            NEW
          </text>
        </g>
      )}
    </svg>
  );
};

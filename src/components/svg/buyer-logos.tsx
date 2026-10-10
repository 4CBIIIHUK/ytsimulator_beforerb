import React from "react";
import { SvgIconProps } from "./icons";

export const LogoOmniMedia: React.FC<SvgIconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="14" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6 3" />
    <circle cx="16" cy="16" r="8" fill="#4f46e5" />
    <circle cx="16" cy="16" r="3" fill="#ffffff" />
  </svg>
);

export const LogoCyberStream: React.FC<SvgIconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <polygon points="16 2 29 9 29 23 16 30 3 23 3 9" stroke="#06b6d4" strokeWidth="2.5" />
    <polygon points="16 7 24 12 24 20 16 25 8 20 8 12" fill="#0891b2" />
    <polyline points="13 16 16 13 19 16 16 19 13 16" fill="#ffffff" />
  </svg>
);

export const LogoApex: React.FC<SvgIconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <polygon points="16 3 30 27 2 27" stroke="#f59e0b" strokeWidth="2.5" />
    <polygon points="16 10 24 24 8 24" fill="#d97706" />
    <circle cx="16" cy="19" r="2.5" fill="#ffffff" />
  </svg>
);

export const LogoHyperion: React.FC<SvgIconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="3" y="3" width="26" height="26" rx="6" stroke="#ec4899" strokeWidth="2.5" />
    <path d="M9 16L16 9L23 16L16 23Z" fill="#db2777" />
    <circle cx="16" cy="16" r="2.5" fill="#fdf2f8" />
  </svg>
);

export const LogoVanguard: React.FC<SvgIconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="14" stroke="#10b981" strokeWidth="2.5" />
    <path d="M10 11L16 21L22 11" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LogoGoogolSyndicate: React.FC<SvgIconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="14" stroke="#a855f7" strokeWidth="3" />
    <path d="M16 6a10 10 0 1 0 10 10h-10" fill="#9333ea" />
    <circle cx="16" cy="16" r="4" fill="#ffffff" />
  </svg>
);

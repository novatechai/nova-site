// Space-themed SVG assets for the Nova Labs universe theme
import React from 'react';

// Quantum AI illustration
export function QuantumAI() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" />
      <path
        d="M32 16V48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 32H48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="8" fill="currentColor" fillOpacity="0.2" />
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  );
}

// Nebula Analytics illustration
export function NebulaAnalytics() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M8 48L24 32L32 40L56 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="56" cy="16" r="4" fill="currentColor" />
      <circle cx="32" cy="40" r="4" fill="currentColor" />
      <circle cx="24" cy="32" r="4" fill="currentColor" />
      <circle cx="8" cy="48" r="4" fill="currentColor" />
    </svg>
  );
}

// Orbit Learning illustration
export function OrbitLearning() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <circle cx="32" cy="32" r="8" fill="currentColor" />
      <ellipse
        cx="32"
        cy="32"
        rx="24"
        ry="16"
        stroke="currentColor"
        strokeWidth="2"
        transform="rotate(30 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="24"
        ry="16"
        stroke="currentColor"
        strokeWidth="2"
        transform="rotate(-30 32 32)"
      />
    </svg>
  );
}

// Interstellar Deployment illustration
export function InterstellarDeployment() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M32 8L40 24H24L32 8Z"
        fill="currentColor"
      />
      <path
        d="M16 32L32 28L48 32L32 56L16 32Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="28" r="4" fill="currentColor" />
    </svg>
  );
}

// Stellar Assistants illustration
export function StellarAssistants() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 48C16 40.268 23.164 34 32 34C40.836 34 48 40.268 48 48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="48" cy="16" r="4" fill="currentColor" />
      <circle cx="16" cy="16" r="4" fill="currentColor" />
    </svg>
  );
}

// Pulsar Innovation illustration 
export function PulsarInnovation() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <circle cx="32" cy="32" r="8" fill="currentColor" />
      <circle
        cx="32"
        cy="32"
        r="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
    </svg>
  );
}

// Add animations for the orbit effects
export const SpaceAnimations = () => (
  <style jsx global>{`
    @keyframes orbit-slow {
      0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
    }
    @keyframes orbit-medium {
      0% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
    }
    @keyframes orbit-fast {
      0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
    }
    .animate-orbit-slow {
      animation: orbit-slow 15s linear infinite;
      transform-origin: center center;
      transform-box: fill-box;
    }
    .animate-orbit-medium {
      animation: orbit-medium 10s linear infinite;
      transform-origin: center center;
      transform-box: fill-box;
    }
    .animate-orbit-fast {
      animation: orbit-fast 7s linear infinite;
      transform-origin: center center;
      transform-box: fill-box;
    }
  `}</style>
); 
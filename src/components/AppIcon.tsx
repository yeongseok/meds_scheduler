import React from 'react';

interface AppIconProps {
  size?: number;
  animate?: boolean;
}

export function AppIcon({ size = 96, animate = false }: AppIconProps) {
  const iconSize = size;
  const svgSize = size * 0.65;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: iconSize, height: iconSize }}
    >
      {/* Background Circle - Solid Teal Primary Color */}
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden bg-primary"
        style={{
          boxShadow: '0 4px 20px rgba(136, 201, 195, 0.3)',
        }}
      />

      {/* Care Recipient Icon - Two People with Heart & Pills */}
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Left Person (Caregiver) */}
        <g>
          {/* Head */}
          <circle
            cx="20"
            cy="20"
            r="7"
            fill="white"
            opacity="0.95"
          />
          {/* Body */}
          <path
            d="M20 28C15 28 12 30 12 33V40C12 41 12.5 42 13.5 42H26.5C27.5 42 28 41 28 40V33C28 30 25 28 20 28Z"
            fill="white"
            opacity="0.95"
          />
        </g>

        {/* Right Person (Care Recipient) */}
        <g>
          {/* Head */}
          <circle
            cx="44"
            cy="20"
            r="7"
            fill="white"
            opacity="0.85"
          />
          {/* Body */}
          <path
            d="M44 28C39 28 36 30 36 33V40C36 41 36.5 42 37.5 42H50.5C51.5 42 52 41 52 40V33C52 30 49 28 44 28Z"
            fill="white"
            opacity="0.85"
          />
        </g>

        {/* Connection Heart (between two people) */}
        <g>
          <path
            d="M32 48C32 48 28 44.5 28 42C28 40.5 29 39 30.5 39C31.3 39 32 39.5 32 40C32 39.5 32.7 39 33.5 39C35 39 36 40.5 36 42C36 44.5 32 48 32 48Z"
            fill="white"
            opacity="0.95"
          />
        </g>

        {/* Small Pill Icons (showing medicine care) */}
        <g opacity="0.8">
          {/* Left pill */}
          <g>
            <ellipse
              cx="16"
              cy="50"
              rx="3"
              ry="5"
              fill="white"
              transform="rotate(-20 16 50)"
            />
            <line
              x1="16"
              y1="47"
              x2="16"
              y2="53"
              stroke="#88C9C3"
              strokeWidth="0.8"
              transform="rotate(-20 16 50)"
            />
          </g>

          {/* Right pill */}
          <g>
            <ellipse
              cx="48"
              cy="50"
              rx="3"
              ry="5"
              fill="white"
              transform="rotate(20 48 50)"
            />
            <line
              x1="48"
              y1="47"
              x2="48"
              y2="53"
              stroke="#88C9C3"
              strokeWidth="0.8"
              transform="rotate(20 48 50)"
            />
          </g>
        </g>

        {/* Caring Hands (supporting gesture) */}
        <g opacity="0.7">
          {/* Left hand */}
          <path
            d="M14 36C14 36 12 37 12 39C12 40 13 41 14 41C15 41 16 40 16 39L14 36Z"
            fill="white"
            opacity="0.6"
          />
          {/* Right hand */}
          <path
            d="M50 36C50 36 52 37 52 39C52 40 51 41 50 41C49 41 48 40 48 39L50 36Z"
            fill="white"
            opacity="0.6"
          />
        </g>

        {/* Plus sign (medical symbol) - top right */}
        <g opacity="0.5">
          <rect
            x="53"
            y="14"
            width="2"
            height="6"
            rx="0.5"
            fill="white"
          />
          <rect
            x="52"
            y="16"
            width="4"
            height="2"
            rx="0.5"
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
}

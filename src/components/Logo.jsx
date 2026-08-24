import { Group, Text } from "@mantine/core";

export default function Logo({ size = 40, showText = false, className = "" }) {
  return (
    <Group
      className={`autopia-logo ${className}`}
      gap={10}
      wrap="nowrap"
      align="center"
      dir="rtl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        role="img"
        aria-label="Autopia"
        style={{ display: "block", flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="autopiaGaugeBadge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="0.55" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        <rect x="2" y="2" width="60" height="60" rx="17" fill="url(#autopiaGaugeBadge)" />

        <path
          d="M14.8 45.05 A21 21 0 1 1 49.2 45.05"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        <path
          d="M14.8 45.05 A21 21 0 0 1 45.5 16.91"
          fill="none"
          stroke="#a5f3fc"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        <path
          d="M23.2 43.6 L32 20.8 L40.8 43.6"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 36.6 H37"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <Text
          component="span"
          fw={800}
          style={{
            fontSize: `${Math.round(size * 0.5)}px`,
            letterSpacing: "-0.02em",
          }}
        >
          Autopia
        </Text>
      )}
    </Group>
  );
}


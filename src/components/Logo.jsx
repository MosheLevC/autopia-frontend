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
      <img
        src="/logo.png"
        alt="Autopia Logo"
        style={{
          height: `${size}px`,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
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


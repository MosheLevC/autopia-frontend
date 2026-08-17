import { Group, Text } from "@mantine/core";

/**
 * Autopia Brand Logo Component
 * Renders the accurate PNG logo mark from public/logo.png
 *
 * @param {Object} props
 * @param {number} [props.size=40] - Logo height in px
 * @param {boolean} [props.showText=false] - Show 'אוטופיה' text alongside mark
 * @param {string} [props.className='']
 */
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
          }}
        >
          אוטופיה{" "}
          <Text
            component="span"
            c="var(--mantine-primary-color-filled, #228be6)"
            inherit
            style={{ fontSize: "0.85em" }}
          >
            AUTOPIA
          </Text>
        </Text>
      )}
    </Group>
  );
}


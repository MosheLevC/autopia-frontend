import { Paper, Text, TextInput } from "@mantine/core";
import { formatLicensePlate } from "../../utils/plateUtils";

const SIZE_CONFIG = {
  sm: {
    height: 28,
    sidebarWidth: 24,
    flagWidth: 14,
    flagHeight: 9,
    ilFontSize: "0.48rem",
    fontSize: "0.72rem",
    letterSpacing: "0.05em",
    borderWidth: 1.5,
    radius: "sm",
    horizontalPadding: 7,
    gap: 1,
    maxWidth: 150,
  },
  md: {
    height: 40,
    sidebarWidth: 32,
    flagWidth: 18,
    flagHeight: 12,
    ilFontSize: "0.58rem",
    fontSize: "0.95rem",
    letterSpacing: "0.08em",
    borderWidth: 2,
    radius: "md",
    horizontalPadding: 10,
    gap: 2,
    maxWidth: 210,
  },
  lg: {
    height: 64,
    sidebarWidth: 52,
    flagWidth: 24,
    flagHeight: 16,
    ilFontSize: "0.75rem",
    fontSize: "2.1rem",
    letterSpacing: "3px",
    borderWidth: 3,
    radius: "lg",
    horizontalPadding: 12,
    gap: 4,
    maxWidth: 380,
  },
};

function IsraeliFlag({ width, height }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 2 }}
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="white" />
      <rect y="2" width="24" height="2.5" fill="#0052cc" />
      <rect y="11.5" width="24" height="2.5" fill="#0052cc" />
      <polygon
        points="12,5 14.5,9.5 9.5,9.5"
        stroke="#0052cc"
        strokeWidth="0.9"
        fill="none"
      />
      <polygon
        points="12,11 14.5,6.5 9.5,6.5"
        stroke="#0052cc"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
}

export default function LicensePlate({
  value,
  onChange,
  onSearch,
  onKeyDown,
  placeholder = "123·45·678",
  autoFocus = false,
  readOnly = false,
  displayOnly = false,
  size = "lg",
  emptyLabel = "-",
  ariaLabel = "מספר רישוי",
}) {
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.lg;
  const displayValue = formatLicensePlate(value) || emptyLabel;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.();
    }
    onKeyDown?.(event);
  };

  return (
    <Paper
      component={displayOnly ? "span" : "div"}
      radius={config.radius}
      dir="ltr"
      aria-label={displayOnly ? `${ariaLabel}: ${displayValue}` : undefined}
      style={{
        alignItems: "center",
        backgroundColor: "#ffcc00",
        border: `${config.borderWidth}px solid #000000`,
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
        display: displayOnly ? "inline-flex" : "flex",
        flexShrink: 1,
        flexDirection: "row",
        margin: displayOnly ? undefined : "0 auto",
        maxWidth: displayOnly ? "100%" : config.maxWidth,
        minWidth: 0,
        overflow: "hidden",
        width: displayOnly ? "fit-content" : "100%",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          backgroundColor: "#0052cc",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: config.ilFontSize,
          fontWeight: 800,
          gap: config.gap,
          height: config.height,
          justifyContent: "center",
          userSelect: "none",
          width: config.sidebarWidth,
        }}
      >
        <IsraeliFlag width={config.flagWidth} height={config.flagHeight} />
        <span style={{ letterSpacing: 1 }}>IL</span>
      </span>

      {displayOnly ? (
        <Text
          component="span"
          c="black"
          fw={800}
          fz={config.fontSize}
          lh={1}
          px={config.horizontalPadding}
          style={{
            direction: "ltr",
            fontFamily: "Inter, sans-serif",
            letterSpacing: config.letterSpacing,
            minWidth: 0,
            whiteSpace: "nowrap",
          }}
        >
          {displayValue}
        </Text>
      ) : (
        <TextInput
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          variant="unstyled"
          autoFocus={autoFocus}
          readOnly={readOnly}
          aria-label={ariaLabel}
          style={{ flex: 1, minWidth: 0 }}
          styles={{
            input: {
              color: "#000000",
              direction: "ltr",
              fontFamily: "Inter, sans-serif",
              fontSize: config.fontSize,
              fontWeight: 800,
              height: config.height,
              letterSpacing: config.letterSpacing,
              padding: `0 ${config.horizontalPadding}px`,
              textAlign: "center",
              width: "100%",
            },
          }}
        />
      )}
    </Paper>
  );
}

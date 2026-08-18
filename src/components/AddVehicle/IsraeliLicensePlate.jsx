import { Paper, TextInput } from "@mantine/core";

export default function IsraeliLicensePlate({
  value,
  onChange,
  onSearch,
  onKeyDown,
  placeholder = "123·45·678",
  autoFocus = false,
  readOnly = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Paper
      radius="lg"
      dir="ltr"
      style={{
        backgroundColor: "#ffcc00",
        border: "3px solid #000000",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          backgroundColor: "#0052cc",
          color: "#ffffff",
          width: 52,
          height: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          fontSize: "0.7rem",
          fontWeight: 800,
          userSelect: "none",
          flexShrink: 0
        }}
      >
        <svg
          width="24"
          height="16"
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ borderRadius: "2px" }}
        >
          <rect width="24" height="16" fill="white" />
          <rect y="2" width="24" height="2.5" fill="#0052CC" />
          <rect y="11.5" width="24" height="2.5" fill="#0052CC" />
          <polygon
            points="12,5 14.5,9.5 9.5,9.5"
            stroke="#0052CC"
            strokeWidth="0.9"
            fill="none"
          />
          <polygon
            points="12,11 14.5,6.5 9.5,6.5"
            stroke="#0052CC"
            strokeWidth="0.9"
            fill="none"
          />
        </svg>

        <span style={{ letterSpacing: "1px", fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>
          IL
        </span>
      </div>

      <TextInput
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        variant="unstyled"
        autoFocus={autoFocus}
        readOnly={readOnly}
        style={{ flex: 1, minWidth: 0 }}
        styles={{
          input: {
            textAlign: "center",
            fontSize: "2.1rem",
            fontWeight: 800,
            letterSpacing: "3px",
            color: "#000000",
            fontFamily: "var(--font-hebrew), 'Inter', sans-serif",
            width: "100%",
            height: 64,
            padding: "0 12px",
            direction: "ltr"
          }
        }}
      />
    </Paper>
  );
}

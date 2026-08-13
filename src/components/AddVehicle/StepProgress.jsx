import { Box, Group, Stack, Text } from "@mantine/core";

export default function StepProgress({ activeStep, steps, onStepClick }) {
  return (
    <Stack spacing="xs" align="center" style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
      <Box style={{ width: "100%", position: "relative", padding: "0 4px" }}>
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "10%",
            right: "10%",
            height: 2,
            backgroundColor: "#e2e8f0",
            zIndex: 0
          }}
        />

        <Group position="apart" noWrap style={{ position: "relative", zIndex: 1 }}>
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            const isDone = activeStep > idx;

            return (
              <Stack
                key={idx}
                align="center"
                spacing={6}
                onClick={() => onStepClick?.(idx)}
                style={{ cursor: "pointer", flex: 1 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: isActive
                      ? "2px solid #2563eb"
                      : isDone
                      ? "2px solid #2563eb"
                      : "2px solid #cbd5e1",
                    color: isActive || isDone ? "#2563eb" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    boxShadow: isActive ? "0 0 0 4px rgba(37, 99, 235, 0.15)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  {idx + 1}
                </div>
                <Text
                  size="xs"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#2563eb" : "#64748b",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    fontFamily: "var(--font-hebrew)"
                  }}
                >
                  {step.title}
                </Text>
              </Stack>
            );
          })}
        </Group>
      </Box>

      <Text size="xs" c="dimmed" mt={4} style={{ fontFamily: "var(--font-hebrew)" }}>
        שלב {activeStep + 1} מתוך {steps.length}
      </Text>
    </Stack>
  );
}

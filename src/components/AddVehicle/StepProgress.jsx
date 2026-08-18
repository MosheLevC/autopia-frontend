import { Stepper, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function StepProgress({ activeStep, steps, onStepClick }) {
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Stack gap="xs" align="center" w="100%" maw={720} mx="auto">
      <Stepper
        active={activeStep}
        onStepClick={onStepClick}
        size="sm"
        w="100%"
        styles={{
          step: {
            flexDirection: "column",
            alignItems: "center",
          },
          stepBody: {
            textAlign: "center",
            marginTop: 8,
            display: isMobile ? "none" : "block",
          },
          stepLabel: {
            textAlign: "center",
          },
          separator: {
            alignSelf: "flex-start",
            marginTop:
              "calc((var(--stepper-icon-size) - var(--stepper-outline-thickness)) / 2)",
          },
        }}
      >
        {steps.map((step, idx) => (
          <Stepper.Step
            key={idx}
            label={!isMobile ? step.title : undefined}
            description={!isMobile ? step.desc : undefined}
          />
        ))}
      </Stepper>

      <Text size="xs" c="dimmed" mt="xs">
        שלב {activeStep + 1} מתוך {steps.length}
      </Text>
    </Stack>
  );
}



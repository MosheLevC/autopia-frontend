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
        wrap={false}
        w="100%"
        styles={{
          steps: {
            alignItems: "flex-start",
            paddingBottom: isMobile ? 0 : 32,
          },
          step: {
            position: "relative",
            flex: "0 0 var(--stepper-icon-size)",
            overflow: "visible",
          },
          stepBody: {
            position: "absolute",
            top: "calc(var(--stepper-icon-size) + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: 120,
            textAlign: "center",
            margin: 0,
            display: isMobile ? "none" : "block",
          },
          stepLabel: {
            textAlign: "center",
          },
          separator: {
            alignSelf: "flex-start",
            minWidth: 0,
            marginInline: isMobile ? 4 : 8,
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



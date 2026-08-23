import { Box, Button } from "@mantine/core";

export function AddBottomButton({
  label = "הוסף",
  onClick,
  icon = "ph-plus-circle",
  disabled = false,
  hiddenFrom = "sm",
  ...props
}) {
  return (
    <Box
      pos="sticky"
      bottom={{ base: "5.5rem", sm: "1rem" }}
      pt="xs"
      hiddenFrom={hiddenFrom}
      style={{ zIndex: 10 }}
    >
      <Button
        fullWidth
        size="lg"
        radius="lg"
        h={50}
        fw={700}
        onClick={onClick}
        disabled={disabled}
        leftSection={
          <i
            className={icon}
            style={{ fontSize: "1.3rem" }}
            aria-hidden="true"
          />
        }
        shadow="sm"
        {...props}
      >
        {label}
      </Button>
    </Box>
  );
}

export default AddBottomButton;

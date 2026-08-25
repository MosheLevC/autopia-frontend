import { Box, Button } from "@mantine/core";
import { PlusCircle } from "@phosphor-icons/react";

function AddBottomButton({
  label = "הוסף",
  onClick,
  icon: Icon = PlusCircle,
  disabled = false,
  hiddenFrom = "sm",
  ...props
}) {
  const IconComponent = Icon || PlusCircle;
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
        leftSection={<IconComponent size={22} aria-hidden="true" />}
        shadow="sm"
        {...props}
      >
        {label}
      </Button>
    </Box>
  );
}

export default AddBottomButton;

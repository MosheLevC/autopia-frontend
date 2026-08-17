import {
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";

export default function AIChat({ opened, onClose }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen
      transitionProps={{
        transition: "slide-up",
        duration: 300,
        timingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      title={
        <Group gap="xs">
          <i
            className="ph-sparkle-fill"
            style={{
              fontSize: "1.3rem",
              color: "var(--mantine-primary-color-filled, #228be6)",
            }}
          />
          <Text fw={700} size="lg">
            עוזר AI - אוטופיה
          </Text>
        </Group>
      }
      styles={{
        header: {
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          padding: "1rem 1.5rem",
        },
        body: {
          padding: "1.5rem",
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Stack align="center" gap="md">
        <Box
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "var(--mantine-primary-color-light, #e7f5ff)",
            color: "var(--mantine-primary-color-filled, #228be6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="ph-sparkle-fill" style={{ fontSize: "2.5rem" }} />
        </Box>
        <Text fw={700} size="xl" ta="center">
          עוזר הרכב החכם שלך
        </Text>
        <Text c="dimmed" size="sm" ta="center" maw={400}>
          כאן תוכל לשאול שאלות על ספר הרכב, תחזוקה שוטפת, נורות אזהרה וטיפולים
          קרובים.
        </Text>
        <Button variant="light" onClick={onClose} radius="md" mt="sm">
          סגור
        </Button>
      </Stack>
    </Modal>
  );
}

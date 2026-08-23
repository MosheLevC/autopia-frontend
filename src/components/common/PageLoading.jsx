import { Center, Loader, Stack, Text } from "@mantine/core";

export default function PageLoading({ message = "טוען...", height = 300 }) {
  return (
    <Center h={height}>
      <Stack align="center" gap="sm">
        <Loader size="lg" />
        {message && (
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        )}
      </Stack>
    </Center>
  );
}

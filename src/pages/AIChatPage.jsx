import { Box, Center, Container, Loader, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import AIChatEmptyState from "../components/AIChat/AIChatEmptyState";
import AIComposer from "../components/AIChat/AIComposer";
import AIMessageList from "../components/AIChat/AIMessageList";
import VehicleContextBanner from "../components/AIChat/VehicleContextBanner";
import NoVehicleSelected from "../components/NoVehicleSelected";
import { useHeaderTitle } from "../context/HeaderContext";
import useAIChat from "../hooks/useAIChat";
import { useVehicleStore } from "../stores/VehicleStoreContext";

const AIChatPage = observer(function AIChatPage() {
  useHeaderTitle("עוזר AI");

  const vehicleStore = useVehicleStore();
  const activeVehicle = vehicleStore.activeVehicle;
  const {
    messages,
    isResponding,
    sendMessage,
    clearConversation,
  } = useAIChat({ vehicle: activeVehicle });

  if (vehicleStore.isLoading && vehicleStore.vehicles.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            טוען את פרטי הרכב...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!activeVehicle) {
    return (
      <NoVehicleSelected
        title="צריך רכב כדי להתחיל שיחה"
        description="העוזר של Autopia מתייחס לרכב הפעיל שלך. הוסף רכב כדי להתחיל לשאול שאלות."
        icon="ph-chat-circle-dots"
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon="ph-plus"
      />
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <Container size={900} px={0} w="100%">
      <Box className="ai-chat-page" w="100%" miw={0}>
        <Stack h="100%" gap="sm" style={{ overflow: "hidden" }}>
          <VehicleContextBanner
            vehicle={activeVehicle}
            showClear={hasMessages || isResponding}
            onClear={clearConversation}
          />

          <Box style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            {hasMessages || isResponding ? (
              <AIMessageList
                messages={messages}
                isResponding={isResponding}
              />
            ) : (
              <AIChatEmptyState
                vehicle={activeVehicle}
                onSuggestionSelect={sendMessage}
              />
            )}
          </Box>

          <AIComposer onSend={sendMessage} isResponding={isResponding} />
        </Stack>
      </Box>
    </Container>
  );
});

export default AIChatPage;

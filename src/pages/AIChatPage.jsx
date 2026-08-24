import { Box, Center, Container, Loader, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { ChatCircleDots, Plus } from "@phosphor-icons/react";
import AIChatEmptyState from "../components/AIChat/AIChatEmptyState";
import AIComposer from "../components/AIChat/AIComposer";
import AIConversationHistory from "../components/AIChat/AIConversationHistory";
import AIMessageList from "../components/AIChat/AIMessageList";
import VehicleContextBanner from "../components/AIChat/VehicleContextBanner";
import NoVehicleSelected from "../components/NoVehicleSelected";
import { useHeaderTitle } from "../hooks/useHeader";
import useAIChat from "../hooks/useAIChat";
import useAIConversationHistory from "../hooks/useAIConversationHistory";
import { useVehicleStore } from "../stores";


const AIChatPage = observer(function AIChatPage() {
  useHeaderTitle("עוזר AI");

  const vehicleStore = useVehicleStore();
  const activeVehicle = vehicleStore.activeVehicle;
  const activeVehicleId = activeVehicle?._id || activeVehicle?.id || null;
  const [historyOpened, { open: openHistory, close: closeHistory }] =
    useDisclosure(false);
  const {
    activeConversationId,
    conversations,
    deleteConversation: deleteStoredConversation,
    loadConversation: getStoredConversation,
    refreshConversations,
    sendMessage: sendStoredMessage,
    startNewConversation,
  } = useAIConversationHistory({ vehicleId: activeVehicleId });
  const {
    messages,
    isResponding,
    sendMessage,
    clearConversation,
    loadConversation: loadChatConversation,
  } = useAIChat({ vehicle: activeVehicle, sendTurn: sendStoredMessage });

  const handleOpenHistory = () => {
    void refreshConversations();
    openHistory();
  };

  const handleConversationSelect = async (conversationId) => {
    const conversation = await getStoredConversation(conversationId);
    if (!conversation) return;

    closeHistory();
    loadChatConversation(conversation.messages);
  };

  const handleNewConversation = () => {
    startNewConversation();
    clearConversation();
  };

  const handleConversationDelete = async (conversationId) => {
    const result = await deleteStoredConversation(conversationId);
    if (!result.deleted) return false;

    if (result.wasActive) {
      closeHistory();
      clearConversation();
    }

    return true;
  };

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
        icon={ChatCircleDots}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
      />
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <Container size={900} px={0} w="100%" h="100%">
      <Box className="ai-chat-page" w="100%" miw={0}>
        <Stack h="100%" gap="sm" style={{ overflow: "hidden" }}>
          <VehicleContextBanner
            vehicle={activeVehicle}
            showClear={hasMessages || isResponding}
            onClear={handleNewConversation}
            onOpenHistory={handleOpenHistory}
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

      <AIConversationHistory
        opened={historyOpened}
        onClose={closeHistory}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onConversationDelete={handleConversationDelete}
      />
    </Container>
  );
});

export default AIChatPage;

import { ActionIcon, Box, Flex, Menu, Text, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router";
import { useHeader } from "../context/HeaderContext";
import { useAuth } from "../stores/AuthStoreContext";

export default function Header() {
  const { title } = useHeader();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      bg="white"
      h={64}
      px="md"
      bdb="1px solid var(--mantine-color-gray-2)"
      shadow="xs"
      style={{ zIndex: 100 }}
    >
      <Flex
        align="center"
        justify="space-between"
        h="100%"
        w="100%"
        maw={1200}
        mx="auto"
      >
        <Flex align="center" justify="flex-start" w={44}>
          <Menu position="bottom-start" offset={8} width={180} shadow="md">
            <Menu.Target>
              <Tooltip label="פרופיל משתמש" position="bottom" withArrow>
                <ActionIcon
                  variant="default"
                  size={44}
                  radius="xl"
                  aria-label="פתיחת תפריט משתמש"
                  c="gray.7"
                  bd="1px solid var(--mantine-color-gray-3)"
                >
                  <i className="ph-user" style={{ fontSize: "1.25rem" }} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown dir="rtl">
              <Menu.Item onClick={() => navigate("/profile")}>
                הפרופיל שלי
              </Menu.Item>
              <Menu.Item color="red" onClick={handleLogout}>
                התנתקות
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Flex align="center" justify="center" style={{ flex: 1 }}>
          {title ? (
            <Text
              fw={700}
              size="lg"
              c="gray.9"
              style={{
                letterSpacing: "-0.01em",
                userSelect: "none",
              }}
            >
              {title}
            </Text>
          ) : null}
        </Flex>

        <Box w={44} />
      </Flex>
    </Box>
  );
}

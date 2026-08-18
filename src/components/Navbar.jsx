import { useLocation, useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import Logo from "./Logo";
import AIChat from "./AIChat";
import { useVehicleStore } from "../stores/VehicleStoreContext";

const NAV_ITEMS = [
  {
    id: "home",
    label: "בית",
    icon: "ph-house",
    activeIcon: "ph-house-fill",
    getPath: () => "/home",
    isActive: (path) => path === "/home",
  },
  {
    id: "vehicles",
    label: "הרכבים שלי",
    icon: "ph-car",
    activeIcon: "ph-car-fill",
    getPath: () => "/vehicles",
    isActive: (path) =>
      path === "/vehicles" ||
      path === "/vehicles/add" ||
      (path.startsWith("/vehicles/") &&
        !path.includes("/maintenances") &&
        !path.includes("/reminders")),
  },
  {
    id: "reminders",
    label: "תזכורות",
    icon: "ph-bell",
    activeIcon: "ph-bell-fill",
    getPath: (activeVehicle) => {
      const id = activeVehicle?._id;
      return id ? `/vehicles/${id}/reminders` : "/reminders";
    },
    isActive: (path) => path.includes("/reminders"),
  },
  {
    id: "maintenances",
    label: "יומן טיפולים",
    icon: "ph-calendar-blank",
    activeIcon: "ph-calendar-check-fill",
    getPath: (activeVehicle) => {
      const id = activeVehicle?._id;
      return id ? `/vehicles/${id}/maintenances` : "/maintenances";
    },
    isActive: (path) => path.includes("/maintenances"),
  },
];

const Navbar = observer(function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicleStore = useVehicleStore();
  const [aiModalOpened, { open: openAiModal, close: closeAiModal }] =
    useDisclosure(false);

  const activeVehicle = vehicleStore.activeVehicle;

  const handleNavClick = (item) => {
    const targetPath = item.getPath(activeVehicle);
    navigate(targetPath);
  };

  const rightItems = NAV_ITEMS.slice(0, 2);
  const leftItems = NAV_ITEMS.slice(2, 4);

  return (
    <>
      <Box
        component="aside"
        display={{ base: "none", sm: "flex" }}
        w={260}
        h="100vh"
        pos="sticky"
        top={0}
        bg="white"
        p="md"
        bdl="1px solid var(--mantine-color-gray-2)"
        style={{
          flexShrink: 0,
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 90,
        }}
      >
        <Stack gap="xl">
          <UnstyledButton
            onClick={() => navigate("/home")}
            px="xs"
            py="xs"
            style={{ borderRadius: "8px" }}
          >
            <Logo showText size={36} />
          </UnstyledButton>

          <Stack gap="xs">
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(location.pathname);
              return (
                <UnstyledButton
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  px="lg"
                  py={14}
                  className={`navbar-desktop-link ${active ? "is-active" : ""}`}
                >
                  <Group justify="flex-start" gap="md" wrap="nowrap">
                    <i
                      className={active ? item.activeIcon : item.icon}
                      style={{
                        fontSize: "1.45rem",
                        color: active
                          ? "var(--mantine-primary-color-filled, #228be6)"
                          : "var(--mantine-color-gray-7)",
                      }}
                    />
                    <Text
                      size="md"
                      fw={active ? 700 : 500}
                      c={
                        active
                          ? "var(--mantine-primary-color-filled, #228be6)"
                          : "var(--mantine-color-gray-8)"
                      }
                      style={{ userSelect: "none" }}
                    >
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}
          </Stack>
        </Stack>

        <Box pt="md">
          <Button
            fullWidth
            size="lg"
            radius="lg"
            h={50}
            fw={700}
            onClick={openAiModal}
            leftSection={
              <i
                className="ph-sparkle-fill"
                style={{ fontSize: "1.35rem", color: "white" }}
              />
            }
            shadow="sm"
            style={{
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
          >
            עוזר AI
          </Button>
        </Box>
      </Box>

      <Box
        component="nav"
        display={{ base: "block", sm: "none" }}
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        style={{
          zIndex: 100,
          userSelect: "none",
        }}
      >
        <Box pos="relative" w="100%" h={72} bg="white" shadow="md">
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            h={22}
            style={{ pointerEvents: "none", zIndex: 1 }}
          >
            <Flex align="flex-start" justify="space-between" w="100%">
              <Box
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "var(--mantine-color-gray-2)",
                }}
              />
              <Box style={{ width: 84, height: 22, flexShrink: 0 }}>
                <svg
                  width="84"
                  height="22"
                  viewBox="0 0 84 22"
                  fill="none"
                  style={{ display: "block" }}
                >
                  <path
                    d="M 0 0.5 C 18 0.5 24 20 42 20 C 60 20 66 0.5 84 0.5"
                    stroke="var(--mantine-color-gray-2)"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </Box>
              <Box
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "var(--mantine-color-gray-2)",
                }}
              />
            </Flex>
          </Box>

          <Flex
            align="center"
            justify="space-between"
            h="100%"
            px="xs"
            pos="relative"
          >
            <Flex align="center" justify="space-around" style={{ flex: 1 }}>
              {rightItems.map((item) => {
                const active = item.isActive(location.pathname);
                return (
                  <UnstyledButton
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    p={4}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 56,
                    }}
                  >
                    <i
                      className={active ? item.activeIcon : item.icon}
                      style={{
                        fontSize: "1.4rem",
                        color: active
                          ? "var(--mantine-primary-color-filled, #228be6)"
                          : "var(--mantine-color-gray-6)",
                      }}
                    />
                    <Text
                      size="xs"
                      fw={active ? 700 : 500}
                      c={
                        active
                          ? "var(--mantine-primary-color-filled, #228be6)"
                          : "var(--mantine-color-gray-6)"
                      }
                      mt={2}
                    >
                      {item.label}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </Flex>

            <Box
              style={{
                width: 84,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: -22,
                flexShrink: 0,
                position: "relative",
                zIndex: 10,
              }}
            >
              <UnstyledButton
                onClick={openAiModal}
                aria-label="עוזר AI"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "var(--mantine-primary-color-filled, #228be6)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 4px 14px 0 rgba(34, 139, 230, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)",
                  transition: "transform 150ms ease",
                }}
              >
                <i
                  className="ph-sparkle-fill"
                  style={{ fontSize: "1.6rem", color: "#ffffff" }}
                />
              </UnstyledButton>
              <Text
                size="xs"
                fw={600}
                c="var(--mantine-color-gray-7)"
                mt={4}
                style={{ lineHeight: 1 }}
              >
                עוזר AI
              </Text>
            </Box>

            <Flex align="center" justify="space-around" style={{ flex: 1 }}>
              {leftItems.map((item) => {
                const active = item.isActive(location.pathname);
                return (
                  <UnstyledButton
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    p={4}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 56,
                    }}
                  >
                    <i
                      className={active ? item.activeIcon : item.icon}
                      style={{
                        fontSize: "1.4rem",
                        color: active
                          ? "var(--mantine-primary-color-filled, #228be6)"
                          : "var(--mantine-color-gray-6)",
                      }}
                    />
                    <Text
                      size="xs"
                      fw={active ? 700 : 500}
                      c={
                        active
                          ? "var(--mantine-primary-color-filled, #228be6)"
                          : "var(--mantine-color-gray-6)"
                      }
                      mt={2}
                    >
                      {item.label}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </Flex>
          </Flex>
        </Box>
      </Box>

      <AIChat opened={aiModalOpened} onClose={closeAiModal} />
    </>
  );
});

export default Navbar;

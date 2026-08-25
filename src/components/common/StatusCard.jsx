import React from "react";
import { Button, Card, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";

export default function StatusCard({
  icon: Icon,
  iconColor = "gray",
  iconSize = 32,
  iconThemeSize = 64,
  iconVariant = "light",
  title,
  titleOrder = 4,
  titleSize,
  description,
  action,
  actions,
  children,
  variant = "card",
  bg,
  p,
  py = "lg",
  gap = "md",
  maw = 420,
  ...cardProps
}) {
  const ContainerComponent = variant === "paper" ? Paper : Card;
  const defaultBg = variant === "paper" ? (bg || "gray.0") : (bg || "white");
  const defaultRadius = variant === "paper" ? "lg" : "xl";
  const defaultPadding = p !== undefined ? p : (variant === "paper" ? "md" : "xl");

  const renderSection = (section, IconComp, iconSize, iconWeight) => {
    if (React.isValidElement(section)) return section;
    if (typeof section === "function") {
      const SectionComp = section;
      return <SectionComp size={iconSize} weight={iconWeight} aria-hidden="true" />;
    }
    if (IconComp) return <IconComp size={iconSize} weight={iconWeight} aria-hidden="true" />;
    return undefined;
  };

  return (
    <ContainerComponent
      withBorder
      radius={defaultRadius}
      shadow={variant === "card" ? "xs" : undefined}
      p={defaultPadding}
      bg={defaultBg}
      ta="center"
      w="100%"
      {...cardProps}
    >
      <Stack align="center" justify="center" gap={gap} py={py} ta="center" h="100%">
        {Icon && (
          <ThemeIcon
            size={iconThemeSize}
            radius="xl"
            variant={iconVariant}
            color={iconColor}
          >
            <Icon size={iconSize} aria-hidden="true" />
          </ThemeIcon>
        )}

        {(title || description) && (
          <Stack gap={4} align="center">
            {title && (
              <Title order={titleOrder} size={titleSize} fw={700} c="gray.9">
                {title}
              </Title>
            )}
            {description && (
              <Text size="sm" c="dimmed" maw={maw}>
                {description}
              </Text>
            )}
          </Stack>
        )}

        {children}

        {action && (
          <Button
            variant={action.variant || "light"}
            color={action.color}
            size={action.size}
            radius={action.radius || "md"}
            onClick={action.onClick}
            visibleFrom={action.visibleFrom}
            hiddenFrom={action.hiddenFrom}
            leftSection={renderSection(
              action.leftSection,
              action.icon,
              action.iconSize || 18,
              action.iconWeight
            )}
            rightSection={renderSection(
              action.rightSection,
              action.rightIcon,
              action.iconSize || 18,
              action.iconWeight
            )}
            loading={action.loading}
            disabled={action.disabled}
            mt="xs"
          >
            {action.label}
          </Button>
        )}

        {actions && (
          <Group gap="xs" justify="center" mt="xs">
            {actions}
          </Group>
        )}
      </Stack>
    </ContainerComponent>
  );
}

import React from "react";
import { Badge, Button, Group, ThemeIcon, Title } from "@mantine/core";

export default function SectionHeader({
  icon: Icon,
  iconColor = "blue",
  iconSize = 20,
  iconThemeSize = 36,
  title,
  titleId,
  titleOrder = 2,
  titleSize = "h3",
  badge,
  action,
  actions,
  children,
  mb,
}) {
  const renderSection = (section, IconComp, iconSize) => {
    if (React.isValidElement(section)) return section;
    if (typeof section === "function") {
      const SectionComp = section;
      return <SectionComp size={iconSize} aria-hidden="true" />;
    }
    if (IconComp) return <IconComp size={iconSize} aria-hidden="true" />;
    return undefined;
  };

  return (
    <Group justify="space-between" align="center" wrap="nowrap" gap="sm" mb={mb}>
      <Group gap="xs" align="center" wrap="nowrap" miw={0}>
        {Icon && (
          <ThemeIcon
            size={iconThemeSize}
            radius="md"
            variant="light"
            color={iconColor}
            shrink={0}
          >
            <Icon size={iconSize} aria-hidden="true" />
          </ThemeIcon>
        )}
        {title && (
          <Title
            id={titleId}
            order={titleOrder}
            size={titleSize}
            fw={700}
            c="gray.9"
            truncate
          >
            {title}
          </Title>
        )}
      </Group>

      <Group gap="sm" align="center" wrap="nowrap" shrink={0}>
        {badge && (
          typeof badge === "string" || typeof badge === "number" ? (
            <Badge variant="light" color="gray" size="lg" radius="md">
              {badge}
            </Badge>
          ) : badge
        )}

        {children}

        {action && (
          <Button
            variant={action.variant || "subtle"}
            color={action.color}
            size={action.size || "compact-sm"}
            radius={action.radius}
            onClick={action.onClick}
            visibleFrom={action.visibleFrom}
            hiddenFrom={action.hiddenFrom}
            leftSection={renderSection(
              action.leftSection,
              action.icon,
              action.iconSize || 16
            )}
            rightSection={renderSection(
              action.rightSection,
              action.rightIcon,
              action.iconSize || 16
            )}
          >
            {action.label}
          </Button>
        )}

        {actions}
      </Group>
    </Group>
  );
}

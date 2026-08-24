import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";
import StatusCard from "./StatusCard";

export default function LoadErrorCard({
  title = "שגיאה בטעינת הנתונים",
  error,
  onRetry,
}) {
  return (
    <StatusCard
      icon={WarningCircle}
      iconColor="red"
      iconSize={28}
      iconThemeSize={48}
      title={title}
      titleOrder={3}
      titleSize="h4"
      description={error}
      gap="sm"
      action={
        onRetry
          ? {
              label: "נסה שוב",
              onClick: onRetry,
              icon: ArrowClockwise,
              variant: "light",
              color: "red",
            }
          : undefined
      }
    />
  );
}

import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import StatusCard from "./StatusCard";

export default function NotFoundCard({
  title = "הפריט לא נמצא",
  description = "הפריט המבוקש אינו קיים או שנמחק.",
  backLabel = "חזרה",
  onBack,
}) {
  return (
    <StatusCard
      icon={WarningCircle}
      iconColor="red"
      title={title}
      description={description}
      action={
        onBack
          ? {
              label: backLabel,
              onClick: onBack,
              icon: ArrowRight,
              variant: "light",
            }
          : undefined
      }
    />
  );
}

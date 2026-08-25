import { Center, Container } from "@mantine/core";
import { useNavigate } from "react-router";
import { Car, Plus } from "@phosphor-icons/react";
import StatusCard from "./common/StatusCard";

export default function NoVehicleSelected({
  title = "עדיין לא הוספת רכב",
  description = "הוספת רכב תאפשר לך לראות כאן את כל הפרטים החשובים.",
  icon: Icon = Car,
  actionLabel = "הוספת רכב",
  actionPath = "/vehicles/add",
  actionIcon: ActionIconComponent = Plus,
}) {
  const navigate = useNavigate();

  return (
    <Container size="sm" py="xl" w="100%">
      <Center>
        <StatusCard
          maw={480}
          icon={Icon}
          iconSize={35}
          iconThemeSize={72}
          title={title}
          titleOrder={3}
          description={description}
          action={{
            label: actionLabel,
            onClick: () => navigate(actionPath),
            icon: ActionIconComponent,
            iconSize: 18,
            iconWeight: "bold",
            size: "md",
            radius: "xl",
            variant: "filled",
          }}
        />
      </Center>
    </Container>
  );
}

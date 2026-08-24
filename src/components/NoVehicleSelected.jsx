import { Center, Container } from "@mantine/core";
import { useNavigate } from "react-router";
import { Car } from "@phosphor-icons/react";
import StatusCard from "./common/StatusCard";

export default function NoVehicleSelected({
  title = "לא נבחר רכב",
  description = "לא ניתן להציג את המידע מכיוון שלא נבחר רכב.",
  icon: Icon = Car,
  actionLabel = "לרכבים שלי",
  actionPath = "/vehicles",
  actionIcon: ActionIconComponent = Car,
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
            size: "md",
            radius: "lg",
            variant: "filled",
          }}
        />
      </Center>
    </Container>
  );
}

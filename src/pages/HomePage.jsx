import { Container, Stack } from "@mantine/core";
import { useHeaderTitle } from "../context/HeaderContext";
import ActiveVehicleSection from "../components/ActiveVehicleSection";
import MileageCard from "../components/MileageCard";

export default function HomePage() {
  useHeaderTitle("ראשי");

  return (
    <Container size="lg" px={0}>
      <Stack gap="lg">
        <ActiveVehicleSection />
        <MileageCard />
      </Stack>
    </Container>
  );
}

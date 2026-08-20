import { Container, Stack } from "@mantine/core";
import { useHeaderTitle } from "../context/HeaderContext";
import ActiveVehicleSection from "../components/ActiveVehicleSection";
import MileageCard from "../components/MileageCard";

export default function HomePage() {
  useHeaderTitle("ראשי");

  return (
    <Container size="lg" px={0} w="100%">
      <Stack gap="lg" w="100%">
        <ActiveVehicleSection />
        <MileageCard />
      </Stack>
    </Container>
  );
}

import { Container } from "@mantine/core";
import { useHeaderTitle } from "../context/HeaderContext";
import ActiveVehicleSection from "../components/ActiveVehicleSection";

export default function HomePage() {
  useHeaderTitle("ראשי");

  return (
    <Container size="lg" px={0}>
      <ActiveVehicleSection />
    </Container>
  );
}

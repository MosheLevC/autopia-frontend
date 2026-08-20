import { Container, Grid, Stack } from "@mantine/core";
import { useHeaderTitle } from "../context/HeaderContext";
import ActiveVehicleSection from "../components/ActiveVehicleSection";
import MileageCard from "../components/MileageCard";
import RemindersPlaceholderCard from "../components/RemindersPlaceholderCard";
import RecentMaintenanceSection from "../components/RecentMaintenanceSection";

export default function HomePage() {
  useHeaderTitle("ראשי");

  return (
    <Container size="lg" px={0} w="100%">
      <Stack gap="lg" w="100%">
        <ActiveVehicleSection />
        <MileageCard />
        <Grid gutter="lg" w="100%">
          <Grid.Col
            span={{ base: 12, md: 6 }}
            order={{ base: 1, md: 2 }}
            style={{ display: "grid" }}
          >
            <RemindersPlaceholderCard />
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, md: 6 }}
            order={{ base: 2, md: 1 }}
            style={{ display: "grid" }}
          >
            <RecentMaintenanceSection />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

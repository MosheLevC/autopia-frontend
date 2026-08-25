import { Box } from "@mantine/core";
import LandingHeader from "../components/Landing/LandingHeader";
import LandingHero from "../components/Landing/LandingHero";
import LandingFeatures from "../components/Landing/LandingFeatures";
import LandingSteps from "../components/Landing/LandingSteps";
import LandingCta from "../components/Landing/LandingCta";

export default function LandingPage() {
  return (
    <Box bg="#fdfbf6" style={{ minHeight: "100dvh" }} dir="rtl">
      <LandingHeader />

      <LandingHero />

      <LandingFeatures />

      <LandingSteps />

      <LandingCta />
    </Box>
  );
}

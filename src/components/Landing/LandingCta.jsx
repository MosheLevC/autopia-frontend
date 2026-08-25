import { Link } from "react-router";
import { Box, Button, Container, Text, Title } from "@mantine/core";
import { ArrowLeft } from "@phosphor-icons/react";
import classes from "./Landing.module.css";

export default function LandingCta() {
  return (
    <Box component="section" className={classes.cta}>
      <Container size="md" px="md" py={{ base: 48, sm: 72 }} ta="center">
        <Title order={2} className={classes.ctaTitle}>
          מוכנים להתחיל?
        </Title>

        <Text className={classes.ctaDescription} size="lg" mt="md">
          פותחים חשבון, מוסיפים את הרכב הראשון — ומשם הכול מסודר במקום אחד.
        </Text>

        <Button
          component={Link}
          to="/auth"
          variant="white"
          size="lg"
          radius="xl"
          mt="xl"
          px="xl"
          leftSection={<ArrowLeft size={20} weight="bold" />}
        >
          התחילו עכשיו
        </Button>
      </Container>
    </Box>
  );
}

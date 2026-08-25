import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { BellRinging, Sparkle, Garage, Wrench } from "@phosphor-icons/react";
import classes from "./Landing.module.css";

const FEATURES = [
  {
    icon: Garage,
    title: "המוסך שלי",
    description:
      "ניהול כמה רכבים בחשבון אחד, עם רכב פעיל שמרכז את כל המידע במסך הבית.",
  },
  {
    icon: Sparkle,
    title: "עוזר AI",
    description:
      "שאלות על תחזוקה, נורות אזהרה ונושאים כלליים — עם תשובות בהקשר של הרכב שלכם.",
  },
  {
    icon: Wrench,
    title: "יומן טיפולים",
    description:
      "טיפולים תקופתיים, תיקונים והחלפות — כולל החלקים שהוחלפו והעלות של כל ביקור.",
  },
  {
    icon: BellRinging,
    title: "תזכורות",
    description:
      "טסט שנתי וביטוח רכב, עם התראה מבעוד מועד ואפשרות לחדש בלחיצה אחת.",
  },
];

export default function LandingFeatures() {
  return (
    <Container component="section" size="lg" px="md" py={{ base: 48, sm: 72 }}>
      <Group justify="center">
        <Badge variant="light" size="lg" radius="xl">
          ניהול רכב חכם
        </Badge>
      </Group>

      <Title order={2} className={classes.sectionTitle} ta="center" mt="sm">
        כל הניהול של הרכב, בלי אקסלים ובלי לחפש קבלות
      </Title>

      <Text
        c="dimmed"
        className={classes.sectionDescription}
        ta="center"
        mt="md"
      >
        במקום תיקייה בתא הכפפות ותזכורות מפוזרות ביומן — הכול מרוכז במקום אחד,
        מעודכן ונגיש מכל מכשיר.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mt={50}>
        {FEATURES.map((feature) => {
          const FeatureIcon = feature.icon;
          return (
            <Card
              key={feature.title}
              className={classes.featureCard}
              shadow="md"
              radius="lg"
              padding="xl"
            >
              <FeatureIcon
                size={44}
                weight="duotone"
                color="var(--mantine-color-blue-6)"
              />

              <Text
                fz="lg"
                fw={700}
                className={classes.featureCardTitle}
                mt="md"
              >
                {feature.title}
              </Text>

              <Text fz="sm" c="dimmed" mt="sm" style={{ lineHeight: 1.6 }}>
                {feature.description}
              </Text>
            </Card>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}

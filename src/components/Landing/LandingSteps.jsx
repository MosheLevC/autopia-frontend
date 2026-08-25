import { Box, Container, SimpleGrid, Text, ThemeIcon, Title } from "@mantine/core";
import classes from "./Landing.module.css";

const STEPS = [
  {
    title: "מוסיפים רכב",
    description:
      "מזינים מספר רישוי, והפרטים נמשכים אוטומטית ממאגר הרכב הממשלתי.",
  },
  {
    title: "מתעדים טיפולים",
    description:
      "כל ביקור במוסך נשמר ביומן, עם החלקים שהוחלפו והעלות של הטיפול.",
  },
  {
    title: "שואלים את העוזר",
    description:
      "עוזר AI שמכיר את הרכב שלכם ועונה על שאלות תחזוקה, נורות אזהרה ועוד.",
  },
];

export default function LandingSteps() {
  return (
    <Box component="section">
      <Container size="lg" px="md" py={{ base: 48, sm: 72 }}>
        <Title order={2} className={classes.sectionTitle} ta="center">
          איך זה עובד?
        </Title>

        <Text c="dimmed" className={classes.sectionDescription} ta="center" mt="md">
          שלושה צעדים קצרים להקמה, ומשם הרכב שלכם מנוהל במקום אחד.
        </Text>

        <SimpleGrid
          cols={{ base: 1, sm: 3 }}
          spacing={{ base: "xl", md: 50 }}
          verticalSpacing="xl"
          mt={50}
        >
          {STEPS.map((step, index) => (
            <div key={step.title}>
              <ThemeIcon size={48} radius="xl" variant="light">
                <Text fz="lg" fw={700}>
                  {index + 1}
                </Text>
              </ThemeIcon>

              <Text fz="lg" fw={700} mt="sm" mb={7}>
                {step.title}
              </Text>

              <Text fz="sm" c="dimmed" lh={1.6}>
                {step.description}
              </Text>
            </div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

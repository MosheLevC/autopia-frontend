import { Link } from "react-router";
import {
  Box,
  Button,
  Container,
  Group,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import heroCarImage from "../../images/long/car_blue.png";
import classes from "./Landing.module.css";

const BULLETS = [
  {
    title: "הוספה בקליק",
    description: "מזינים מספר רישוי, והפרטים נמשכים ממאגר הרכב הממשלתי.",
  },
  {
    title: "יומן טיפולים מלא",
    description: "כל טיפול, החלקים שהוחלפו והעלות — שמורים בנפרד לכל רכב.",
  },
  {
    title: "עוזר AI אישי",
    description: "שואלים בשפה חופשית ומקבלים תשובה בהקשר של הרכב שלכם.",
  },
];

export default function LandingHero() {
  return (
    <Box component="section">
      <Container size="lg" px="md">
        <div className={classes.heroInner}>
          <div className={classes.heroContent}>
            <Title className={classes.heroTitle}>
              כל מה שהרכב שלך צריך,{" "}
              <span className={classes.highlight}>במקום אחד</span>
            </Title>

            <Text c="dimmed" mt="md" size="lg">
              אוטופיה מרכזת את פרטי הרכב, יומן הטיפולים והתזכורות שלכם — כדי
              שתמיד תדעו מה מצב הרכב ומה מחכה בהמשך.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <Check size={12} weight="bold" />
                </ThemeIcon>
              }
            >
              {BULLETS.map((bullet) => (
                <List.Item key={bullet.title}>
                  <b>{bullet.title}</b> – {bullet.description}
                </List.Item>
              ))}
            </List>

            <Group mt={30}>
              <Button
                component={Link}
                to="/auth"
                size="md"
                radius="xl"
                className={classes.heroControl}
                leftSection={<ArrowLeft size={18} weight="bold" />}
              >
                התחילו עכשיו
              </Button>
            </Group>
          </div>

          <div
            className={classes.heroImage}
            aria-hidden="true"
            style={{ backgroundImage: `url("${heroCarImage}")` }}
          />
        </div>
      </Container>
    </Box>
  );
}

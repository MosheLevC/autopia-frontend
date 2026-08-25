import { Link } from "react-router";
import { Box, Button, Container, Group } from "@mantine/core";
import Logo from "../Logo";
import classes from "./Landing.module.css";

export default function LandingHeader() {
  return (
    <Box component="header" className={classes.header}>
      <Container size="lg" px="md">
        <Group className={classes.headerInner} justify="space-between" wrap="nowrap">
          <Logo size={36} showText />

          <Button
            component={Link}
            to="/auth"
            variant="default"
            size="md"
            radius="xl"
          >
            כניסה
          </Button>
        </Group>
      </Container>
    </Box>
  );
}

import { DateInput } from "@mantine/dates";

const DEFAULT_WEEKEND_DAYS = [5, 6];

export default function AppDateInput(props) {
  return (
    <DateInput
      w="100%"
      placeholder="DD/MM/YYYY"
      valueFormat="DD/MM/YYYY"
      locale="he"
      firstDayOfWeek={0}
      weekendDays={DEFAULT_WEEKEND_DAYS}
      leftSection={<i className="ph-calendar" aria-hidden="true" />}
      leftSectionPointerEvents="none"
      clearButtonProps={{ "aria-label": "ניקוי תאריך" }}
      styles={{
        input: { direction: "ltr" },
        weekday: { textAlign: "center" },
      }}
      {...props}
    />
  );
}

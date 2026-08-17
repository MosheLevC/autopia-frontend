import { useHeaderTitle } from "../context/HeaderContext";

export default function HomePage() {
  useHeaderTitle("ראשי");

  return <div>HomePage</div>;
}

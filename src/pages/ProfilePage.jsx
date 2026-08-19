import { useEffect } from "react";
import { Container } from "@mantine/core";
import { observer } from "mobx-react-lite";
import UserProfile from "../components/UserProfile";
import { useHeaderTitle } from "../context/HeaderContext";
import { useAuth } from "../stores/AuthStoreContext";

const ProfilePage = observer(function ProfilePage() {
  useHeaderTitle("הפרופיל שלי");
  const auth = useAuth();

  useEffect(() => {
    auth.refreshUserInfo().catch(() => {});
  }, [auth]);

  return (
    <Container size="md" px={0}>
      <UserProfile
        user={auth.user}
        isSaving={auth.isSubmitting}
        onSave={(profileData) => auth.updateUserInfo(profileData)}
      />
    </Container>
  );
});

export default ProfilePage;

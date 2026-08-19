import { useEffect, useState } from "react";
import { Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import ChangePasswordModal from "../components/ChangePasswordModal";
import UserProfile from "../components/UserProfile";
import { useHeaderTitle } from "../context/HeaderContext";
import { useAuth } from "../stores/AuthStoreContext";

const ProfilePage = observer(function ProfilePage() {
  useHeaderTitle("הפרופיל שלי");
  const auth = useAuth();
  const [
    passwordModalOpened,
    { open: openPasswordModal, close: closePasswordModal },
  ] = useDisclosure(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  useEffect(() => {
    auth.refreshUserInfo().catch(() => {});
  }, [auth]);

  const handleOpenPasswordModal = () => {
    setPasswordChangeSuccess(false);
    openPasswordModal();
  };

  return (
    <>
      <Container size="md" px={0}>
        <UserProfile
          user={auth.user}
          isSaving={auth.isSubmitting}
          passwordChangeSuccess={passwordChangeSuccess}
          onSave={(profileData) => auth.updateUserInfo(profileData)}
          onChangePassword={handleOpenPasswordModal}
          onStartEditing={() => setPasswordChangeSuccess(false)}
        />
      </Container>

      <ChangePasswordModal
        opened={passwordModalOpened}
        isSubmitting={auth.isChangingPassword}
        onClose={closePasswordModal}
        onSubmit={(passwordData) => auth.changePassword(passwordData)}
        onSuccess={() => setPasswordChangeSuccess(true)}
      />
    </>
  );
});

export default ProfilePage;

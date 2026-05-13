import NotificationsPage from "@/components/Users/HomePage/notification";
import Sidebar from "@/components/Users/NavbarUser";

export default function Profile() {
  return (
    <>
      <Sidebar>
        <NotificationsPage />
      </Sidebar>
    </>
  );
}

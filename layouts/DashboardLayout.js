import { useEffect, useState } from "react";
import { Segment, Sidebar } from "semantic-ui-react";
import Metadata from "../components/Metadata";
import DashboardSidebar from "../components/DashboardSidebar";
import PageHeader from "../components/PageHeader";
import { getCurrentPage, pages } from "../lib/pages";

export default function DashboardLayout({ children, user }) {
  const [ device, setDevice ] = useState("desktop");
  const currentPage = getCurrentPage(user.userType);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      let tempDevice = "desktop";

      if (e.target.innerWidth < 576) tempDevice = "mobile";
      else if (e.target.innerWidth < 768) tempDevice = "tablet";

      if (tempDevice !== device) setDevice(tempDevice);
    });
  })
  return (
    <>
      <Metadata title={currentPage.name} />
      <DashboardSidebar user={user} currentPage={currentPage.path} device={device} />
      <Sidebar.Pusher style={{ width: "calc(100% - 260px)", padding: "10px 20px" }}>
        <PageHeader heading={currentPage.name} subHeading={currentPage.subHeading} iconName={currentPage.iconName} />
        <Segment attached="bottom">
          <main>
            {children}
          </main>
        </Segment>
      </Sidebar.Pusher>
    </>
  );
}
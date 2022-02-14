import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Segment, Sidebar } from "semantic-ui-react";

import Metadata from "../components/Metadata";
import DashboardSidebar from "../components/DashboardSidebar";
import PageHeader from "../components/PageHeader";
import { pages } from "../lib/pages";

export default function DashboardLayout({ children, user }) {
  const [ device, setDevice ] = useState("desktop");
  const router = useRouter();
  const currentPage = pages[user.userType].find(page => {
    return (page.path === router.pathname)
  });

  useEffect(() => {
    window.addEventListener("resize", onWidthResize);
  })

  function onWidthResize(_e) {
    let tempDevice = "desktop";

    if (window.innerWidth < 576) tempDevice = "mobile";
    else if (window.innerWidth < 768) tempDevice = "tablet";

    if (tempDevice !== device) {
      setDevice(tempDevice);
    };
  }

  return (
    <>
      <Metadata title={currentPage.name} />
      <DashboardSidebar user={user} currentPage={currentPage.path} pages={pages} device={device} />
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
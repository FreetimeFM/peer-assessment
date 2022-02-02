import { useEffect, useState } from "react";

import { Sidebar } from "semantic-ui-react";

import DashboardSidebar from "../components/DashboardSidebar";
import PageHeader from "../components/PageHeader";

export default function DashboardLayout({ children, username, pages, currentPage, onDashboardSidebarPageClick }) {
  const { name, subHeading, iconName } = pages[currentPage];
  const [ device, setDevice ] = useState("desktop");

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
      <DashboardSidebar username={username} pages={pages} currentPage={currentPage} device={device} onPageClick={onDashboardSidebarPageClick} />
      <Sidebar.Pusher style={{ width: "calc(100% - 260px)", padding: "10px 20px" }}>
        <PageHeader heading={name} subHeading={subHeading} iconName={iconName} />
        <main>
          {children}
        </main>
      </Sidebar.Pusher>
    </>
  );
}
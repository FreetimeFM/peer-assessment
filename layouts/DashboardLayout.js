import { Sidebar } from "semantic-ui-react";

import DashboardSidebar from "../components/DashboardSidebar";
import PageHeader from "../components/PageHeader";

export default function DashboardLayout({ children, username, pages, currentPage, onDashboardSidebarPageClick }) {

  const { name, subHeading, iconName } = pages[currentPage];

  return (
    <>
      <DashboardSidebar username={username} pages={pages} currentPage={currentPage} isMobile={isMobile} onPageClick={onDashboardSidebarPageClick} />
      <Sidebar.Pusher style={{ width: "calc(100% - 260px)", padding: "10px 20px" }}>
        <PageHeader heading={name} subHeading={subHeading} iconName={iconName} />
        <main>
          {children}
        </main>
      </Sidebar.Pusher>
    </>
  );
}
import DashboardSidebar from "../components/DashboardSidebar"

// import { Row, Col, Container } from "reactstrap"
import { Sidebar } from "semantic-ui-react";
import PageHeader from "../components/PageHeader";

export default function DashboardLayout({ children, user, pages, currentPage, onDashboardSidebarPageClick }) {

  const { name, subHeading, iconName } = pages[currentPage];

  return (
    <>
        <PageHeader heading={name} subHeading={subHeading} iconName={iconName} />
        <main>
          {children}
        </main>
      </Sidebar.Pusher>
    </>
  );
}
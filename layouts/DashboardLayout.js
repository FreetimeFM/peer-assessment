import DashboardSidebar from "../components/DashboardSidebar"

// import { Row, Col, Container } from "reactstrap"
import { Sidebar } from "semantic-ui-react";

export default function DashboardLayout({children}) {

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
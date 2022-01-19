import DashboardSidebar from "../components/DashboardSidebar"

// import { Row, Col, Container } from "reactstrap"
import { Sidebar } from "semantic-ui-react";

export default function DashboardLayout({children}) {

  return (
    <>
      <DashboardSidebar name="Andrew Jackson" />
      <Sidebar.Pusher>
        <main style={{ padding: "5px" }}>
          {children}
        </main>
      </Sidebar.Pusher>
    </>
  );
}
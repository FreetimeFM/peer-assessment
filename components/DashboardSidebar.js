import { Sidebar, Menu, Icon } from "semantic-ui-react";
import useUser from "../lib/iron-session/useUser";
import fetchJson from "../lib/iron-session/fetchJson";
import { pages } from "../lib/pages";

/**
 * A component displayed on the left of the dashboard.
 */
export default function DashboardSidebar({ user, device, currentPage, visible = true }) {
  const { mutateUser } = useUser();
  let isMobile = (device === "mobile");

  return (
    <Sidebar
      as={Menu}
      direction={isMobile ? "bottom" : "left"}
      width={device === "tablet" ? "thin" : undefined}
      size={isMobile ? "huge" : undefined}
      visible={visible}
      vertical
    >
      <SidebarHeader
        username={user.name}
        visible={!isMobile}
        isTablet={device === "tablet"}
      />

      {
        pages[user.userType].map((page) =>
        <SidebarButton
          key={page.path}
          iconName={page.iconName}
          iconHidden={device === "tablet"}
          content={page.name}
          active={page.path === currentPage}
          path={page.path === currentPage ? null : page.path}
        />)
      }

      <Menu.Item as="a" onClick={async (e) => {
        e.preventDefault();
        mutateUser(
          await fetchJson("/api/logout", { method: "POST" }),
          false,
        );
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/";
      }}>
        { device === "tablet" ? null : <Icon name="log out" /> }
        Sign Out
      </Menu.Item>

    </Sidebar>
  );
}

function SidebarHeader({ visible, username, isTablet }) {
  if (visible) return (
    <Menu.Item style={{ marginBottom: 0 }}>
      { isTablet ? <h3>Peer Assessment System</h3> : <h2>Peer Assessment System</h2> }
      <h4 style={{ marginTop: 10 }}>Hello, {username}.</h4>
    </Menu.Item>
  )
  return null;
}

function SidebarButton({ iconName, iconHidden, content, active, path }) {
  return (
    <Menu.Item
      as="a"
      active={active}
      href={path}
    >
      {iconHidden ? null : <Icon name={iconName} />}
      {content}
    </Menu.Item>
  )
}
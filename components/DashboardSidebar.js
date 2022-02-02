import { Sidebar, Menu, Icon, MenuItem } from "semantic-ui-react";

import useUser from "../lib/iron-session/useUser";
import fetchJson from "../lib/iron-session/fetchJson";

export default function DashboardSidebar({ pages, currentPage, username, device, onPageClick, visible = true }) {
  const { mutateUser } = useUser();
  let isMobile = (device === "mobile");

  return (

      <SidebarHeader
        username={username}
        visible={!isMobile}
        isTablet={device === "tablet"}
      />

      {
        pages.map((page, index) =>
        <SidebarButton
          key={index}
          iconName={page.iconName}
          content={page.name}
          active={currentPage === index}
          onItemClick={_e => onPageClick(index)}
        />)
      }
      <Menu.Item as="a" color="primary" onClick={async (e) => {
        e.preventDefault();
        mutateUser(
          await fetchJson("/api/logout", { method: "POST" }),
          false,
        );
        sessionStorage.clear();
        location.href = "/";
      }}>
        <Icon name="log out" />
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

function SidebarButton({ iconName, iconHidden, content, active, onItemClick }) {
  return (
    <Menu.Item
      as="a"
      active={active}
      onClick={e => {
        e.preventDefault();
        onItemClick();
      }}
    >
      { iconHidden ? null : <Icon name={iconName} /> }
      {content}
    </Menu.Item>
  )
}
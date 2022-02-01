import { Sidebar, Menu, Icon, MenuItem } from "semantic-ui-react";

import useUser from "../lib/iron-session/useUser";
import fetchJson from "../lib/iron-session/fetchJson";

export default function DashboardSidebar({ pages, currentPage, user, onPageClick }) {
  const { mutateUser } = useUser();

  return (
    <Sidebar as={Menu} direction="left" vertical visible>
      <MenuItem style={{ marginBottom: 0 }}>
        <h2>Peer Assessment System</h2>
        <h4 style={{ marginTop: 10 }}>Hello, {user.name}.</h4>
      </MenuItem>
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

function SidebarButton({ iconName, content, active, onItemClick }) {
  return (
    <MenuItem
      as="a"
      active={active}
      onClick={e => {
        e.preventDefault();
        onItemClick();
      }}
    >
      <Icon name={iconName} />
      {content}
    </MenuItem>
  )
}
import React from 'react'

import { Sidebar, Menu, Icon, Header, Divider, MenuItem } from "semantic-ui-react";

const DashboardSidebar = ({name}) => {
  return (
    <Sidebar as={Menu} direction="left" vertical visible={true}>
      <MenuItem as="h2">
        Peer Assessment System
      </MenuItem>
      <Menu.Item as="a">
        <Icon name="home" />
        Home
      </Menu.Item>
      <Menu.Item as="a">
        <Icon name="log out" />
        Log out
      </Menu.Item>
    </Sidebar>
  );
}

export default DashboardSidebar

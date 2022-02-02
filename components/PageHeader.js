import { Header, Segment, Icon } from "semantic-ui-react";

export default function PageHeader({ iconName, heading, subHeading }) {
  return (
    <Segment>
      <Header as="h2" size="huge">
        <Icon name={iconName} />
        <Header.Content>
          {heading}
          <Header.Subheader
            content={subHeading}
          />
        </Header.Content>
      </Header>
    </Segment>
  );
}
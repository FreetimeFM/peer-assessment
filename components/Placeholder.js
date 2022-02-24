import { Segment, Header, Icon } from "semantic-ui-react"

export default function Placeholder({ message, iconName, extraContent = null }) {
  return (
    <Segment placeholder textAlign="center">
      <Header icon>
        <Icon name={iconName}/>
        {message}
      </Header>
      {extraContent}
    </Segment>
  )
}

export function placeholderTemplate(type) {

  switch (type) {

    default:
      return (
        <Placeholder
          message="Not Implemented."
          iconName="clock"
          extraContent={<p>This feature hasn't been implemented yet.</p>}
        />
      )
  }

}
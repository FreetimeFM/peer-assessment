import { Segment, Header, Icon } from "semantic-ui-react"

export default function PlaceHolder({ message, iconName, extraContent = null }) {
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

export function placeholderTemplate(type, message, extraContent) {
  switch (type) {
    case "fetch":
      return (
        <PlaceHolder
          iconName="cloud download"
          message={message ? message : "Fetching details"}
          extraContent={extraContent ? extraContent : "Please wait while we fetch your details."}
        />
      )

    case "error":
      return (
        <PlaceHolder
          iconName="exclamation"
          message={message ? message : "Error"}
          extraContent={extraContent ? extraContent : "Something went wrong. Please contact your adminstrator."}
        />
      )

    default:
      return (
        <PlaceHolder
          iconName="clock"
          message="Not Implemented."
          extraContent={<p>This feature hasn't been implemented yet.</p>}
        />
      )
  }

}
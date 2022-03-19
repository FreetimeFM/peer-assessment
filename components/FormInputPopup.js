import { Popup, Icon } from "semantic-ui-react"

export default function FormInputPopup({ message }) {
  return (
    <Popup
      trigger={<Icon name="help" size="small" bordered style={{ backgroundColor: "lightGrey" }} />}
      content={message}
      position="right center"
    />
  )
}
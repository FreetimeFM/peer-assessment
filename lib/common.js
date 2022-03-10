import { Header } from "semantic-ui-react";

// Parses text as string and returns HTML.
export function textToHTML(text) {
  if (!text || typeof text !== "string") return null;
  return text.split("\n").map(paragraph => {
    return <p>{paragraph}</p>
  })
}

// Gets UTC data and return local date according to the user's timezone.
export const getLocalDate = date => { return new Date(date).toLocaleString() };

// Accepts a list of question types returns a list of options for dropdown components.
export function getDropdownOptions(types) {
  return types.map((item, index) => {
    return {
      key: index,
      text: item.text,
      value: item.value,
      content: (
        <Header icon={item.iconName} content={item.text} subheader={item.description} />
      ),
      disabled: item.disabled,
    }
  })
}
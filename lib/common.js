import { Header } from "semantic-ui-react";

/**
 * Parses text as string and returns HTML paragraphs or null.
 * @param {String} text Any string element with newlines.
 * @returns Returns array of paragraph elements or null.
 */
export function textToHTML(text) {
  if (!text || typeof text !== "string") return null;
  return text.split("\n").map((paragraph, index) => {
    return <p key={index}>{paragraph}</p>
  })
}

/**
 * Gets UTC date and returns local date according to the user's timezone.
 * @param {Date} date The date and time.
 * @returns UTC date and time
 */
export const getLocalDate = date => { return new Date(date).toLocaleString() };

/**
 * Takes question type objects and returns array for use in dropdown component.
 * @param {QuestionType} types Accepts an array of QuestionType objects.
 * @returns Returns array of objects to pass into Dropdown component.
 */
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

/**
 * Gets and parses description into HTML.
 * @param {String} name The name of the description.
 * @param {String} description The actual description itself.
 * @returns Description parsed into HTML or "No {name} description given."
 */
function getDescription(name, description) {
  return description === undefined || description === "" ?
  `No ${name} description given.` :
  textToHTML(description)
}


export function textToHTML(text) {
  if (!text || typeof text !== "string") return null;
  return text.split("\n").map(paragraph => {
    return <p>{paragraph}</p>
  })
}

export const getLocalDate = date => { return new Date(date).toLocaleString() };


export function textToHTML(text) {
  return text.split("\n").map(paragraph => {
    return <p>{paragraph}</p>
  })
}

export const getLocalDate = date => { return new Date(date).toLocaleString() };
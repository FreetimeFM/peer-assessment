

export default function textToHTML(text) {
  return text.split("\n").map(paragraph => {
    return <p>{paragraph}</p>
  })
}
import { Header } from "semantic-ui-react";

export const questionTypes = [{
  key: 0,
  text: "Short Text",
  value: "short-text",
  content: (
    <Header icon="font" content="Short text" subheader="Students answer using text limited to a single line. Maximum 500 characters." />
  )
},
{
  key: 1,
  text: "Long Text",
  value: "long-text",
  content: (
    <Header icon="list" content="Long text" subheader="Students answer using text that can span multiple lines. Maximum 5000 characters." />
  )
},
{
  key: 2,
  text: "Single Selection",
  value: "dropdown",
  disabled: true,
  content: (
    <Header icon="caret square down" content="Single Selection" subheader="Students choose one answer out of many options." />
  )
},
{
  key: 3,
  text: "Multiple Selection",
  value: "multi-select",
  disabled: true,
  content: (
    <Header icon="check square" content="Multiple Selection" subheader="Students choose one or more answers out of one or many options." />
  )
},
{
  key: 4,
  text: "More Options",
  value: "more",
  disabled: true,
  content: (
    <Header icon="hourglass" content="More Options" subheader="More question types will be implemented soon." />
  )
}];
export function getQuestionTypeByValue(value) {
  return questionTypes.map(item => {
    if (item.value === value) return item;
  });
}

export function getMarkingQuestionsTypes() {
  console.log(questionTypes.map(item => {
    if (item.marking === true) return item;
  }))
}

export const questionTypes = [{
  text: "Short Text",
  value: "short-text",
  iconName: "font",
  description: "Answer using text limited to a single line. Maximum 200 characters.",
  maxLength: 200,
  marking: true,
},
{
  text: "Long Text",
  value: "long-text",
  iconName: "paragraph",
  description: "Answer using text that can span multiple lines. Maximum 5000 characters.",
  maxLength: 5000,
  marking: true,
},
{
  text: "Single Selection",
  value: "dropdown",
  iconName: "caret square down",
  description: "Choose one answer out of many options. This option has not been implemented yet.",
  maxLength: 10,
  marking: true,
  disabled: true,
},
{
  text: "Multiple Selection",
  value: "multi-select",
  iconName: "check square",
  description: "Choose one or more answers out of one or many options. This option has not been implemented yet.",
  maxLength: 10,
  marking: true,
  disabled: true,
},
{
  text: "File",
  value: "file",
  iconName: "file",
  description: "Upload a file. This option has not been implemented yet.",
  maxLength: 5,
  disabled: true,
},
{
  text: "More Options",
  value: "more",
  iconName: "hourglass",
  description: "More question types will be implemented soon.",
  maxLength: 5,
  marking: true,
  disabled: true,
}];
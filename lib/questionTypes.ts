/**
 * The type of question object.
 */
type QuestionType = {
  text: String,
  value: String,
  iconName?: String,
  description?: String,
  maxLength?: Number,
  marking?: Boolean,
  disabled?: Boolean
}

/**
 * Gets the details of the question by its identifier.
 * @param value The identifier of the question type.
 * @returns The QuestionType object with details about the question type.
 */
export function getQuestionTypeByValue(value: String): QuestionType {
  return questionTypes.find(item => item.value === value);
}

/**
 * Gets the details of question types that are suitable as marking criteria.
 * @returns Array of QuestionType objects.
 */
export function getMarkingQuestionsTypes(): Array<QuestionType> {
  return questionTypes.filter(item => item.marking);
}

/**
 * An array of question types.
 */
export const questionTypes: Array<QuestionType> = [{
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
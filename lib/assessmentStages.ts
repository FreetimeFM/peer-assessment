/**
 * The stage of the assessment and its details.
 */
type StageType = {
  name: String,
  value: String,
  teacherDescription: String,
  studentDescription?: String,
}

/**
 * The stages of the assessment and their details.
 */
export const stages: Array<StageType> = [
  {
    name: "Overview",
    value: "overview",
    teacherDescription: "Students will only be able to view details of the assessment in their dashboard.",
    studentDescription: "The assessment is not available yet."
  },
  {
    name: "Assessing",
    value: "assess",
    teacherDescription: "Students will only be able to view and answer the assessment questions.",
    studentDescription: "You will be able to answer the assessment questions."
  },
  {
    name: "Post Assessment",
    value: "post-assess",
    teacherDescription: "Same as the 'Overview' stage. This is a temporary stage to check answers.",
    studentDescription: "The assessment is not available to mark yet."
  },
  {
    name: "Marking",
    value: "mark",
    teacherDescription: "Students will only be able to mark their peers using the marking criteria.",
    studentDescription: "You will be able to mark your peers."
  },
  {
    name: "Post Marking",
    value: "post-mark",
    teacherDescription: "Same as the 'Overview' stage. This is a temporary stage to check responses.",
    studentDescription: "The assessment is not available for feedback yet."
  },
  {
    name: "Feedback",
    value: "feedback",
    teacherDescription: "Students will only be able to see feedback from you and other students.",
    studentDescription: "You will be able to view feedback from your peers and your teacher."
  },
]

/**
 * Gets the details of the assessment stage by its identifier.
 * @param value The identifier of the stage.
 * @returns The StageType object with details about the stage.
 */
export function getStageByValue(value: String): StageType {
  return stages.find(stage => stage.value === value);
}

/**
 * Gets the next stage.
 * @param currentValue The current stage.
 * @returns The StageType of the next stage or null is currentValue is the last stage.
 */
export function getNextStage(currentValue: String): StageType {
  if (isLastStage(currentValue)) return null;
  const index = stages.findIndex(stage => stage.value === currentValue);
  return stages[index + 1];
}

/**
 * Checks if the specified stage is the last assessment stage.
 * @param value The stage to check.
 * @returns True if the stage is the last stage otherwise false.
 */
export function isLastStage(value: String): Boolean {
  const index = stages.findIndex(stage => stage.value === value);
  if (index === -1) return true;
  return index === stages.length - 1 ? true : false;
}
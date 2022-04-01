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
  },
  {
    name: "Assessment",
    value: "assess",
    teacherDescription: "Students will only be able to view and answer the assessment questions.",
  },
  {
    name: "Marking",
    value: "mark",
    teacherDescription: "Students will only be able to mark their peers using the marking criteria.",
  },
  {
    name: "Closed",
    value: "closed",
    teacherDescription: "Students will only be able to mark their peers using the marking criteria.",
  },
  {
    name: "Feedback",
    value: "feedback",
    teacherDescription: "Students will only be able to see feedback from you and other students.",
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
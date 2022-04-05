import Link from "next/link"
import { Card, Button } from "semantic-ui-react"
import { useEffect, useState } from "react"

import { getStageByValue } from "lib/assessmentStages"
import { InfoModal } from "components/InfoModal"

export default function AssessmentCard({ details, teacher, assessmentRefID }) {
  const [buttonData, setButtonData] = useState(false);

  useEffect(() => {
    setButtonData(getButtonData(teacher, details.stage, assessmentRefID));
  }, [])

  return (
    <Card style={{ width: "400px" }}>
      <Card.Content
        header={details.name}
        meta={details.class.name}
      />
      <Card.Content
        description={details.briefDescription === (undefined || "") ? <i>No brief description given.</i> : details.briefDescription}
      />
      <Card.Content
        description={
          <>
            <strong>Stage:</strong> {getStageByValue(details.stage).name}<br />
            {
              teacher ? null :
              <>
                <strong>Assessment Status: </strong> {details.assessmentCompleted ? "Completed" : "Not Completed"}<br />
                <strong>Marking Status:</strong> {getMarkingCompletedText(details.markingCompleted, details.peerMarkingQuantity)}
              </>
            }
          </>
        }
      />
      <Card.Content extra>
        <Button.Group fluid widths={2} >
        <InfoModal details={details} teacher={teacher} assessmentRefID={assessmentRefID} />
          {
            buttonData ?
            <Link href={buttonData.link}>
              <Button content={buttonData.name} primary />
            </Link> : null
          }
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

/**
 * Gets the name of the button and a link based on usertype and assessment stage.
 * @param {boolean} isTeacher If the usertype is a teacher.
 * @param {string} stage The stage of the assessment.
 * @param {string} refID The assessmentRefID.
 * @returns The button name and url for Link href as JSON: { name, link }
 */
export function getButtonData(isTeacher, stage, refID) {
  let data = false;

  if (isTeacher) data = {
    name: "Manage",
    link: `/dashboard/manage/${refID}`,
  }
  else switch (stage) {
    case "assess":
      data = {
        name: "Start Assessment",
        link: `/dashboard/assess/${refID}`,
      }
      break;

    case "mark":
      data = {
        name: "Start Marking",
        link: `/dashboard/mark/${refID}`,
      }
      break;

    case "feedback":
      data = {
        name: "View Feedback",
        link: `/dashboard/feedback/${refID}`,
      }
      break;

    default:
      data = false;
      break;
  }
  return data;
}

/**
 * Returns string which displays marking completions out of the peer marking quantity.
 * @param {Array<boolean>} markingCompleted An array of markingCompleted datapoint from API.
 * @param {number} peerMarkingQuantity The peer marking quantity from the API.
 * @returns String with data mentioned above.
 */
export function getMarkingCompletedText(markingCompleted, peerMarkingQuantity) {
  return `${markingCompleted.reduce((count, current) => count + ( current ? 1 : 0 ), 0)}/${peerMarkingQuantity}`;
}
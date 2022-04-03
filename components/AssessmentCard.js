import Link from "next/link"
import { Card, Button, Modal, Table, Message } from "semantic-ui-react"
import { useEffect, useState } from "react"

import { textToHTML } from "lib/common"
import { getStageByValue } from "lib/assessmentStages"

export default function AssessmentCard({ details, teacher, past = false }) {
  const [buttonData, setButtonData] = useState(false);

  useEffect(() => {
    setButtonData(getButtonData(teacher, details.stage));
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
        <InfoModal details={details} teacher={teacher} past={past} />
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

function InfoModal({details, teacher}) {
  const [open, setOpen] = useState(false);
  const [stageData, setStageData] = useState(false);
  const [buttonData, setButtonData] = useState(false);

  useEffect(() => {
    setStageData(getStageByValue(details.stage));
    setButtonData(getButtonData(teacher, details.stage));
  }, [])

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="Learn More" />}
      closeIcon
    >
      <Modal.Header>Assessment Details</Modal.Header>
      <Modal.Content>

        <Message
          header={<><strong>Stage:</strong> {stageData.name}</>}
          content={teacher ? stageData.teacherDescription : stageData.studentDescription}
          info
        />

        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell><strong>Assessment ID</strong></Table.Cell>
              <Table.Cell>{details.assessmentRefID}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Name</strong></Table.Cell>
              <Table.Cell>{details.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Class</strong></Table.Cell>
              <Table.Cell>{details.class.name}</Table.Cell>
            </Table.Row>
            {
              teacher ? null :
              <>
                <Table.Row>
                  <Table.Cell><strong>Teacher</strong></Table.Cell>
                  <Table.Cell>{details.teacher.name} (<Link href={`mailto:${details.teacher.email}`} >{details.teacher.email}</Link>)</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><strong>Assessment Completed</strong></Table.Cell>
                  <Table.Cell>{ details.assessmentCompleted ? "Completed" : "Not Completed" }</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><strong>Marking Completed</strong></Table.Cell>
                  <Table.Cell>{ getMarkingCompletedText(details.markingCompleted, details.peerMarkingQuantity) }</Table.Cell>
                </Table.Row>
              </>

            }
            <Table.Row>
              <Table.Cell><strong>Peer Marking Quantity</strong></Table.Cell>
              <Table.Cell>{details.peerMarkingQuantity}</Table.Cell>
            </Table.Row>
            {/* <Table.Row>
              <Table.Cell><strong>Release Date</strong></Table.Cell>
              <Table.Cell>{getLocalDate(details.releaseDate)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Submission Date</strong></Table.Cell>
              <Table.Cell>{getLocalDate(details.submissionDeadline)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Marking Completion Date</strong></Table.Cell>
              <Table.Cell>{getLocalDate(details.markingDeadline)}</Table.Cell>
            </Table.Row> */}
          </Table.Body>
        </Table>
        {details.briefDescription === (undefined || "") ? <i>No brief description given.</i> : textToHTML(details.briefDescription)}
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Close"
          onClick={() => setOpen(false)}
        />
        {
          buttonData ?
          <Link href={buttonData.link}>
            <Button content={buttonData.name} primary />
          </Link> : null
        }
      </Modal.Actions>
    </Modal>
  )
}

/**
 * Gets the name of the button and a link based on usertype and assessment stage.
 * @param {boolean} isTeacher If the usertype is a teacher.
 * @param {string} stage The stage of the assessment
 * @returns The button name and url for Link href as JSON: { name, link }
 */
function getButtonData(isTeacher, stage, refID) {
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
function getMarkingCompletedText(markingCompleted, peerMarkingQuantity) {
  return `${markingCompleted.reduce((count, current) => count + ( current ? 1 : 0 ), 0)}/${peerMarkingQuantity}`;
}
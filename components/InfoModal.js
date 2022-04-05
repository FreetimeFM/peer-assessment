import Link from "next/link";
import { Button, Modal, Table, Message } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { textToHTML } from "lib/common";
import { getStageByValue } from "lib/assessmentStages";
import { getButtonData, getMarkingCompletedText } from "./AssessmentCard";

export function InfoModal({ trigger = <Button content="Learn More" />, details, teacher, assessmentRefID }) {
  const [open, setOpen] = useState(false);
  const [stageData, setStageData] = useState(false);
  const [buttonData, setButtonData] = useState(false);

  useEffect(() => {
    setStageData(getStageByValue(details.stage));
    setButtonData(getButtonData(teacher, details.stage, assessmentRefID));
  }, []);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
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
              <Table.Cell>{assessmentRefID}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Name</strong></Table.Cell>
              <Table.Cell>{details.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Class</strong></Table.Cell>
              <Table.Cell>{details.class.name}</Table.Cell>
            </Table.Row>
            {teacher ? null :
              <>
                <Table.Row>
                  <Table.Cell><strong>Teacher</strong></Table.Cell>
                  <Table.Cell>{details.teacher.name} (<Link href={`mailto:${details.teacher.email}`}>{details.teacher.email}</Link>)</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><strong>Assessment Completed</strong></Table.Cell>
                  <Table.Cell>{details.assessmentCompleted ? "Completed" : "Not Completed"}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><strong>Marking Completed</strong></Table.Cell>
                  <Table.Cell>{getMarkingCompletedText(details.markingCompleted, details.peerMarkingQuantity)}</Table.Cell>
                </Table.Row>
              </>}
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
          onClick={() => setOpen(false)} />
        {buttonData ?
          <Link href={buttonData.link}>
            <Button content={buttonData.name} primary />
          </Link> : null}
      </Modal.Actions>
    </Modal>
  );
}

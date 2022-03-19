import Link from "next/link"
import { Card, Button, Modal, Table } from "semantic-ui-react"
import { useState } from "react"

import { getLocalDate } from "lib/common"

export default function AssessmentCard({ details, teacher, past = false }) {
  const link = `/dashboard/${teacher ? "manage" : "assess"}/${details.assessmentRefID}`

  return (
    <Card style={{ width: "400px" }}>
      <Card.Content
        header={details.name}
        meta={details.class.name}
      />
      <Card.Content
        description={details.briefDescription === undefined || details.briefDescription === "" ? "No brief description given." : details.briefDescription}
      />
      <Card.Content
        description={
          <>
            Assessment Due: {getLocalDate(details.submissionDeadline)} <br />
            Marking Due: {getLocalDate(details.submissionDeadline)}
          </>
        }
      />
      <Card.Content extra>
        <Button.Group fluid widths={2} >
        <InfoModal details={details} link={link} teacher={teacher} past={past} />
          <Link href={link}>
            <Button content={teacher ? "Manage" : "Start"} primary/>
          </Link>
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

function InfoModal({trigger = <Button>Learn More</Button>, details, link, teacher, past = false}) {
  const [open, setOpen] = useState(false);

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
        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell><strong>Assessment ID</strong></Table.Cell>
              <Table.Cell>{details.assessmentRefID}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Class</strong></Table.Cell>
              <Table.Cell>{details.class.name}</Table.Cell>
            </Table.Row>
            {
              teacher ? null :
              <Table.Row>
                <Table.Cell><strong>Teacher</strong></Table.Cell>
                <Table.Cell>{details.teacher.name} ({details.teacher.email})</Table.Cell>
              </Table.Row>
            }
            <Table.Row>
              <Table.Cell><strong>Name</strong></Table.Cell>
              <Table.Cell>{details.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
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
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Brief Description</strong></Table.Cell>
              <Table.Cell>{details.briefDescription === undefined || details.briefDescription === "" ? "No brief description given." : details.briefDescription}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Close"
          onClick={() => setOpen(false)}
        />
        <Link href={link}>
          <Button content={teacher ? "Manage" : "Start"} primary/>
        </Link>
      </Modal.Actions>
    </Modal>
  )
}
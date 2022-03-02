import Link from "next/link"
import { Card, Button, Modal, Table } from "semantic-ui-react"
import { useState } from "react"

export default function AssessmentCard({ details, past = false }) {
  return (
    <Card style={{ width: "400px" }}>
      <Card.Content
        header={details.name}
        meta={details.class === undefined ? "For everyone" : details.class}
      />
      <Card.Content
        description={details.briefDescription === undefined || details.briefDescription === "" ? "No brief description given." : details.briefDescription}
      />
      <Card.Content>
        <div><strong>Released on</strong> {new Date(details.releaseDate).toUTCString()}</div>
        <div><strong>Submit by</strong> {new Date(details.submissionDate).toUTCString()}</div>
        <div><strong>Mark by</strong> {new Date(details.markingDate).toUTCString()}</div>
      </Card.Content>
      <Card.Content extra>
        <Button.Group fluid widths={2} >
        <InfoModal details={details} past/>
          <Link href={`/dashboard/assess/${details.assessmentRefID}`}>
            <Button content="View" primary/>
          </Link>
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

function InfoModal({trigger = <Button>Learn More</Button>, details, past = false}) {
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
              <Table.Cell><strong>Name</strong></Table.Cell>
              <Table.Cell>{details.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Class</strong></Table.Cell>
              <Table.Cell>{details.class === undefined ? "No class specified." : details.class}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Teacher</strong></Table.Cell>
              <Table.Cell>{details.teacher.name} ({details.teacher.email})</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Release Date</strong></Table.Cell>
              <Table.Cell>{new Date(details.releaseDate).toString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Submission Date</strong></Table.Cell>
              <Table.Cell>{new Date(details.submissionDate).toString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Marking Completion Date</strong></Table.Cell>
              <Table.Cell>{new Date(details.markingDate).toString()}</Table.Cell>
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
        <Link href={`/dashboard/assess/${details.assessmentRefID}`}>
          <Button content="View" primary/>
        </Link>
      </Modal.Actions>
    </Modal>
  )
}
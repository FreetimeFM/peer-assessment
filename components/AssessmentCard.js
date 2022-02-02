import Link from "next/link"
import { Card, Button, Modal, Table, Divider } from "semantic-ui-react"
import { useState } from "react"

export default function AssessmentCard({ details }) {
  return (
    <Card style={{ width: "400px" }}>
      <Card.Content>
        <Card.Header>{details.name}</Card.Header>
        <Card.Meta>{details.module}</Card.Meta>
        <Link href={details.link}>
          <Button primary>
            { details.started ? "Continue" : "Start" }
          </Button>
        </Link>
      </Card.Content>
    </Card>
  )
}

function InfoModal({trigger=<Button>Learn More</Button>, details}) {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
    >
      <Modal.Header>Assessment Details</Modal.Header>
      <Modal.Content>
        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell><strong>Name</strong></Table.Cell>
              <Table.Cell>{details.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Module</strong></Table.Cell>
              <Table.Cell>{details.module}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Lecturer</strong></Table.Cell>
              <Table.Cell>{details.lecturer}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Start Date</strong></Table.Cell>
              <Table.Cell>{details.startDate}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Submission Date</strong></Table.Cell>
              <Table.Cell>{details.submissionDeadline}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Marking Completion Date</strong></Table.Cell>
              <Table.Cell>{details.markingDeadline}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Description</strong></Table.Cell>
              <Table.Cell>{details.description}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Close"
          onClick={() => setOpen(false)}
        />
        <Link href={details.link}>
          <Button primary>
            { details.started ? "Continue" : "Start" }
          </Button>
        </Link>
      </Modal.Actions>
    </Modal>
  )
}
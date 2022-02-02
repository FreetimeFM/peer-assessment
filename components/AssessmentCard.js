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

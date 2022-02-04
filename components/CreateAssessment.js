import { Form, Segment } from "semantic-ui-react";

export default function CreateAssessment() {

  return (
    <Segment>
      <Form>
        <Form.Group widths="equal">
          <Form.Input label="Assessment Name" name="name" type="text" placeholder="Required" maxLength={100} required />
        </Form.Group>
        <Form.TextArea
          label="Brief Description"
          name="briefDescription"
          placeholder="This description will be displayed as an overview in the dashboard. 500 characters maximum."
          maxLength={300}
          rows={3}
        />
        <Form.TextArea
          label="Description"
          name="description"
          placeholder="A detailed description about the assessment. 5000 characters maximum."
          maxLength={5000}
          rows={11}
        />
        <Form.Group widths="equal">
          <Form.Input label="Release Date" name="releaseDate" type="datetime-local" />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input label="Submission Deadline" name="submissionDeadline" type="datetime-local" required />
          <Form.Input label="Marking Deadline" name="markingDeadline" type="datetime-local" required />
        </Form.Group>
      </Form>
    </Segment>
  );
}
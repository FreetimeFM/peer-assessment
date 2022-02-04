import { Form, Segment, Popup, Button } from "semantic-ui-react";

export default function CreateAssessment() {

  return (
    <Segment>
      <Form>
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Name <InputPopup message="The name of the assessment. 100 characters maximum. Required."/></label>
            <input
              name="name"
              type="text"
              placeholder="Required."
              maxLength={100}
              required
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Brief Description <InputPopup message="This description will be displayed as an overview in the dashboard. 500 characters maximum."/></label>
          <textarea
            name="briefDescription"
            placeholder="Optional. This description will be displayed as an overview in the dashboard. 500 characters maximum."
            maxLength={300}
            rows={3}
          />
        </Form.Field>
        <Form.Field>
          <label>Description <InputPopup message="A detailed description about the assessment. 5000 characters maximum."/></label>
          <textarea
            name="description"
            placeholder="A detailed description about the assessment. 5000 characters maximum."
            maxLength={5000}
            rows={11}
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Release Date <InputPopup message="The assessment will be accessible to students at this date. This is optional as you can manually release the assessment."/></label>
            <input type="datetime-local" name="releaseDate"/>
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Submission Deadline <InputPopup message="The date students have to submit by. Required."/></label>
            <input type="datetime-local" name="submissionDeadline" required/>
          </Form.Field>
          <Form.Field required>
            <label>Marking Deadline <InputPopup message="The date students have to mark by. Required."/></label>
            <input type="datetime-local" name="markingDeadline" required/>
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );
}

function InputPopup({ message }) {
  return (
    <Popup
      trigger={<Button icon="help" size="tiny" style={{ padding: 3 }} />}
      content={message}
      position="right center"
    />
  )
}
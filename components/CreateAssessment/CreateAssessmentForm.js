import { Form } from "semantic-ui-react";
import FormInputPopup from "../FormInputPopup";

/**
 * Displays a form which allows the teacher to enter details about the assessment.
 */
export function CreateAssessmentForm({ formData, classList, onFormChange }) {
  return (
    <>
      <Form.Group widths="equal">
        {/* Enter the name of the assessment */}
        <Form.Input
          name="name"
          label={<label>Assessment Name <FormInputPopup message="The name of the assessment. 70 characters maximum. Required." /></label>}
          placeholder="Required."
          value={formData.name}
          maxLength={70}
          onChange={onFormChange}
          required
        />
        {/* Enter the release date of the assessment. Currently disabled. */}
        <Form.Input
          name="releaseDate"
          label={<label>Release Date <FormInputPopup message="The assessment will be accessible to students at this date. Required." /></label>}
          type="datetime-local"
          value={formData.releaseDate}
          onChange={onFormChange}
          required
          disabled
        />
      </Form.Group>

      <Form.Group widths="equal">
        {/* Select the class from the dropdown. The list of classes is loaded before opening the form. */}
        <Form.Dropdown
          name="classRefID"
          label={<label>Class <FormInputPopup message="Choose the class you want to assign this assessment to." /></label>}
          value={formData.classRefID}
          options={classList}
          onChange={onFormChange}
          placeholder={classList.length === 0 ? "No classes." : "Select a class."}
          error={classList.length === 0 ? "You don't have any classes. Please contact your administrator." : null}
          fluid
          search
          selection
          required
        />
        {/* Choose the peer marking quantity */}
        <Form.Input
          name="peerMarkingQuantity"
          type="number"
          label={
            <label>Peer Marking Quantity{" "}
              <FormInputPopup message="The number of peers each student has to mark. If the class size is less than the value chosen,
              the system will lower the value to match the class size. Minimum: 1. Maximum: 10. Required." />
            </label>
          }
          placeholder="Required."
          value={formData.peerMarkingQuantity}
          onWheel={e => e.target.blur()}
          onChange={e => {
            onFormChange(e, {name: "peerMarkingQuantity", value: parseInt(e.target.value)})
          }}
          min={1}
          max={10}
          required
        />
      </Form.Group>
      {/* Enter a brief description of the assessment */}
      <Form.TextArea
        name="briefDescription"
        label={
          <label>
            Brief Description{" "}
            <FormInputPopup message="This description will be displayed as an overview in the dashboard. 200 characters maximum. Optional" />
          </label>
        }
        placeholder="This description will be displayed as an overview in the dashboard. 200 characters maximum. Optional."
        value={formData.briefDescription}
        maxLength={200}
        rows={3}
        onChange={onFormChange}
      />
      {/* Enter a detailed description that will be shown during the assessment */}
      <Form.TextArea
        name="description"
        label={
          <label>
            Assessment Description{" "}
            <FormInputPopup message="A detailed description which will be displayed during the assessment. 5000 characters maximum. Optional." />
          </label>
        }
        placeholder="A detailed description which will be displayed during the assessment. 5000 characters maximum. Optional."
        value={formData.description}
        maxLength={5000}
        rows={6}
        onChange={onFormChange}
      />
      {/* Enter a description that will be shown during marking */}
      <Form.TextArea
        name="markingDescription"
        label={
          <label>
            Marking Description{" "}
            <FormInputPopup message="A detailed description which will be displayed during marking. 5000 characters maximum. Optional." />
          </label>
        }
        placeholder="A detailed description which will be displayed during marking. 5000 characters maximum. Optional."
        value={formData.markingDescription}
        maxLength={5000}
        rows={6}
        onChange={onFormChange}
      />
      {/* Enter the submission deadline. Currently disabled */}
      <Form.Group widths="equal">
        <Form.Input
          name="submissionDeadline"
          label={<label>Submission Deadline <FormInputPopup message="The date students have to submit their work by. Required." /></label>}
          type="datetime-local"
          value={formData.submissionDeadline}
          onChange={onFormChange}
          required
          disabled
        />
        {/* Enter the marking deadline. Currently disabled */}
        <Form.Input
          name="markingDeadline"
          label={<label>Marking Deadline <FormInputPopup message="The date students have to mark their peers by. Required." /></label>}
          type="datetime-local"
          value={formData.markingDeadline}
          onChange={onFormChange}
          required
          disabled
        />
      </Form.Group>
      {/* Select files to upload to show students during the assessment */}
      <Form.Group widths="equal">
        <Form.Input
          name="assessmentFiles"
          label={<label>Assessment Files <FormInputPopup message="These files will be available to students in the assessment stage." /></label>}
          type="file"
          onChange={onFormChange}
          multiple
          required
          disabled
        />
        {/* Select files to upload to show students during marking. */}
        <Form.Input
          name="markingFiles"
          label={<label>Marking Files <FormInputPopup message="These files will be available to students in the marking stage." /></label>}
          type="file"
          onChange={onFormChange}
          multiple
          required
          disabled
        />
      </Form.Group>
    </>
  );
}

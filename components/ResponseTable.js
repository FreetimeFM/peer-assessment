import { useState } from "react";
import { Table, Button, Header, List, Modal, Form, Card, Label, Divider } from "semantic-ui-react";
import PlaceholderSegment from "components/PlaceholderSegment";
import { QuestionField } from "components/QuestionCard";
import { textToHTML } from "lib/common";

export default function ResponseTable({ data, stats, peerMarkingQuantity, feedbackList = [], submitting, onSubmit }) {
  return (
    <Table celled selectable striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell content="Student" width={9} />
          <Table.HeaderCell content="Assessment" />
          <Table.HeaderCell content="Marking Progress" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.results.map((result, index) => {
          return (
            <ResponseDetailsModal
              key={index}
              student={data.students.find(student => student.userRefID === result.userRefID)}
              peers={result.peerMarking.map(peer => {
                return data.students.find(student => student.userRefID === peer.userRefID)
              })}
              markingStatus={[stats[result.userRefID].markingStatus, peerMarkingQuantity]}
              questions={data.assessment.questions}
              markingCriteria={data.assessment.markingCriteria}
              result={result}
              feedback={feedbackList.find(feedback => feedback.userRefID === result.userRefID)}
              submitting={submitting}
              onSubmit={data => {
                onSubmit({
                  userRefID: result.userRefID,
                  feedback: data
                })
              }}
            />
          )
        })}
      </Table.Body>
    </Table>
  );
}

function Row({ name, assessmentStatus, markingStatus = [0, 0], onRowClick }) {
  return (
    <Table.Row onClick={onRowClick} style={{ cursor: "pointer" }} >
      <Table.Cell content={name} />
      <Table.Cell
        content={assessmentStatus ? "Completed" : "Not Completed"}
        positive={assessmentStatus}
        error={!assessmentStatus}
      />
      <Table.Cell
        content={`${markingStatus[0]}/${markingStatus[1]}`}
        positive={markingStatus[0] === markingStatus[1]}
        warning={markingStatus[0] > 0 && markingStatus[0] < markingStatus[1]}
        error={markingStatus[0] === 0}
      />
    </Table.Row>
  )
}

function ResponseDetailsModal({ student, peers, markingStatus, questions, markingCriteria, result, feedback, submitting, onSubmit }) {
  const [ open, setOpen ] = useState(false);
  const [ answersFeedback, setAnswersFeedback ] = useState({});
  const [ generalMarkingQuestionsFeedback, setGeneralMarkingQuestionsFeedback ] = useState({});
  const [ overallComment, setOverallComment ] = useState("");
  const [ marks, setMarks ] = useState(new Array(questions.length).fill(0));

  if (feedback) {
    console.log("feedback", feedback);
  }

  function onAssessmentResponseChange(index, value, forMarks = false) {

    if (forMarks) {
      const temp = marks.slice();
      temp[index] = value;
      setMarks(temp);
    } else {
      setAnswersFeedback({
        ...answersFeedback,
        [index]: value
      })
    }
  }

  function onGeneralResponseChange(_e, { name, value }) {
    setGeneralMarkingQuestionsFeedback({
      ...generalMarkingQuestionsFeedback,
      [name]: value
    })
  }

  function onClose(_e) {
    setOpen(false);
  }

  function handleSubmit(_e) {
    if (!document.forms["responseForm"].reportValidity()) return;
    if (!confirm("Are you sure you want to submit? You wont be able to change your responses.")) return;

    let questions = {};
    marks.forEach((mark, index) => {
      questions[index] = {
        marks: mark,
        feedback: answersFeedback[index.toString()] ? answersFeedback[index.toString()] : ""
      }
    });

    onSubmit({
      questions: questions,
      general: generalMarkingQuestionsFeedback,
      overallComment: overallComment,
    })
  }

  function renderContent() {
    if (!result.assessmentCompleted) return (
      <PlaceholderSegment
        iconName="close"
        message="Not completed"
        extraContent={`${student.name} hasn't answered the assessment. The markers cannot mark this student's answers.`}
      />
    )

    return (
      <>
        <Header content="Assessment Questions" />
        {
          questions.map((question, index) => {
            return (
              <Card
                key={index}
                color="red"
                style={{ marginBottom: "3em" }}
                fluid
              >
                <Card.Content
                  header={`${index + 1}. ${question.name}`}
                  meta={`${question.marks} ${question.marks === 1 ? "mark" : "marks"}`}
                />
                <Card.Content
                  meta={<strong>{student.name}'s answer:</strong>}
                  description={result.answers[index.toString()] ? textToHTML(result.answers[index.toString()]) : <i>No answer from student.</i>}
                />
                <Card.Content>
                {
                  markingCriteria.questions[index].length === 0 ? <i>No marking criteria for this question.</i> :
                  markingCriteria.questions[index].map((item, pos) => {
                    return (
                      <Card key={pos} color="green" fluid>
                        <Card.Content
                          header={`${index + 1}.${pos + 1} ${item.name}`}
                        />
                        {
                          result.peerMarking.map((peer, peerIndex) => {
                            return (
                              <Card.Content key={peerIndex}>
                                <p><strong>{peers.find(user => user.userRefID === peer.userRefID).name}'s response</strong></p>
                                {
                                  peer.markingCompleted ?
                                    peer.responses.questions[`${index}.${pos}`] ?
                                    textToHTML(peer.responses.questions[`${index}.${pos}`]) :
                                    <i>No response from student marker.</i> :
                                  <i>No response from student marker.</i>
                                }
                              </Card.Content>
                            )
                          })
                        }
                      </Card>
                    )
                  })
                }
                </Card.Content>
                <Card.Content>
                  <List
                    items={result.peerMarking.map(marker => {
                      const student = peers.find(student => student.userRefID === marker.userRefID).name;
                      if (!marker.markingCompleted) return `${student} allocated 0 marks.`;

                      const marks = parseInt(marker.responses.questions[index.toString()]);
                      if (marks === 1) return `${student} allocated ${marks} mark.`;
                      return `${student} allocated ${marks} mark.`;
                    })}
                  />
                </Card.Content>
                <Card.Content>
                  <Form.Input
                    type="number"
                    label={`Marks for ${student.name}'s answer`}
                    min={0}
                    max={question.marks}
                    onWheel={e => e.target.blur()}
                    onChange={(_e, {value}) => {
                      onAssessmentResponseChange(index, value, true);
                    }}
                    required
                    fluid
                  />
                  <QuestionField
                    key={index}
                    type="long-text"
                    label={`Your Response to ${student.name}'s answer`}
                    onChange={(_e, {value}) => {
                      onAssessmentResponseChange(index, value);
                    }}
                  />
                </Card.Content>
              </Card>
            )
          })
        }

        <Header content="General Marking Questions" />
        {
          markingCriteria.general.length === 0 ? <i>No general marking criteria.</i> :
          markingCriteria.general.map((question, index) => {
            return (
              <Card key={index} color="olive" style={{ marginBottom: "2em" }} fluid>
                <Card.Content
                  header={`${index + 1}. ${question.name}`}
                />
                {
                  result.peerMarking.map((peer, peerIndex) => {
                    return (
                      <Card.Content key={peerIndex}>
                        <p><strong>{peers.find(user => user.userRefID === peer.userRefID).name}'s response</strong></p>
                        {
                          peer.markingCompleted ?
                            peer.responses.general[index.toString()] ?
                            textToHTML(peer.responses.general[index.toString()]) :
                            <i>No response from student marker.</i> :
                          <i>No response from student marker.</i>
                        }
                      </Card.Content>
                    )
                  })
                }
                <Card.Content
                  content={
                    <QuestionField
                      key={index}
                      index={index}
                      type={markingCriteria.general[index.toString()].type}
                      label="Your Response"
                      onChange={onGeneralResponseChange}
                    />
                  }
                />
              </Card>
            )
          })
        }
      </>
    )
  }

  return (
    <Modal
      open={open}
      trigger={
        <Row
          name={`${student.name} (${student.email})`}
          assessmentStatus={result.assessmentCompleted}
          markingStatus={markingStatus}
          onRowClick={_e => setOpen(true)}
        />
      }
      onClose={onClose}
      size="large"
      closeIcon
    >
      <Modal.Header content={`${student.name}'s Answers`} />
      <Modal.Content>
        <Table style={{ marginBottom: "2em" }} celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content="Role" />
              <Table.HeaderCell content="Name" />
              <Table.HeaderCell content="Email" />
              <Table.HeaderCell content="Marking" />
              <Table.HeaderCell content={`Marks out of ${questions.reduce((count, current) => count + parseInt(current.marks), 0)}`} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell><Label content="Answering" ribbon/></Table.Cell>
              <Table.Cell content={student.name} />
              <Table.Cell content={student.email} />
              <Table.Cell content="N/A" disabled />
              <Table.Cell content="N/A" disabled />
            </Table.Row>
            {
              result.peerMarking.map((peer, index) => {
                const user = peers.find(user => user.userRefID === peer.userRefID);
                let marks = 0;

                if (peer.markingCompleted) markingCriteria.questions.forEach((_q, index) => {
                  marks += peer.responses.questions[index.toString()] ? parseInt(peer.responses.questions[index.toString()]) : 0
                });

                return (
                  <Table.Row key={index} negative={!peer.markingCompleted} positive={peer.markingCompleted} >
                    <Table.Cell content="Marking" />
                    <Table.Cell content={user.name} />
                    <Table.Cell content={user.email} />
                    <Table.Cell content={peer.markingCompleted ? "Completed" : "Not Completed"} />
                    <Table.Cell content={peer.markingCompleted ? marks : "N/A"} />
                  </Table.Row>
                )
              })
            }
            <Table.Row>
              <Table.Cell content="Teacher" />
              <Table.Cell content="You" colSpan={2} />
              <Table.Cell content="Completed" />
              <Table.Cell content={marks.reduce((marks, current) => marks + parseInt(current), 0)} />
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider />
        <Form id="responseForm" loading={submitting}>
          {renderContent()}
          <Divider />
          <QuestionField
            type="long-text"
            label={`Overall comment for ${student.name}`}
            onChange={(_e, {value}) => {
              setOverallComment(value);
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group
          buttons={[
            {
              key: 0,
              content: "Close",
              onClick: onClose,
            },
            {
              key: 1,
              content: "Submit",
              onClick: handleSubmit,
              primary: true,
              disabled: feedback ? true : false
            },
          ]}
          fluid
        />
      </Modal.Actions>
    </Modal>
  )
}
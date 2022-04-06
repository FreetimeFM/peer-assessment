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
          <Table.HeaderCell content="Student" />
          <Table.HeaderCell content="Assessment" />
          <Table.HeaderCell content="Student peer marking progress" />
          <Table.HeaderCell content="Marked" />
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
                  ...data
                })
              }}
            />
          )
        })}
      </Table.Body>
    </Table>
  );
}

function Row({ name, assessmentStatus, markingStatus = [0, 0], onRowClick, feedback }) {
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
      <Table.Cell
        content={feedback ? "Yes" : "No"}
        positive={feedback !== undefined}
        error={feedback === undefined}
      />
    </Table.Row>
  )
}

function ResponseDetailsModal({ student, peers, markingStatus, questions, markingCriteria, result, feedback, submitting, onSubmit }) {
  const [ open, setOpen ] = useState(false);
  const [ marks, setMarks ] = useState([]);
  const [ markingQuestionsFeedback ,setMarkingQuestionsFeedback ] = useState(
    feedback ? ( feedback.markingCriteria.questions ? feedback.markingCriteria.questions : {} ) : {}
  );
  const [ generalMarkingQuestionsFeedback, setGeneralMarkingQuestionsFeedback ] = useState(
    feedback ? ( feedback.markingCriteria.general ? feedback.markingCriteria.general : {} ) : {}
  );
  const [ overallComment, setOverallComment ] = useState(
    feedback ? ( feedback.overallComment ? feedback.overallComment : "No comment." ) : ""
  );

  function onMarkingQuestionResponseChange(index, value, forMarks = false) {

    if (forMarks) {
      const temp = marks.slice();
      temp[index] = value;
      setMarks(temp);
    } else {
      setMarkingQuestionsFeedback({
        ...markingQuestionsFeedback,
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
    if (!confirm("Are you sure you want to submit? You won't be able to change your responses.")) return;

    let markingQuestions = {};
    questions.forEach((_q, index) => {
      markingQuestions[index] = {
        marks: marks[index] ? marks[index] : 0,
        feedback: markingQuestionsFeedback[index.toString()] ? markingQuestionsFeedback[index.toString()] : ""
      }
    });

    onSubmit({
      markingCriteria: {
        general: generalMarkingQuestionsFeedback,
        questions: markingQuestions,
      },
      overallComment: overallComment,
    });
  }

  function renderContent() {
    if (!result.assessmentCompleted) return (
      <PlaceholderSegment
        iconName="close"
        message="Not completed"
        extraContent={`${student.name} hasn't answered the assessment. The peer markers cannot mark this student's answers.`}
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
                  {
                    markingCriteria.questionInstructions[index.toString()] ?
                    <>
                      <p><strong>Marking Instructions</strong></p>
                      {textToHTML(markingCriteria.questionInstructions[index.toString()])}
                    </> : <i>No marking instructions provided.</i>
                  }
                  <Divider />
                  <List
                    items={result.peerMarking.map(marker => {
                      const student = peers.find(student => student.userRefID === marker.userRefID).name;
                      if (!marker.markingCompleted) return null

                      const marks = parseInt(marker.responses.questions[index.toString()]);
                      return `Marks by ${student}: ${marks}`;
                    })}
                  />
                  <Form.Input
                    type="number"
                    label={`Allocate marks for ${student.name}'s answer`}
                    min={0}
                    max={question.marks}
                    value={feedback?.markingCriteria?.questions[index]?.marks}
                    readOnly={feedback !== undefined}
                    onWheel={e => e.target.blur()}
                    onChange={(_e, {value}) => {
                      onMarkingQuestionResponseChange(index, value, true);
                    }}
                    required
                    size="mini"
                    inline
                  />
                </Card.Content>
                <Card.Content>
                  <QuestionField
                    key={index}
                    type="long-text"
                    label={`Your Response to ${student.name}'s answer`}
                    value={feedback?.markingCriteria?.questions[index]?.feedback}
                    preview={feedback !== undefined}
                    onChange={(_e, {value}) => {
                      onMarkingQuestionResponseChange(index, value);
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
                      value={feedback?.markingCriteria?.general[index]}
                      preview={feedback !== undefined}
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

  function getTeacherTotalMarks() {
    let marks = 0;
    for (const key in feedback.markingCriteria.questions) {
      if (Object.hasOwnProperty.call(feedback.markingCriteria.questions, key)) {
        console.log(feedback.markingCriteria.questions[key].marks)
        marks += parseInt(feedback.markingCriteria.questions[key].marks);
      }
    }
    return marks;
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
          feedback={feedback}
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
              <Table.HeaderCell content="Marked" />
              <Table.HeaderCell content={`Marks out of ${questions.reduce((count, current) => count + parseInt(current.marks), 0)}`} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              result.peerMarking.map((peer, index) => {
                const user = peers.find(user => user.userRefID === peer.userRefID);
                let marks = 0;

                if (peer.markingCompleted) markingCriteria.questions.forEach((_q, index) => {
                  marks += peer.responses.questions[index.toString()] ? parseInt(peer.responses.questions[index.toString()]) : 0
                });

                return (
                  <Table.Row
                    key={index}
                    negative={!peer.markingCompleted}
                    positive={peer.markingCompleted}
                  >
                    <Table.Cell content="Peer marking" />
                    <Table.Cell content={user.name} />
                    <Table.Cell content={user.email} />
                    <Table.Cell content={peer.markingCompleted ? "Yes" : "No"} />
                    <Table.Cell content={peer.markingCompleted ? marks : "N/A"} />
                  </Table.Row>
                )
              })
            }
            <Table.Row
              negative={feedback === undefined}
              positive={feedback !== undefined}
            >
              <Table.Cell><Label content="Marking" ribbon/></Table.Cell>
              <Table.Cell content="You" colSpan={2} />
              <Table.Cell content={feedback ? "Yes" : "No"} />
              <Table.Cell content={
                  feedback !== undefined ? getTeacherTotalMarks() : marks.reduce((marks, current) => marks + parseInt(current), 0)
                }
              />
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
            value={overallComment}
            preview={feedback !== undefined}
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
              content: feedback ? "Preview Only" : "Submit",
              onClick: handleSubmit,
              primary: true,
              disabled: feedback || submitting ? true : false
            },
          ]}
          fluid
        />
      </Modal.Actions>
    </Modal>
  )
}
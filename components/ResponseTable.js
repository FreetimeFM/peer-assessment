import { useState } from "react";
import { Table, Button, Header, List, Modal, Form, Card, Label, Divider } from "semantic-ui-react";
import PlaceholderSegment from "components/PlaceholderSegment";
import { textToHTML } from "lib/common";

export default function ResponseTable({ data, stats, peerMarkingQuantity }) {
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

function ResponseDetailsModal({ student, peers, markingStatus, questions, markingCriteria, result }) {
  const [ open, setOpen ] = useState(false);
  const [ comments, setComments ] = useState({});

  function onCommentChange() {

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
                      <Card color="green" fluid>
                        <Card.Content
                          header={`${index + 1}.${pos + 1} ${item.name}`}
                        />
                        {
                          result.peerMarking.map(peer => {
                            return (
                              <Card.Content>
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
                        <Card.Content
                          content={
                            <Form.TextArea
                              id={`${index + 1}.${pos + 1}`}
                              label={`Your response to ${index + 1}.${pos + 1}`}
                              rows={1}
                            />
                          }
                        />
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
                    id={index.toString()}
                    type="number"
                    label={`Marks for ${student.name}'s answer`}
                    min={0}
                    max={question.marks}
                    onWheel={e => e.target.blur()}
                    required
                    size="mini"
                    fluid
                  />
                  <Form.TextArea
                    label={`Your Response to ${student.name}'s answer`}
                    // onChange={(e, {value}) => {
                    //   onInput(e, {
                    //     qIndex: index,
                    //     value: value,
                    //     marks: true
                    //   })
                    // }}
                    maxLength={1000}
                    rows={2}
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
              <Card color="olive" style={{ marginBottom: "2em" }} fluid>
                <Card.Content
                  header={`${index + 1}. ${question.name}`}
                />
                {
                  result.peerMarking.map(peer => {
                    return (
                      <Card.Content>
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
                    <Form.TextArea
                    label="Your response"
                    // onChange={(e, {value}) => {
                    //   onInput(e, {
                    //     qIndex: index,
                    //     value: value,
                    //     marks: true
                    //   })
                    // }}
                    rows={1}
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
      onClose={_e => setOpen(false)}
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
              result.peerMarking.map(peer => {
                const user = peers.find(user => user.userRefID === peer.userRefID);
                let marks = 0;

                if (peer.markingCompleted) markingCriteria.questions.forEach((_q, index) => {
                  marks += peer.responses.questions[index.toString()] ? parseInt(peer.responses.questions[index.toString()]) : 0
                });

                return (
                  <Table.Row negative={!peer.markingCompleted} positive={peer.markingCompleted} >
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
              <Table.Cell content={0} />
            </Table.Row>
          </Table.Body>
        </Table>
        <Form>
          {renderContent()}
          <Divider />
          <Form.TextArea
            id="overallComment"
            label={`Overall comment for ${student.name}`}
            // onChange={(e, {value}) => {
            //   onInput(e, {
            //     qIndex: index,
            //     value: value,
            //     marks: true
            //   })
            // }}
            rows={3}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Close" onClick={_e => setOpen(false)} />
      </Modal.Actions>
    </Modal>
  )
}
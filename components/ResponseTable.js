import { useState } from "react";
import { Table, Button, Header, List, Modal, Form, Card } from "semantic-ui-react";
import { textToHTML } from "lib/common";

export default function ResponseTable({ data, stats, peerMarkingQuantity }) {
  return (
    <Table celled selectable striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell content="Student" width={9} />
          <Table.HeaderCell content="Assessment Status" />
          <Table.HeaderCell content="Marking Status" />
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
      size="large"
    >
      <Modal.Header content={`${student.name}'s Answers`} />
      <Modal.Content>
        <Header content="Markers" size="small" />
        <List items={peers.map(peer => {
          return `${peer.name} (${peer.email})`
        })} />
        <Form>
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
                      </Card>
                    )
                  })
                }
                </Card.Content>
                <Card.Content>
                  <List
                    items={result.peerMarking.map(marker => {
                      const student = peers.find(student => student.userRefID === marker.userRefID).name
                      if (!marker.markingCompleted) return `${student} allocated 0 marks.`
                      const marks = parseInt(marker.responses.questions[index.toString()])
                      if (marks === 1) return `${student} allocated ${marks} mark.`
                      return `${student} allocated ${marks} mark.`
                    })}
                  />
                </Card.Content>
                  {/* <Form.Input
                    name="marks"
                    type="number"
                    label={<label>Allocate Marks <FormInputPopup message="How many marks is the student's response worth? Required."/></label>}
                    placeholder="Required."
                    min={0}
                    max={item.marks}
                    readOnly={preview}
                    onWheel={e => e.target.blur()}
                    onChange={(e, {value}) => {
                      onInput(e, {
                        qIndex: index,
                        value: value,
                        marks: true
                      })
                    }}
                    required
                  /> */}
              </Card>
            )
          })
        }

        <Header content="General Marking Questions" />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Close" onClick={_e => setOpen(false)} />
      </Modal.Actions>
    </Modal>
  )
}
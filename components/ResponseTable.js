import { Table } from "semantic-ui-react";

export default function ResponseTable({ answers, students, stats, peerMarkingQuantity, onRowClick }) {
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
        {answers.map((value, index) => {
          const student = students.find(student => student.userRefID === value.userRefID)
          return (
            <Row
              key={index}
              name={`${student.name} (${student.email})`}
              assessmentStatus={value.assessmentCompleted}
              markingStatus={[ stats[value.userRefID].markingStatus, peerMarkingQuantity]}
              onRowClick={(_e) => onRowClick(value.userRefID)}
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
import { Table } from "semantic-ui-react";

export default function ResponseTable({ responses, onClick }) {

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
        {responses.map((value, index) => {
          return <Row key={index} name={`${value.user.name} (${value.user.email})`} onRowClick={(_e) => onClick(index)} />
        })}
      </Table.Body>
    </Table>
  );
}

function Row({ name, status = ["Unknown", "Unknown"], onRowClick }) {
  return (
    <Table.Row onClick={onRowClick} style={{ cursor: "pointer" }} >
      <Table.Cell content={name} />
      <Table.Cell content={status[0]} />
      <Table.Cell content={status[1]} />
    </Table.Row>
  )
}
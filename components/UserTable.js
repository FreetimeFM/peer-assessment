import { Checkbox, Table } from "semantic-ui-react";

export default function UserTable({ users }) {

  return (
    <Table celled selectable striped sortable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1}/>
          <Table.HeaderCell content="Name" />
          <Table.HeaderCell content="Email" />
          <Table.HeaderCell width={3} content="Type" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
      </Table.Body>
    </Table>
  );
}

function Row({ name, email, userType, onClick }) {
  return (
    <Table.Row onClick={onClick} >
      <Table.Cell content={name} />
      <Table.Cell content={email} />
      <Table.Cell content={userType} />
    </Table.Row>
  )
}
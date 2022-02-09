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

function Rows({ name, email, userType }) {

  return (
    <Table.Row>
      <Table.Cell content={<Checkbox />} />
      <Table.Cell content={name} />
      <Table.Cell content={email} />
      <Table.Cell content={userType} />
    </Table.Row>
  )
}
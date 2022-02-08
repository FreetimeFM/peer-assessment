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

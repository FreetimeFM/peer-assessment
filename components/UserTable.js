  const [ fetching, setFetching ] = useState(false);
  const [ disableLoadMore, setDisableLoadMore ] = useState(true);

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
        <Table.Footer fullWidth>
          <Table.Row textAlign="center">
          <Table.HeaderCell colSpan="3">
            <Button
              size="small"
              content={ disableLoadMore ? "No more users" : "Load more" }
              disabled={disableLoadMore}
              fluid
              loading={fetching}
            />
          </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
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
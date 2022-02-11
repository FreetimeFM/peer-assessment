
  if (error) return <Placeholder iconName="close" message="Cannot fetch details." extraContent="There has been an error fetching the list of users." />

  const [ fetching, setFetching ] = useState(false);
  const [ disableLoadMore, setDisableLoadMore ] = useState(true);
  const [ userList, setUserList ] = useState([
    {
      refID: '323029331001475264',
      name: 'Administrator',
      email: 'admin@example.com',
      userType: 'admin'
    },
    {
      refID: '323037490948604096',
      name: 'Brendan Cooper',
      email: 'b.cooper@example.com',
      userType: 'teacher'
    },
    {
      refID: '323037568090243264',
      name: 'Laura Sharp',
      email: 'l.sharp@example.com',
      userType: 'student'
    },
    {
      refID: '323043769326764232',
      name: 'Elijah Lynn',
      email: 'e.lynn@example.com',
      userType: 'student'
    }
  ]);

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
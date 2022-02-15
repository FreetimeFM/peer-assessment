import { useState } from "react";
import { Table, Message } from "semantic-ui-react";
import Placeholder from "./Placeholder";


export default function ClassTable({ user }) {

  if (user.userType !== "admin") return <Placeholder iconName="time" message="Not available." extraContent="This feature hasn't been implemented yet." />

  const [ classList, setClassList ] = useState([]);

  return (
    <>
      <Message error/>
      <Message content="Fetching users. Please wait." info/>
      <Table attached="bottom" celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell content="Name" />
            <Table.HeaderCell content="Teachers" />
          </Table.Row>
        </Table.Header>
        <Table.Body>

        </Table.Body>
      </Table>
    </>
  )
}
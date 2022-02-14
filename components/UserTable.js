import { useState, useEffect } from "react";
import { Table, Button, Message } from "semantic-ui-react";

import fetchJson from "lib/iron-session/fetchJson";

export default function UserTable({ user }) {

  const [ fetching, setFetching ] = useState(true);
  const [ afterRefID, setAfterRefID ] = useState("");
  const [ error, setError ] = useState("");
  const [ userList, setUserList ] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

  async function getUserList(loadMore = false) {
    if (!loadMore && userList.length >= 1) return;

    setFetching(true);
    const sendAfterRefID = afterRefID === "" ? undefined : afterRefID;
    try {
      const response = await fetchJson("/api/get_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ size: undefined, afterRefID: sendAfterRefID })
      });

      console.log(response);

      if (response.error) {
        console.error("Server response", response);
        setError("There has been an error fetching the list of users. Please read the console or logs.");
      }

      if (!response.result.list) {
        setAfterRefID("");
        return;
      }

      let list = response.result.list;

      if (response.result.afterCursor) {
        setAfterRefID(response.result.afterCursor.refID);
      } else {
        setAfterRefID("");
      }

      setUserList(userList.concat(list));
    } catch (error) {
      console.error(error);
      setError("There has been an error fetching the list of users. Please read the console or logs.");
    }

    setFetching(false);
  }

  function handleButtonClick(_e) {
    if (afterRefID === "" || error !== "") return;
    getUserList(true);
  }

  function handleRowClick(index) {
    console.log("Click on row", index);
  }

  return (
    <>
      <Message content={error} hidden={error === ""} error/>
      <Message content="Fetching users. Please wait." hidden={!fetching} info/>
      <Table attached="bottom" celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell content="Name" />
            <Table.HeaderCell content="Email Address" />
            <Table.HeaderCell width={3} content="Role" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userList.map((value, index) => {
            return <Row key={index} index={index + 1} name={value.name} email={value.email} userType={value.userType} onClick={(_e) => handleRowClick(index)} />
          })}
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row textAlign="center">
          <Table.HeaderCell colSpan="4">
            <Button
              size="small"
              content={ afterRefID === "" ? "No more users to fetch" : "Fetch more users" }
              onClick={handleButtonClick}
              disabled={afterRefID === ""}
              fluid
              loading={fetching}
            />
          </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
}

function Row({ index, name, email, userType, onClick }) {
  return (
    <Table.Row onClick={onClick} style={{ cursor: "pointer" }} >
      <Table.Cell content={index} width="1" />
      <Table.Cell content={name} />
      <Table.Cell content={email} />
      <Table.Cell content={userType} style={{ textTransform: "capitalize" }} />
    </Table.Row>
  )
}
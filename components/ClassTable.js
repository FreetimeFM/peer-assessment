import { useState, useEffect } from "react";
import { Table, Message } from "semantic-ui-react";

import fetchJson from "lib/iron-session/fetchJson";

export default function ClassTable({ user }) {

  const [ classList, setClassList ] = useState([]);
  const [ fetchOptions, setFetchOptions ] = useState({ fetching: false, fetched: false });
  const [ error, setError ] = useState("");

  useEffect(() => {
    fetchClassList();
  }, [])

  async function fetchClassList() {
    if (fetchOptions.fetched) return;
    setFetchOptions({ fetched: false, fetching: true });

    try {
      const response = await fetchJson("/api/get_classes", {
        headers: {
          Accept: "application/json",
        },
      });

      console.log(response);

      if (response.error) {
        console.error(error);
        setError(response?.clientMessage);
      } else {
        if (user.userType === "admin") parseClassListDataAdmin(response.result.data);
        else parseClassListDataTeacher(response.result);
      }

    } catch (error) {
      console.error(error);
      setError("An unknown error has occured. Please contact your administrator or check the console/logs.")
    }

    setFetchOptions({ fetched: true, fetching: false });
  }

  function parseClassListDataAdmin(list) {
    setClassList(list.map(element => {
      return {
        classRef: element[0],
        name: element[1],
        teacher: element[2]
      }
    }))
  }

  function parseClassListDataTeacher(list) {
    setClassList(list.map(element => {
      return {
        classRefID: element.classRefID,
        name: element.name
      }
    }))
  }

  return (
    <>
      <Message content={error} hidden={error === ""} error/>
      <Message content="Fetching classes. Please wait." hidden={!fetchOptions.fetching} info/>
      <Table attached="bottom" celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell content="Name" />
            { user.userType === "admin" ? <Table.HeaderCell content="Teacher" /> : null }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            classList.map((element, index) => {
              if (user.userType === "admin") return <Row key={index} index={index + 1} name={element.name} teacher={element.teacher} />
              else return <Row key={index} index={index + 1} name={element.name} />
            })
          }
        </Table.Body>
      </Table>
    </>
  )
}

function Row({ index, name, teacher }) {
  return (
    <Table.Row>
      <Table.Cell content={index} />
      <Table.Cell content={name} />
      { teacher ? <Table.Cell content={teacher} /> : null }
    </Table.Row>
  )
}
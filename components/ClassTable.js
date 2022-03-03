import { useState, useEffect } from "react";
import { Table, Message, Modal } from "semantic-ui-react";

import fetchJson from "lib/iron-session/fetchJson";
import PlaceHolder from "./PlaceHolder";

export default function ClassTable({ user }) {

  const [ classList, setClassList ] = useState([]);
  const [ fetchOptions, setFetchOptions ] = useState({ fetching: false, fetched: false });
  const [ error, setError ] = useState("");
  const [ modal, setModal ] = useState({
    open: false,
    list: []
  })

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
        if (user.userType === "admin") setClassList(response.result.data);
        else parseClassListDataTeacher(response.result);
      }

    } catch (error) {
      console.error(error);
      setError("An unknown error has occured. Please contact your administrator or check the console/logs.")
    }

    setFetchOptions({ fetched: true, fetching: false });
  }

  function parseClassListDataTeacher(list) {
    setClassList(list.map(element => {
      return {
        classRefID: element.classRefID,
        name: element.name
      }
    }))
  }

  function handleModalClose() {
    setModal({
      ...modal,
      open: false
    })
  }

  function handleRowClick(index) {
    console.log(index)
  }

  if (fetchOptions.error) return <PlaceHolder iconName="close" message="Error fetching classes." extraContent="Please contact your adminstrator." />
  if (fetchOptions.fetching) return <PlaceHolder iconName="hourglass half" message="Please wait." extraContent="We're fetching the classes." />;

  return (
    <>
      <StudentsModal open={modal.open} onClose={handleModalClose} list={modal.list} />
      <Table attached="bottom" style={{ cursor: "pointer" }} celled selectable striped>
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
              if (user.userType === "admin") return (
                <Row
                  key={index}
                  index={index + 1}
                  name={element.name}
                  teacher={`${element.teacher.name} (${element.teacher.email})`}
                  onRowClick={_e => handleRowClick(index)}
                />
              )
              else return (
                <Row
                  key={index}
                  index={index + 1}
                  name={element.name}
                />)
            })
          }
        </Table.Body>
      </Table>
    </>
  )
}

function Row({ index, name, teacher, onRowClick }) {
  return (
    <Table.Row onClick={onRowClick} >
      <Table.Cell content={index} />
      <Table.Cell content={name} />
      { teacher ? <Table.Cell content={teacher} /> : null }
    </Table.Row>
  )
}

function StudentsModal({ open, onClose, rows }) {
  return (
    <Modal
      header="Students"
      open={open}
      onClose={onClose}
      content={
        <Table>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      }
      closeIcon
    />
  )
}
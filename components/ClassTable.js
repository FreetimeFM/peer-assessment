import { useState, useEffect } from "react";
import { Table, Message } from "semantic-ui-react";

import fetchJson from "lib/iron-session/fetchJson";
import useStorage from "lib/useStorage.ts";
import Placeholder from "./Placeholder";

export default function ClassTable({ user }) {

  if (user.userType !== "admin") return <Placeholder iconName="time" message="Not available." extraContent="This feature hasn't been implemented yet." />

  const storage = useStorage();
  const [ classList, setClassList ] = useState([]);
  const [ fetchOptions, setFetchOptions ] = useState({ fetching: false, fetched: false });
  const [ error, setError ] = useState("");

  useEffect(() => {
    fetchClassList();
  }, [])

  async function fetchClassList() {
    if (fetchOptions.fetched || classList.length >= 1) return;
    setFetchOptions({ ...fetchOptions, fetching: true });

    if (storage.getItem("classes") !== undefined) {
      const list = JSON.parse(storage.getItem("classes"));
      if (list === undefined || list.length === 0) {
        console.log("run")
        setClassList(list);
        setFetchOptions({ fetched: true, fetching: false });
        return;
      }
    }

    try {

      const response = await fetchJson("/api/get_classes", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      console.log(response);

      if (response.error) {
        console.error(error);
        setError(response?.clientMessage);
      } else {
        storage.setItem("classes", JSON.stringify(response.result.data));
      }

    } catch (error) {
      console.error(error);
      setError("An unknown error has occured. Please contact your administrator or check the console/logs.")
    }

    setFetchOptions({ fetched: true, fetching: false });
  }

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
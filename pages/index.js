import React, { useState } from 'react';
import Meta from "../components/Meta";
import useUser from "../lib/iron-session/useUser";
import fetchJson, { FetchError } from "../lib/iron-session/fetchJson";

import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  CardHeader,
} from "reactstrap"

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/student",
    redirectIfFound: true,
  });

  async function onSubmitHandler(e) {
    e.preventDefault();

    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({"email": email, "password": password}),
        }),
      );

    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error)
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }


  return (
    <>
      <Meta />

        <Container className="container-md" >
          <div className="position-absolute top-50 start-50 translate-middle">
            <Card className="shadow-lg b-5 rounded">
              <CardHeader className="text-center p-5">
                <h4>Welcome to the Peer Assessment System</h4>
                <h5>Please enter your login details</h5>
              </CardHeader>

              <CardBody className="p-5 text-center">
                <Form method="POST" onSubmit={onSubmitHandler} inline>
                  <FormGroup floating>
                    <Input
                      id="emailField"
                      name="email"
                      placeholder=" "
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Label for="emailField">Email</Label>
                  </FormGroup>
                  <FormGroup floating>
                    <Input
                      id="pwField"
                      name="password"
                      placeholder=" "
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Label for="pwField">Password</Label>
                  </FormGroup>
                  <Button className="px-4 py-2">Login</Button>
                </Form>
              </CardBody>
            </Card>

          </div>
        </Container>

    </>
  );
}
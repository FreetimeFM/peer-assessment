import React, { useState } from "react";
import Joi from "joi";
import Meta from "../components/Meta";
import useUser from "../lib/iron-session/useUser";
import fetchJson, { FetchError } from "../lib/iron-session/fetchJson";

import { Alert, Button, Card, CardHeader, CardBody, Container, Form, FormFeedback, FormGroup, Input, Label, Spinner } from "reactstrap";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [formCheck, setFormCheck] = useState(false);

  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  async function onSubmitHandler(e) {

    e.preventDefault();
    setFormCheck(true);
    setEmailError("");
    setPasswordError("");
    setApiError("");

    setEmail(email.trim());
    setPassword(password.trim());

    const emailCheck = Joi.string()
    .email({tlds: false})
    .required()
    .messages({
      "string.email": "Invalid email address",
      "string.empty": "Cannot be empty"
    })
    .validate(email);

    if (emailCheck.error) setEmailError(emailCheck.error.details[0].message)

    const passwordCheck = Joi.string()
    .max(150)
    .required()
    .messages({
      "string.max": "Too long",
      "string.empty": "Cannot be empty"
    })
    .validate(password)

    if (passwordCheck.error) setPasswordError(passwordCheck.error.details[0].message)

    if (emailCheck.error || passwordCheck.error) {
      setFormCheck(false);
      return;
    }

    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        })
      );
    } catch (error) {
      if (error instanceof FetchError) {

        switch (error.data.errorCode) {
          case 100 || 300:
            setApiError("An error has occured server-side. Please contact your administrator.");
            break;

          case 101 || 102 || 103:
            setApiError("The details you have entered are incorrect.");
            break;

          default:
            setApiError("An unknown error has occured.Please contact your administrator.");
            break;
        }

      } else {
        setApiError("An error has occured server-side. Please contact your administrator.");
      }

      console.error("Error: ", error, error.data);
    }
    setFormCheck(false);
  }

  return (
    <div>
      <Meta />

      <Container className="d-flex justify-content-center">
        <div className="position-absolute top-50 translate-middle-y">
          <Card className="shadow-lg b-5 rounded m-3">
            <CardHeader className="text-center p-sm-5">
              <h4>Welcome to the Peer Assessment System</h4>
              <p className="mb-0">Please enter your login details</p>
            </CardHeader>

            <CardBody className="px-sm-5 py-sm-4 pb-0">
              <Alert className="p-2 text-center" color="danger" hidden={apiError === ""}><p className="mb-0">{apiError}</p></Alert>
              <Form method="POST" onSubmit={onSubmitHandler} inline>
                <FormGroup floating>
                  <Input
                    id="emailField"
                    name="email"
                    placeholder=" "
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    invalid={emailError !== ""}
                    disabled={formCheck}
                    required
                  />
                  <Label for="emailField">Email</Label>
                  <FormFeedback>
                    {emailError}
                  </FormFeedback>
                </FormGroup>
                <FormGroup floating>
                  <Input
                    id="pwField"
                    name="password"
                    placeholder=" "
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={passwordError !== ""}
                    disabled={formCheck}
                    maxLength={150}
                    required
                  />
                  <Label for="pwField">Password</Label>
                  <FormFeedback>
                    {passwordError}
                  </FormFeedback>
                </FormGroup>
                {/* <FormGroup check>
                  <Input type="checkbox" />
                  <Label check>Remember Me</Label>
                </FormGroup> */}

                <FormGroup className="text-center">
                  <Button
                    className="px-4 py-2"
                    disabled={formCheck}
                  >
                    {
                      formCheck ? <Spinner size="sm" /> : "Login"
                    }
                  </Button>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
}

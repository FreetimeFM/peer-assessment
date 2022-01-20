import React, { useState } from "react";
import Joi from "joi";
import Meta from "../components/Meta";
import useUser from "../lib/iron-session/useUser";
import fetchJson, { FetchError } from "../lib/iron-session/fetchJson";
import { Grid, Segment, Form, Button, Header, Icon, Divider, Message } from "semantic-ui-react";

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

    const emailCheck = Joi.string()
    .email({tlds: false})
    .trim()
    .max(500)
    .required()
    .messages({
      "string.max": "Too long",
      "string.email": "Invalid email address",
      "string.empty": "Cannot be empty"
    })
    .validate(email);

    if (emailCheck.error) setEmailError(emailCheck.error.details[0].message)

    const passwordCheck = Joi.string()
    .trim()
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

        if (error.data.clientMessage) setApiError(error.data.clientMessage);
        else setApiError("An error has occured. Please contact your administrator.");

      } else {
        setApiError("An error has occured server-side. Please contact your administrator.");
      }

      console.error("Error: ", error, error.data);
    }
    setFormCheck(false);
  }

  return (
    <>
      <Meta />

      <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form onSubmit={onSubmitHandler} loading={formCheck} error={apiError !== ""}>
            <Segment stacked>
              <Header as="h2" icon style={{ marginBottom: 0 }}>
                <Icon name="sign in" />
                Peer Assessment System
                <Header.Subheader>Please enter your login details.</Header.Subheader>
              </Header>
              <Divider />
              <Message content={apiError} error/>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={(e) => setEmail(e.target.value)}
                error={
                  emailError === ""
                    ? false
                    : {
                        content: emailError,
                        pointing: "below",
                      }
                }
                required
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                error={
                  passwordError === ""
                    ? false
                    : {
                        content: passwordError,
                      }
                }
                required
              />

              <Button type="submit" size="large" fluid>
                Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </>
  );
}

import React, { useState } from "react";
import Joi from "joi";
import Metadata from "../components/Metadata";
import useUser from "../lib/iron-session/useUser";
import fetchJson, { FetchError } from "../lib/iron-session/fetchJson";
import { Grid, Segment, Form, Button, Header, Icon, Divider, Message } from "semantic-ui-react";

export default function Home() {

  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  const [ details, setDetails ] = useState({
    email: "",
    password: ""
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [formCheck, setFormCheck] = useState(false);

  function handleChange(_e, { name, value }) {
    setDetails({
      ...details,
      [name]: value
    })
  }

  async function validate() {

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
    .validate(details.email);

    const passwordCheck = Joi.string()
    .trim()
    .max(150)
    .required()
    .messages({
      "string.max": "Too long",
      "string.empty": "Cannot be empty"
    })
    .validate(details.password);

    if (emailCheck.error) setEmailError(emailCheck.error.details[0].message);
    if (passwordCheck.error) setPasswordError(passwordCheck.error.details[0].message);
  }

  async function onSubmitHandler(e) {

    e.preventDefault();
    setFormCheck(true);
    setEmailError("");
    setPasswordError("");
    setApiError("");

    await validate();

    if (emailError != "" || passwordError != "") {
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
          body: JSON.stringify({ email: details.email, password: details.password }),
        })
      );
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.data.clientMessage) setApiError(error.data.clientMessage);
      }

      if (apiError === "") setApiError("An error has occured server-side. Please contact your administrator.");
      console.error("Error: ", error, error.data);
    }
    setFormCheck(false);
  }

  return (
    <>
      <Metadata />

      <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form onSubmit={onSubmitHandler} loading={formCheck} error={apiError !== ""}>
            <Segment>
              <Header as="h2" icon style={{ marginBottom: 0 }}>
                <Icon name="sign in" />
                Peer Assessment System
                <Header.Subheader>Please enter your login details.</Header.Subheader>
              </Header>
              <Divider />
              <Message content={apiError} error/>
              <Form.Input
                name="email"
                type="email"
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                maxLength={500}
                onChange={handleChange}
                error={ emailError === "" ? false : {content: emailError, pointing: "below"} }
                required
                fluid
              />
              <Form.Input
                name="password"
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                maxLength={150}
                onChange={handleChange}
                error={ passwordError === "" ? false : {content: passwordError} }
                required
                fluid
              />

              <Button
                type="submit"
                content="Sign in"
                size="large"
                color={emailError || passwordError || apiError ? "red" : "blue"}
                fluid
              />
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </>
  );
}

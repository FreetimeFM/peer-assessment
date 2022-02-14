import React, { useState } from "react";
import Joi from "joi";
import { Grid, Segment, Form, Button, Header, Icon, Divider, Message } from "semantic-ui-react";

import Metadata from "../components/Metadata";
import useUser from "../lib/iron-session/useUser";
import fetchJson from "../lib/iron-session/fetchJson";

export default function Home() {

  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/dashboard",
    redirectIfFound: true,
  });

  // Stores form data.
  const [ details, setDetails ] = useState({
    email: "",
    password: ""
  });

  // Stores the errors.
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  // Determines where the form disables and shows the loading spinner.
  const [formCheck, setFormCheck] = useState(false);

  // Stores new values from the fields as the user types their details.
  function handleChange(_e, { name, value }) {
    setDetails({
      ...details,
      [name]: value
    })
  }

  // Uses joi to validate the email address and password.
  async function validate() {

    const emailCheck = Joi.string()
    .required() // Checks if field is empty.
    .trim() // Removes leading and trailing whitespace.
    .max(500) // Checks if its too long (500 chars).
    .email({tlds: false}) // Checks email.
    .messages({ // Various error messages according to which test it failed.
      "string.max": "Too long",
      "string.email": "Invalid email address",
      "string.empty": "Cannot be empty"
    })
    .validate(details.email);

    const passwordCheck = Joi.string()
    .required()
    .trim()
    .max(150)
    .messages({
      "string.max": "Too long",
      "string.empty": "Cannot be empty"
    })
    .validate(details.password);

    // Sets the error messages.
    if (emailCheck.error) setEmailError(emailCheck.error.details[0].message);
    if (passwordCheck.error) setPasswordError(passwordCheck.error.details[0].message);
  }

  // This method is run when the user attempts to submit.
  async function onSubmitHandler(e) {

    e.preventDefault();
    setFormCheck(true); // Disables form and shows loading spinner.

    // Clears errors.
    setEmailError("");
    setPasswordError("");
    setApiError("");

    // Validates email and password.
    await validate();

    // If there are errors then enable form to retry.
    if (emailError !== "" || passwordError !== "") {
      setFormCheck(false);
      return;
    }

    // Attemps to contact the server to check details.
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

      // If successful wait for redirect.
      return;

    } catch (error) {

      // Checks if there is custom error data and displays it.
      if (error?.data?.hasOwnProperty("clientMessage")) setApiError(error.data.clientMessage);

      // If no custom error data is found.
      else setApiError("An error has occured. Please contact your administrator.");
      console.error("Error: ", error, error.data);
    }
    setFormCheck(false); // Stops spinner and enables form.
  }

  return (
    <>
      <Metadata />

      <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form onSubmit={onSubmitHandler} loading={formCheck} error={apiError !== ""}>
            <Segment raised>

              <Header as="h2" style={{ marginBottom: 0 }} icon>
                <Icon name="sign in" />
                Peer Assessment System
                <Header.Subheader content="Please enter your login details."/>
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

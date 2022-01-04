import Meta from "../components/Meta"

import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap"

export default function Home() {
  return (
    <>
      <Meta />

      <Container className="">
        <Card className="d-flex">
          <CardBody>
            <Form inline>
              <FormGroup floating>
                <Input id="exampleEmail" name="email" placeholder="Email" type="email" />
                <Label for="exampleEmail">Email</Label>
              </FormGroup>
              <FormGroup floating>
                <Input id="examplePassword" name="password" placeholder="Password" type="password" />
                <Label for="examplePassword">Password</Label>
              </FormGroup>
              <Button>Submit</Button>
            </Form>

          </CardBody>

        </Card>
      </Container>
    </>
  );
}

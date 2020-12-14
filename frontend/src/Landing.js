import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { Form, FormControl } from 'react-bootstrap';


function Landing() {
  return (
    <div style={{ backgroundColor: "#D4CB92" }}>
      <Jumbotron fluid>
        <Container>
          <Image src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg" ALIGN="right" />
          <br />
          <div style={{ fontSize: "70px" }}>
            <h1>Strife</h1>
          </div>
          <br />
          <p>
            Welcome to Strife, a chatting forum for highschool and college students.
    </p>
          <br />
          <p>
            In order to read or view posts, Strife only asks for your highschool
            or college name. We ensure that the rest of your identity will be anonymous.
    </p>
          <Form>
            <Form.Group controlId="formGroupSchool">
              <Form.Label>Enter School Name</Form.Label>
              <Form.Control type="school" placeholder="Enter school" />
            </Form.Group>
          </Form>
        </Container>
      </Jumbotron>
    </div>
  )
}

export default Landing;
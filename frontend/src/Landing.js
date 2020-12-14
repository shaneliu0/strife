import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { Form, FormControl } from 'react-bootstrap';


function Landing() {
  return (
    <div style={{backgroundColor:"#D4CB92"}}>
  <Jumbotron fluid>
    <Container>
      <Image src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg" ALIGN="right" />
      <div style={{ fontSize: "90px" }}>
        <p>Strife</p>
      </div>
      <p>
        Welcome to Strife, a chatting forum for highschool and college students.
    </p>
    <br/>
      <p>
        In order to read or view posts, Strife only asks for your highschool
        or college name. We ensure that the rest of your identity will be anonymous.
    </p>
      <br />
      <div style={{ width: "45%" }}>
        <Form>
          <Form.Group controlId="formGroupSchool">
            <Form.Label><b>Enter School Name</b></Form.Label>
            <Form.Control type="school" placeholder="Enter school" />
          </Form.Group>
        </Form>
      </div>
    </Container>
  </Jumbotron>
</div >
  )
}

export default Landing;
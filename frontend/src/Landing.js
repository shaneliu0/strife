import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { Form, FormControl } from 'react-bootstrap';


function Landing() {
  return (
    <div style={{ fontFamily: "Trebuchet MS" }}>
      <div style={{ backgroundColor: "#D4CB92" }}>
        <Jumbotron fluid>
          <Container>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "80px" }}>
                <p>Strife</p>
              </div>
            </div>
            <Image src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg" ALIGN="right" />
            <br />
            <div style={{ fontSize: "18px" }}>
            <p>
              Welcome to <b>Strife</b>, a chatting forum for highschool and college students.
          </p>
          </div>
            <br />
            <p>
              To read or view our posts, Strife asks for your <b>highschool or college name</b>.
            <br /><br />We ensure that the rest of your identity will be anonymous.
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
            <br />
            <br />
            <br />
            <br />
          </Container>
        </Jumbotron>
      </div>
    </div>
  )
}

export default Landing;
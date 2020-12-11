import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { Form, FormControl } from 'react-bootstrap';


function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Get Started</h4>
        <p>
          In order to read or post trife only asks for your highschool or college name 
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

function Landing() {
  return (
<Jumbotron fluid>
  <Container>
    <h1>Strife</h1>
    <p>
      Welcome to Strife, a chatting forum for highschool and college students.
    </p>
    <App/>
  </Container>
</Jumbotron>
  )
}

export default Landing;
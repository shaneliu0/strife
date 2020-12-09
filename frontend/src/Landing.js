import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function Landing() {
    return (
<Jumbotron fluid>
  <Container>
    <h1>Strife</h1><br></br>
    <p>
      Welcome to Strife, a chatting forum for highschool and college students.
    </p>
  </Container>
</Jumbotron>
    )
}

export default Landing;
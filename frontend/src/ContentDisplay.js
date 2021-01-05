import React, { Component, useState } from 'react';
import {
    useLocation,
    withRouter,
    useHistory
} from "react-router-dom";
import { Jumbotron, Modal, Button, Container, Row, Col, Card, ButtonGroup, Form, ButtonToolbar, Badge } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
}  

class PreSchool extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjectArray: new Array(10).fill({ name: undefined, id: undefined })
        }

    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/comments').then(resp => resp.json())
            .then((json) => this.setState({ subjectArray: json }))
    }

    renderSubjectList() {
        return this.state.subjectArray.map((data, index) => {
            return <SubjectRow {...data} />
        })
    }

    render() {
        return (
            <div>
                <div style={{ fontFamily: "Trebuchet MS" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "30px" }}>
                            <br />
                            <p> View and select from our subject list below.</p>
                        </div>
                    </div>
                    <Button variant="warning" size="lg" block> General  </Button>
                    <Button variant="warning" size="lg" block> Science </Button>
                    <Button variant="warning" size="lg" block> English  </Button>
                    <Button variant="warning" size="lg" block> History </Button>
                    <Button variant="warning" size="lg" block> Math  </Button>
                    {this.renderSubjectList()}
                </div>
            </div>
        )
    }
}

const School = withRouter(PreSchool);

function SubjectRow(props) {
    const history = useHistory();
    const { pathname } = useLocation();

    return (
        <p onClick={() => history.push(`${pathname}/${props.id}`)}>{props.name || <Skeleton />}</p>
    )
}

class Subject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "Test Subject",
            postsArray: new Array(9).fill({ title: undefined, body: undefined, id: undefined }),
            postForm: {
                name: "shane"
            }
        }
    }

    componentDidMount() {
        fetch(`https://jsonplaceholder.typicode.com/posts`).then(resp => resp.json()).then(resp => this.setState({ postsArray: resp }))
    }

    renderPosts() {
        return this.state.postsArray.map((data, index) => {
            return <Col sm={4}><PostCard {...data} /></Col>
        })
    }

    render() {
        return (
            <Container style={{ marginTop: "20px" }}>
                <Row>
                    <Col>
                        <Form>
                            <h3>Create a Post</h3>
                            <Form.Group controlId="formBasicText">
                                <Form.Control required placeholder="Title" />
                            </Form.Group>
                            <Form.Group controlId="formBasicText">
                                <Form.Control as="textarea" rows={3} placeholder="Text" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    {this.renderPosts()}
                </Row>
            </Container>
        )
    }
}

function PostCard(props) {
    const cardStyle = {
        margin: "10px"
    }
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <Card style={cardStyle}>
            <Card.Body>
                <Card.Title>{props.title || <Skeleton />}</Card.Title>
                <Card.Text>
                    {props.body || <Skeleton count={10} />}
                </Card.Text>
                <Button variant="primary" size="sm" onClick={() => setModalShow(true)}>
                    Comments
                </Button>
                <CommentModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <ButtonToolbar aria-label="Like and dislike button groups" className="float-right">
                    <ButtonGroup aria-label="Vote Group" size="sm" className="mr-1">
                        <Button variant="success">
                            <span role="img" aria-label="thumbsup">👍</span>
                            <Badge pill variant="light">0</Badge>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Second group" size="sm">
                        <Button variant="danger">
                            <span role="img" aria-label="thumbsdown">👎</span>
                            <Badge pill variant="light">0</Badge>
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Card.Body>
        </Card>
    )
}

function CommentModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a Comment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formComment">
                <Form.Control type="comment" placeholder="Type comment here" />
                </Form.Group>
                <ButtonToolbar aria-label="Submit and cancel button groups" className="float-right">
                    <ButtonGroup className="mr-2" aria-label="First Group">
                        <Button onClick={props.onHide}>Submit</Button>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Second Group">
                        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Form>
            <br />
            <br />
            <Card>
                <Card.Body>
                    <Card.Text>asjfjafj</Card.Text>
                    <ButtonToolbar aria-label="Like and dislike button groups" className="float-left">
                    <ButtonGroup aria-label="First group" size="sm" className="mr-1">
                        <Button variant="dark">
                            Reply
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Second group" size="sm" className="mr-1">
                        <Button variant="success">
                            <span role="img" aria-label="thumbsup">👍</span>
                            <Badge pill variant="light">0</Badge>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Third group" size="sm">
                        <Button variant="danger">
                            <span role="img" aria-label="thumbsdown">👎</span>
                            <Badge pill variant="light">0</Badge>
                        </Button>
                    </ButtonGroup>
                    </ButtonToolbar>
                </Card.Body>
            </Card>
        </Modal.Body>
      </Modal>
    );
  }

function ContentDisplay() {
    // const { path } = use
    let { pathname } = useLocation();
    let pathArray = pathname.split('/');
    const schoolId = pathArray[1];
    const subjectId = pathArray[2];
    const { history } = useHistory();
    if (schoolId && subjectId) {
        return (
            <Container><Subject schoolId={schoolId} subjectId={subjectId} /></Container>

        )
    } else if (schoolId || subjectId) {
        return (
            <Container><School schoolId={schoolId} /></Container>
        )
    } else {
        return null;
    }
}

export default ContentDisplay;
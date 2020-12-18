import React, { Component, useState } from 'react';
import {
    useLocation,
    withRouter,
    useHistory
} from "react-router-dom";
import { Jumbotron, Modal, Button, Container, Row, Col, Card, ButtonGroup, Form } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';

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
            postsArray: new Array(9).fill({ title: undefined, body: undefined, id: undefined })
        }
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/posts').then(resp => resp.json()).then(resp => this.setState({ postsArray: resp }))
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

    return (
        <Card style={cardStyle}>
            <Card.Body>
                <Card.Title>{props.title || <Skeleton />}</Card.Title>
                <Card.Text>
                    {props.body || <Skeleton count={10} />}
                </Card.Text>
                <CommentModal />
                <ButtonGroup aria-label="Vote Group">
                    <Button variant="success">Like</Button>
                    <Button variant="danger">Dislike</Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    )
}

function CommentModal() {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Modal>
                <Modal.header>
                    <Modal.Title>aaa123</Modal.Title>
                </Modal.header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formComment">
                            <Form.Control type="comment" placeholder="Type comment here" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Submit
                </Button>
                </Modal.Footer>
            </Modal>
            <Button variant="primary" onClick={() => setShow(true)}>Comment</Button>
        </>
    )
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
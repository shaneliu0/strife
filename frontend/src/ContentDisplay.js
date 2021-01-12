import React, { Component, useState } from 'react';
import {
    useLocation,
    withRouter,
    useHistory
} from "react-router-dom";
import { Jumbotron, Modal, Button, Container, Row, Col, Card, ButtonGroup, Form, ButtonToolbar, Badge } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import CircularProgress from '@material-ui/core/CircularProgress';

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
        this.setState({
            subjectArray: [
                { name: "Math", id: "1f4b7f1a-a8f1-4868-80b8-535ebc2e5d92" },
                { name: "Science", id: "f99aaf6a-e654-4636-a39c-1126fe22e014" },
                { name: "English", id: "8bc96b8b-2e74-46c5-8b85-efb8014ca822" },
                { name: "Social Studies", id: "76650326-ff8d-41b3-947c-93b1ff5ccd53" }
            ]
        })
    }

    renderSubjectList() {
        return this.state.subjectArray.map((data, index) => {
            return <SubjectRow {...data} {...this.props} />
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
        <Button variant="warning" size="lg" block onClick={() => {
            props.setSubjectName(props.name)
            history.push(`${pathname}/${props.id}`)
        }}>{props.name || <Skeleton />}</Button>
    )
}

class Subject extends Component {
    constructor(props) {
        super(props);

        this.titleInputRef = React.createRef();
        this.bodyInputRef = React.createRef();

        this.state = {
            id: this.props.subjectId,
            postsArray: undefined,
            buttonText: "Submit"
        }
    }

    componentDidMount() {
        fetch(`${window.location.origin}/api/all`).then(resp => resp.json()).then(resp => this.setState({ postsArray: resp.filter(e => e.subject_name === this.state.id) }))
        this.checkPostInterval = setInterval(() => fetch(`${window.location.origin}/api/all`).then(resp => resp.json()).then(resp => this.setState({ postsArray: resp.filter(e => e.subject_name === this.state.id) })), 2000)
    }

    componentWillUnmount() {
        clearInterval(this.checkPostInterval)
    }

    renderPosts() {
        return this.state.postsArray.reverse().map((data, index) => {
            return <Col sm={4}><PostCard {...data} /></Col>
        })
    }

    async handlePost() {
        if (!(this.titleInputRef.current.value || this.bodyInputRef.current.value)) {
            this.setState({
                buttonText: "Couldn't send; fill out all the fields!"
            })
            return;
        }

        await postData(`${window.location.origin}/api`, {
            title: this.titleInputRef.current.value,
            body: this.bodyInputRef.current.value,
            school_id: "pwest",
            subject_name: this.state.id
        })
        this.setState({
            buttonText: "Posted!"
        })
        await fetch(`${window.location.origin}/api/all`).then(resp => resp.json()).then(resp => this.setState({ postsArray: resp.filter(e => e.subject_name === this.state.id) }))
    }

    render() {
        return (
            <Container style={{ marginTop: "20px" }}>
                <h1>Viewing {this.props.subjectName}</h1>
                <Row>
                    <Col>
                        <Form style={{
                            marginLeft: "10px",
                            marginRight: "10px"
                        }}>
                            <h3>Create a Post</h3>
                            <Form.Group controlId="formBasicText">
                                <Form.Control ref={this.titleInputRef} required placeholder="Title" />
                            </Form.Group>
                            <Form.Group controlId="formBasicText">
                                <Form.Control ref={this.bodyInputRef} as="textarea" rows={3} placeholder="Text" />
                            </Form.Group>
                            <Button onClick={() => this.handlePost()} variant="primary">
                                {this.state.buttonText}
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    {this.state.postsArray ? this.renderPosts() : <CircularProgress color="secondary" style={{
                        marginLeft: "50%",
                        marginTop: "100px"
                    }} /> }
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
                        <Card.Text>Comment</Card.Text>
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
    const [subjectName, setSubjectName] = useState(undefined);

    if (schoolId && subjectId) {
        return (
            <Container><Subject schoolId={schoolId} subjectId={subjectId} subjectName={subjectName} /></Container>
        )
    } else if (schoolId || subjectId) {
        return (
            <Container><School schoolId={schoolId} setSubjectName={setSubjectName} /></Container>
        )
    } else {
        return null;
    }
}

export default ContentDisplay;
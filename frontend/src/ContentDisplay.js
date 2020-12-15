import React, { Component, useState } from 'react';
import {
    useLocation,
    withRouter,
    useHistory
} from "react-router-dom";
import { Jumbotron, Modal, Button, Container, Row, Col, Card } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';

class PreSchool extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjectArray: [
                {
                    name: "Advanced Software Dev",
                    id: "293478234987234789"
                },
                {
                    name: "AP Calc BC",
                    id: "450986230948342089"
                }
            ]
        }
    }

    renderSubjectList() {
        return this.state.subjectArray.map((data, index) => {
            return <p onClick={() => this.props.history.push('hello')}>{data.name}</p>
        })
    }

    render() {
        return (
            <div>
                {this.renderSubjectList()}
            </div>
        )
    }
}

const School = withRouter(PreSchool);

class Subject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "Test Subject",
            postsArray: new Array(9).fill({ title: undefined, body: undefined, id: undefined })
        }
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/posts').then(resp => resp.json()).then(resp => this.setState({postsArray: resp}))    
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
                    {props.body || <Skeleton count={10}/>}
                </Card.Text>
                <Button variant="primary" onClick={commentModal}>Comment</Button>
                <ButtonGroup aria-label="Vote Group">
                    <Button variant="success">Like</Button>
                    <Button variant="danger">Dislike</Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    )
}

function commentModal() {
    const[show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Modal>
            <Modal.header>
                <Modal.Title>aaa123</Modal.Title>
            </Modal.header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formComment">
                        <Form.Control type="comment" placeholder="Type comment here"/>
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
            <Subject schoolId={schoolId} subjectId={subjectId} />
        )
    } else if (schoolId || subjectId) {
        return (
            <School schoolId={schoolId} />
        )
    } else {
        return null;
    }
}

export default ContentDisplay;
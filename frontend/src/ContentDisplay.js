import React, { Component, useEffect, useState } from 'react';
import {
    useLocation,
    withRouter,
    useHistory
} from "react-router-dom";
import { Jumbotron, Modal, Button, Container, Row, Col, Card, ButtonGroup, Form, ButtonToolbar, Badge } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyCIkEPm1k9y9BCcfuLbVG8Fz5AMvbCLJ1Y",
    authDomain: "strife-a45aa.firebaseapp.com",
    databaseURL: "https://strife-a45aa-default-rtdb.firebaseio.com",
    projectId: "strife-a45aa",
    storageBucket: "strife-a45aa.appspot.com",
    messagingSenderId: "166046051395",
    appId: "1:166046051395:web:596a606710643ecf3838f6",
    measurementId: "G-L3ZWHBHTN9"
};

!firebase.apps.length && firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.database();

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
            buttonText: "Submit",
        }
    }

    checkForNewPosts() {
        fetch(`${window.location.origin}/api/subject/${this.state.id}`).then(resp => resp.json()).then(resp => this.setState({ postsArray: resp.reverse() }))
    }

    componentDidMount() {
        this.checkForNewPosts();
        this.checkPostInterval = setInterval(() => this.checkForNewPosts(), 2000)
    }

    componentWillUnmount() {
        clearInterval(this.checkPostInterval)
    }

    renderPosts() {
        return this.state.postsArray.map((data, index) => {
            return <Col sm={4}><PostCard {...data} /></Col>
        })
    }

    async handlePost() {
        if ((!this.titleInputRef.current.value || !this.bodyInputRef.current.value)) {
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
            buttonText: "Posted!",
            fieldValue: "",
        })
        this.setState({
            fieldValue: undefined
        })
        this.checkForNewPosts();
    }

    render() {
        return (
            <Container style={{ marginTop: "20px" }}>
                <h1>Viewing {this.props.subjectName || "Subject"}</h1>
                <Row>
                    <Col>
                        <Form style={{
                            marginLeft: "10px",
                            marginRight: "10px"
                        }}>
                            <h3>Create a Post</h3>
                            <Form.Group controlId="formBasicText">
                                <Form.Control value={this.state.fieldValue} ref={this.titleInputRef} required placeholder="Title" />
                            </Form.Group>
                            <Form.Group controlId="formBasicText">
                                <Form.Control value={this.state.fieldValue} ref={this.bodyInputRef} as="textarea" rows={3} placeholder="Text" />
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
                    }} />}
                </Row>
            </Container>
        )
    }
}

function PostCard(props) {
    const cardStyle = {
        margin: "10px"
    }
    const [modalShow, setModalShow] = useState(false);
    const [commentsArray, setCommentsArray] = useState(undefined)
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    useEffect(() => {
        let isMounted = true;
        db.ref(`${props.id}`).on('value', snap => {
            if (isMounted) {
                let data = snap.val();
                if (!data) return;

                let newCommentsArray = [];
                for (let commentKey in data.comments) {
                    newCommentsArray.push({
                        ...data.comments[commentKey],
                        commentKey: commentKey
                    })
                }
                setCommentsArray(newCommentsArray);

                setLikes(data.rating && data.rating.likes ? data.rating.likes : 0)
                setDislikes(data.rating && data.rating.dislikes ? data.rating.dislikes : 0)
            }
        })

        return () => { isMounted = false }
    }, [likes, dislikes, props.id])

    const handleLike = async () => {
        const data = likes;
        if (!validateAndMarkRating(props.id)) {
            return alert('You already rated!')
        }

        if (!data) {
            db.ref(`${props.id}/rating/likes`).set(1);
        } else {
            db.ref(`${props.id}/rating/likes`).set(data + 1)
        }
    }

    const handleDislike = async () => {
        const data = dislikes;

        if (!validateAndMarkRating(props.id)) {
            return alert('You already rated!')
        }

        if (!data) {
            db.ref(`${props.id}/rating/dislikes`).set(1);
        } else {
            db.ref(`${props.id}/rating/dislikes`).set(data + 1)
        }
    }

    return (
        <Card style={cardStyle}>
            <Card.Body>
                <Card.Title>{props.title || <Skeleton />}</Card.Title>
                <Card.Text>
                    {props.body || <Skeleton count={10} />}
                </Card.Text>
                <Button variant="primary" size="sm" onClick={() => setModalShow(true)}>
                    Comments ({commentsArray ? commentsArray.length : 0})
                </Button>
                <CommentModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    {...props}
                    commentsArray={commentsArray}
                />
                <ButtonToolbar aria-label="Like and dislike button groups" className="float-right">
                    <ButtonGroup aria-label="Vote Group" size="sm" className="mr-1">
                        <Button variant="success" onClick={() => handleLike()}>
                            <span role="img" aria-label="thumbsup">👍</span>
                            <Badge pill variant="light">{likes}</Badge>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Second group" size="sm">
                        <Button variant="danger" onClick={() => handleDislike()}>
                            <span role="img" aria-label="thumbsdown">👎</span>
                            <Badge pill variant="light">{dislikes}</Badge>
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Card.Body>
        </Card>
    )
}

function CommentModal(props) {
    const commentDataRef = React.useRef(undefined);
    const [loading, setLoading] = useState(false);
    const [formText, setFormText] = useState(undefined);

    const handleComment = async (event) => {
        if (!commentDataRef.current.value) return;
        event.preventDefault();
        setLoading(true);
        await db.ref(`${props.id}/comments`).push({
            text: commentDataRef.current.value,
            likes: 0,
            dislikes: 0,
            time: new Date().getTime()
        });
        setLoading(false);
        setFormText("");
        setFormText(undefined);
    }

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
                <Form onSubmit={handleComment}>
                    <Form.Group controlId="formComment">
                        <Form.Control value={formText} ref={commentDataRef} type="comment" placeholder="Type comment here" />
                    </Form.Group>
                    <ButtonToolbar aria-label="Submit and cancel button groups" className="float-right">
                        <ButtonGroup className="mr-2" aria-label="First Group">
                            <div>
                                <Button disabled={loading} onClick={handleComment}>Submit {loading && <CircularProgress size={24} style={{ marginTop: "5px" }} />}</Button>
                            </div>
                        </ButtonGroup>
                        <ButtonGroup aria-label="Second Group">
                            <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Form>
                <br />
                <br />
                <Card>
                    {
                        !props.commentsArray || props.commentsArray.length === 0 ? <h4 style={{ margin: "20px" }}>No comments yet!</h4> : (
                            props.commentsArray.map((data, idx) => {
                                return <Comment {...data} {...props} />
                            })
                        )
                    }
                </Card>
            </Modal.Body>
        </Modal>
    );
}

function Comment(props) {
    const handleLike = async () => {
        if (!validateAndMarkRating(props.commentKey)) {
            return alert('You already rated!')
        }

        db.ref(`${props.id}/comments/${props.commentKey}/likes`).set(props.likes + 1)
    }

    const handleDislike = async () => {
        if (!validateAndMarkRating(props.commentKey)) {
            return alert('You already rated!')
        }

        db.ref(`${props.id}/comments/${props.commentKey}/dislikes`).set(props.dislikes + 1)
    }

    const timePosted = new Date(props.time);

    return (
        <Card.Body>
            <Card.Text>{props.text}</Card.Text>
            <ButtonToolbar aria-label="Like and dislike button groups" className="float-left">
                <ButtonGroup aria-label="Second group" size="sm" className="mr-1">
                    <Button variant="success" onClick={handleLike}>
                        <span role="img" aria-label="thumbsup">👍</span>
                        <Badge pill variant="light">{props.likes}</Badge>
                    </Button>
                </ButtonGroup>
                <ButtonGroup aria-label="Third group" size="sm">
                    <Button variant="danger" onClick={handleDislike}>
                        <span role="img" aria-label="thumbsdown">👎</span>
                        <Badge pill variant="light">{props.dislikes}</Badge>
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>
            {props.time && <Card.Text>{`${timePosted.toDateString()} ${formatDateNumbers(timePosted.getHours() % 12)}:${formatDateNumbers(timePosted.getMinutes())}:${formatDateNumbers(timePosted.getSeconds())} ${timePosted.getHours() >= 12 ? 'PM' : 'AM'}`}</Card.Text>}
        </Card.Body>
    )
}

function formatDateNumbers(number) {
    return ("0" + number).slice(-2)
}

function validateAndMarkRating(id) {
    try {
        const item = localStorage.getItem(id);

        if (item) {
            return false;
        } else {
            localStorage.setItem(id, "rated")
            return true;
        }
    } catch (error) {
        console.log(error);
        return true;
    }
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
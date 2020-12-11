import React, { Component, useState } from 'react';
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    // Link,
    // useRouteMatch,
    // useParams,
    // Redirect,
    useLocation
} from "react-router-dom";
import { Jumbotron, Modal, Button, Container, Row, Col, Card } from "react-bootstrap";

class School extends Component {
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
            return <p>{data.name}</p>
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

class Subject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            postsArray: [
                {
                    title: "How do I create a variable",
                    body: "Whenever I try to create a variable in python like int x = 123, it gives me an error."
                },
                {
                    title: "I love this class!",
                    body: "This class is great! I'm learning a lot of interesting things"
                },
                {
                    title: "Hello!!!",
                    body: "world..."
                }
            ]
        }
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
    return (
        <Card>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    {props.body}
                </Card.Text>
                <Button variant="primary">Comment</Button>
            </Card.Body>
        </Card>
    )

}

function ContentDisplay() {
    let { pathname } = useLocation();
    let pathArray = pathname.split('/');
    const schoolId = pathArray[1];
    const subjectId = pathArray[2];

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
import React, { Component } from 'react';
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
import { Modal}

import { Jumbotron } from "react-bootstrap";

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

    newPostModal() {
        const [show, setShow] = useState(false);
      
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
      
        return (
          <>
            <Button variant="primary" onClick={handleShow}>
              Launch demo modal
            </Button>
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }

    render() {
        return <p>Subject with ID {this.props.subjectId}, school ID {this.props.schoolId}</p>
    }
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
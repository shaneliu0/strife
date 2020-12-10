import React, { Component } from 'react';
import { Route, BrowserRouter as Router, useRouteMatch } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import Landing from './Landing';
import ContentDisplay from './ContentDisplay';

function Main() {
    return (
        <Router>
            <div>
            <Navbar bg="light" expand="lg" style={{ marginTop: "5px" }}>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    src={process.env.PUBLIC_URL + "/images/brand.png"}
                    style={{
                      height: "35px",
                      width: "auto",
                      marginTop: "-5px",
                      marginRight: "-5px",
                    }}
                    alt="S"
                  ></img>
                </Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <LinkContainer to="/app">
                    <Nav.Link>{"Home"}</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/resources">
                    <Nav.Link>{"Schools"}</Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
                <div>
                    <Route exact path="/" component={Landing} />
                    <Route path="/" component={ContentDisplay} />
                </div>
            </div>
        </Router>
    )
}

export default Main;
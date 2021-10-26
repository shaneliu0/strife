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
        <Navbar expand="lg">
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={"https://nerdist.com/wp-content/uploads/2019/04/House-Targaryen-sigil.jpg"}
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
              <LinkContainer to="/resources">
                <Nav.Link>{"Subjects"}</Nav.Link>
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
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    Redirect,
    useLocation
  } from "react-router-dom";


function ContentDisplay() {
    let { path } = useRouteMatch();
    let { pathname } = useLocation();

    console.log(pathname);

    return (
        <Switch>
            <Route path={`${path}`}></Route>
        </Switch>
    )
}

export default ContentDisplay;
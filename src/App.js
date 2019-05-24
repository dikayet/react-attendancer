import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Container } from 'react-bootstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserEdit, faUserTimes, faTrashAlt, faEdit, faChevronLeft, faChevronRight, faCheck } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import { signOut } from './store/actions/users';
import Auth from './containers/Auth/Auth';
import Index from './containers/Index/Index';

library.add(faUserEdit, faUserTimes, faTrashAlt, faEdit, faChevronLeft, faChevronRight, faCheck);

class App extends Component {
  render() {
    let nav;
    if(this.props.auth.uid){
      nav = (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <span variant="link" onClick={this.props.signOut}>Sign Out</span>
          </Navbar.Text>
        </Navbar.Collapse>
      );
    }

    return (
      <Router>
        <div className="App">

          <Navbar bg="dark" variant="dark" fixed="top">
            <Container>
              <Navbar.Brand>
                <Link to="/" style={{ margin: '.5rem' }}>Attendancer</Link>
              </Navbar.Brand>
              {nav}
            </Container>
          </Navbar>
            {!this.props.auth.uid 
              ? (
                <Switch>
                  <Route exact path="/" component={Auth} />
                  <Redirect to="/" />
                </Switch>
              )
            : (<Route path="/" component={Index} />)}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth
})

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

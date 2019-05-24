import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Container, Row, Col, Spinner, Alert, Collapse } from 'react-bootstrap';

import { signIn } from '../../store/actions/users';

class Auth extends Component {
  state = {
    id: '',
    pwd: ''
  }
  signIn = (e) => {
    e.preventDefault();
    const { id, pwd } = this.state;
    this.props.signIn(id, pwd);
  }
  onChange = (e) => {
    const { value, name} = e.target;
    this.setState({ [name]: value });
  }
  render() {
    const { error, loading } = this.props.signin;
    return (
      <div>
        <Container>
          <Row>
            <Col xs={{ span: 4, offset: 4 }}>
              <Collapse in={error ? true : false}>
                <div id="error">
                  <Alert dismissible variant="danger">
                    Login or password is not correct
                </Alert>
                </div>
              </Collapse>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md={4}>
              <Form onSubmit={!loading ? this.signIn : null}>
                <Form.Group controlId="auth">
                  <Form.Control 
                    type="email" 
                    placeholder="Your email"
                    onChange={this.onChange}
                    name="id" />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control 
                    type="password" 
                    placeholder="Your password"
                    onChange={this.onChange}
                    name="pwd" />
                </Form.Group>
                <Button variant="dark" type="submit" block>{!loading ? 'Login' : <Spinner size="sm" animation="border" variant="light" />}</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  signIn: (id, pwd) => dispatch(signIn(id, pwd))
})

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  signin: state.users.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
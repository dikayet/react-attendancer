import React, { Component } from 'react';
import { NavLink, Switch, Route, withRouter } from 'react-router-dom';
import { Row, Col, Badge, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import Users from './Users/Users';
import Classes from './Classes/Classes';
import Attendance from './Attendance/Attendance';

import { getAttAdmin } from '../../store/actions/attendance';

import styles from './Admin.module.sass';

class Admin extends Component {
  componentDidMount() {
    this.props.getAttAdmin();
  }
  render() {
    const { attLength, attLoading } = this.props;
    return (
      <div>
        <Row>
          <Col xs={12}>
            <div className={styles['tabs']}>
              <NavLink exact activeClassName={styles['active']} to="/">Attendance 
              {attLoading ? <Spinner style={{ marginLeft: '.5rem' }} size="sm" animation="border" variant="warning" /> : attLength > 0 ? <Badge style={{ marginLeft: '.5rem' }} variant="warning">{attLength}</Badge> : null}
              </NavLink>
              <NavLink activeClassName={styles['active']} to={{ pathname: '/users', hash: 'students' }}>Users</NavLink>
              <NavLink activeClassName={styles['active']} to={{ pathname: '/classes', hash: 'classes' }}>Classes</NavLink>
            </div>
            <Switch>
              <Route path="/users" component={Users} />
              <Route path="/classes" component={Classes} />
              <Route exact path="/" component={Attendance} />
            </Switch>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  attLength: state.attendance.list.length,
  attLoading: state.attendance.loading
})

const mapDispatchToProps = dispatch => ({
  getAttAdmin: () => dispatch(getAttAdmin())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Admin));
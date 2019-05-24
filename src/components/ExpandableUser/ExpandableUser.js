import React, { Component } from 'react'
import { ListGroup, Button, Collapse, Container, Badge } from 'react-bootstrap';

import styles from './ExpandableUser.module.sass';

class ExpandableUser extends Component {
  state = {
    expanded: false
  }
  openExpanded = () => {
    console.log('open')
    this.setState({ expanded: true })
  }
  closeExpanded = () => {
    this.setState({ expanded: false })
  }
  render() {
    const { user, children } = this.props;
    const { expanded } = this.state;
    return (
      <ListGroup.Item>
        <div className={styles['header']}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <h5 style={{marginRight: '.5rem'}}>{user.firstname} {user.lastname} </h5>
            {user.role === 's' && user.attendance.length > 0 ? <Badge variant="warning">{user.attendance.length}</Badge> : null}
          </div>
          <Button
            size="sm"
            variant="light"
            onClick={expanded ? this.closeExpanded : this.openExpanded}
          >
            {expanded ? 'Close details' : 'See details'}
          </Button>
        </div>
        <Collapse in={expanded}>
          <div id="details" className={styles['details']}>
            <Container style={{ marginTop: '1.5rem' }}>
              {children}
            </Container>
          </div>
        </Collapse>
      </ListGroup.Item>
    )
  }
}
export default ExpandableUser;
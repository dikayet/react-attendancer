import React from 'react';
import { connect } from 'react-redux';

import styles from './Index.module.sass';

import { Container } from 'react-bootstrap';
import Teacher from '../Teacher/Teacher';
import Admin from '../Admin/Admin';
import Student from '../Student/Student';

const Index = props => {
  const { profile } = props;
  return (
    <div className={styles['index']}>
      <Container>
        {
          profile.role === 'a' ? <Admin /> : 
          profile.role === 't' ? <Teacher /> : 
          profile.role === 's' ? <Student /> : 
          null
        }
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => ({
  profile: state.firebase.profile
});

export default connect(mapStateToProps)(Index);
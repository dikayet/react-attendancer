import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Carousel, Button, Spinner } from 'react-bootstrap';

import img01 from '../../../assets/img01.png'
import img02 from '../../../assets/img02.png'
import img03 from '../../../assets/img03.png'
import { acceptDoc, declineDoc } from '../../../store/actions/attendance';

import styles from './Attendance.module.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Attendance extends Component {
  state = {
    current: 0
  }

  goBack = () => {
    const length = this.props.att.list.length;
    console.log('go backwards');
    if (length > 1){
      const { current } = this.state;
      this.setState({ current: current > 0 ? current - 1 : length - 1 })
    }
  }
  goForward = () => {
    const length = this.props.att.list.length;
    console.log('go forwards');
    if (length > 1) {
      const { current } = this.state;
      this.setState({ current: current === length - 1 ? 0 : current + 1 })
    }
  }
  decline = (index) => {
    console.log(index)
    const att = this.props.att.list[this.state.current];
    this.props.declineDoc(att.student.id, att.time, index);
  }
  accept = (index) => {
    const att = this.props.att.list[this.state.current];
    this.props.acceptDoc(att.student.id, att.time, index);
  }
  render() {
    const { att } = this.props;
    const { current, decline, accept } = this.state;
    const currAtt = att.list[current];
    const length = att.list.length;
    const action = att.action;
    console.log(att)
    if (att.loading) return <Spinner animation="border" style={{ marginTop: '8rem' }} />;
    if (att.list.length < 1) return <p style={{ marginTop: '15rem' }}>No missed classes</p>;
    return (
      <div className={styles['attendance']}>
        <Row>
          <Col xs={12} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <h5 class="m-0 mr-2">{currAtt.student.name}</h5>
            <p class="m-0">{moment(currAtt.time, 'DDD/YY').format('dddd, Do MMMM')}</p>
          </Col>
        </Row>
        <br />
        < Row >
          <div className={styles['content']}>
          <Col xs={1}>
              {length > 1 && current > 0 ? <FontAwesomeIcon icon="chevron-left" onClick={this.goBack}/> : null}
          </Col>
          <Col xs={10}>
            <div className={styles['container']}>
                <img src={currAtt.photoUrl} alt={currAtt.photoId}/>
                <div className={styles['btns']}>
                  <Button onClick={(action.loading && action.loadingIndex === current) ? null : this.decline.bind(this, current)} size="sm" variant="danger">{(action.loading && action.loadingIndex === current) ? <Spinner size="sm" animation="border" variant="light" /> : 'Decline'}</Button>
                  <Button onClick={(action.loading && action.loadingIndex === current) ? null : this.accept.bind(this, current)} size="sm" variant="success">{(action.loading && action.loadingIndex === current) ? <Spinner size="sm" animation="border" variant="light" /> : 'Accept'}</Button>
                </div>
            </div>
          </Col>
          <Col xs={1}>
              {length > 1 && current < length - 1 ? <FontAwesomeIcon icon="chevron-right" onClick={this.goForward}/> : null}
          </Col>
          </div>
        </Row>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  att: state.attendance
});
const mapDispatchToProps = dispatch => ({
  acceptDoc: (studentId, time, index) => dispatch(acceptDoc(studentId, time, index)),
  declineDoc: (studentId, time, index) => dispatch(declineDoc(studentId, time, index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Attendance);
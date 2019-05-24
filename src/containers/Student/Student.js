import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ListGroup, ListGroupItem, Row, Col, Button, Spinner } from 'react-bootstrap';

import { getAttByStudent, uploadDoc } from '../../store/actions/attendance';

import styles from './Student.module.sass';

class Student extends Component {

  inputRefs = []

  componentDidMount(){
    const { getAttByStudent, auth } = this.props;
    getAttByStudent(auth.uid);
  }

  setRef = (ref) => {
    if(ref){
      this.inputRefs[ref.dataset.index] = ref;
    }
  }
  cleanRefs = () => {
    this.inputRefs = [];
  }

  clickInput = (index) => this.inputRefs[index].click()

  uploadDoc = e => {
    const file = e.target.files[0];
    const index = e.target.dataset.index;
    const att = this.props.att.list[index];
    if(file.type.split('/')[0] !== 'image'){
      return console.log('not image');
    }
    this.props.uploadDoc(file, att.id, att.student.id, att.time, index);
  }

  onChange = e => {
    console.log('hello');
  }

  render() {
    const { att } = this.props;
    console.log(att.uploadingDoc);
    if (att.loading) return <Spinner animation="border" style={{ marginTop: '8rem' }} />;
    if(att.list.length < 1) return <p style={{marginTop: '15rem'}}>No missed classes</p>;
    return (
      <div>
        <Row>
          <Col xs={{span: 8, offset: 2}}>
            <ListGroup variant="flush">
              {att.list.map((el, index) => (
                <ListGroupItem key={el.id}>
                  <div className={styles['item']}>
                    <div className={styles['class-names']}>
                      {el.class.map((clss, i) => (
                        <h5 key={clss.id}>{i + 1}. {clss.name}</h5>
                      ))}
                    </div>
                    <p>{moment(el.time, 'DDD/YY').format('dddd, Do MMMM')}</p>
                    <Button block style={{ marginRight: '0', maxWidth: '10rem' }} variant="warning" onClick={(att.uploadingDoc.loading && att.uploadingDoc.loadingIndex === index) ? null : this.clickInput.bind(this, index)}>{(att.uploadingDoc.loading && att.uploadingDoc.loadingIndex === index) ? <Spinner size="sm" animation="border" variant="light" /> : 'Upload scan'}</Button>
                    <input hidden ref={this.setRef} type="file" onChange={this.uploadDoc} data-index={index}/>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  auth: state.firebase.auth,
  att: state.attendance
})
const mapDispatchToProps = dispatch => ({
  getAttByStudent: (studentId) => dispatch(getAttByStudent(studentId)),
  uploadDoc: (file, attId, studentId, time, index) => dispatch(uploadDoc(file, attId, studentId, time, index))
})

export default connect(mapStateToProps, mapDispatchToProps)(Student);
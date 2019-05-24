import React, { Component, Fragment } from 'react'
import { Container, Row, Form, Col, Button, Spinner, Collapse, ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';

import { getGroups } from '../../store/actions/groups';
import { getUsersByGroup } from '../../store/actions/users';
import { addAttendance } from '../../store/actions/attendance'

import styles from './Teachers.module.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Teacher extends Component {

  componentDidMount(){
    this.props.getGroups();
  }

  state = {
    attendance: [],
    groupIndex: '',
    classIndex: '',
    students: [],
    emptyField: '',
    sent: false
  }

  onGroupSelect = (e) => {
    const { value } = e.target;
    this.setState({ 
      groupIndex: value,
      emptyField: (this.state.emptyField === 'group' && value !== '') ? '' : this.state.emptyField
    });
  }

  onClassSelect = (e) => {
    const { value } = e.target;
    this.setState({ 
      classIndex: value,
      emptyField: (this.state.emptyField === 'group' && value !== '') ? '' : this.state.emptyField
    });
  }

  onStudentSelect = (e) => {
    const { options } = e.target;
    const arr = [];
    Array.from(options).forEach(op => {
      if (op.selected) arr.push(+op.value)
    })
    this.setState({ students: arr });
  }

  sendAtt = () => {
    console.log(this.state.attendance)
    this.props.addAttendance(this.state.attendance, () => {
      this.setState({ sent: true })
    });
  }

  removeAtt = index => {
    this.setState({
      attendance: this.state.attendance.filter((el, i) => i !== index)
    })
  }

  addToAttendance = (e) => {
    e.preventDefault();
    const { groups } = this.props;
    const { groupIndex, attendance, students, classIndex } = this.state;
    let group = groups.list[groupIndex];
    if(this.validate()){
      this.setState({
        attendance: [
          {
            students: group.students.map((st, i) => students.find(el => el === i) !== undefined ? st : null).filter(el => el !== null),
            group: { name: group.name, id: group.id },
            class: group.classes[classIndex]
          },
          ...attendance
        ],
        groupIndex: '',
        classIndex: '',
        students: [],
        emptyField: ''
      })
    }
  }

  validate = () => {
    const { groupIndex, classIndex } = this.state;
    if (groupIndex === ''){
      this.setState({ emptyField: 'group' });
      return false
    }
    if (classIndex === ''){
      this.setState({ emptyField: 'class' });
      return false
    }
    return true;
  }
  
  render() {
    const { groups, att } = this.props;
    const { students, attendance, emptyField, groupIndex, classIndex, sent } = this.state
    if (groups.loading) return <Spinner animation="border" style={{ marginTop: '8rem' }} />;
    if (groups.list.length < 1 ) return <p style={{marginButtom: '8rem'}}>Add groups and students first!</p>
    if (sent) return <FontAwesomeIcon className="text-success" icon="check" style={{marginTop: '8rem', fontSize: '3rem'}} />
    const groupGroupArr = ['form-group'];
    const groupControlArr = ['custom-select'];
    if (emptyField === 'group') {
      groupGroupArr.push('has-danger');
      groupControlArr.push('is-invalid');
    }
    const classGroupArr = ['form-group'];
    const classControlArr = ['custom-select'];
    if (emptyField === 'class') {
      classGroupArr.push('has-danger');
      classControlArr.push('is-invalid');
    }
    return (
      <div>
        <Container>
          <Form>
            <Row>
              <Col md={6}>
                {attendance.length < 1 ? <p style={{marginTop: '5rem'}}>Add attendance</p> : (
                  <ListGroup>
                    <Button style={{ marginTop: '0' }} variant="dark" block onClick={att.loading ? null : this.sendAtt}>{!att.loading ? 'Send' : <Spinner size="sm" animation="border" variant="light" />}</Button>
                    {attendance.map((el, i) => (
                      
                      <ListGroupItem key={i}>
                        <div className={styles['list-item']}>
                          <h5>{el.group.name}</h5>
                          <span>{el.class.name}</span>
                          <ul>
                            {el.students.length > 0 ? el.students.map(st => (
                              <li className="text-warning" key={st.id}>{st.name}</li>
                            )) : null}
                          </ul>
                          <FontAwesomeIcon icon="trash-alt" onClick={this.removeAtt.bind(this, i)} />
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                )}
              </Col>
              <Col md={{span: 4, offset: 1}}>
              <div className={groupGroupArr.join(' ')}>
                  <select className={groupControlArr.join(' ')} onChange={this.onGroupSelect} value={groupIndex}>
                  <option value=''>select group</option>
                  {groups.list.map((group, i) => (
                    group.classes.length > 0 ? <option value={i} key={group.id}>{group.name}</option> : null
                  ))}
                </select>
                {emptyField === 'group' ? <div className="invalid-feedback">Please select group</div> : null}
              </div>
              
                
                <Collapse in={groupIndex !== ''}>
                  <div>
                    <div className={classGroupArr.join(' ')}>
                      <select className={classControlArr.join(' ')} onChange={this.onClassSelect} value={classIndex}>
                        <option value=''>select class</option>
                        {groupIndex !== '' ? groups.list[groupIndex].classes.map((clss, i) => (
                          <option key={clss.id} value={i}>{clss.name}</option>
                        )) : null}
                      </select>
                      {emptyField === 'class' ? <div className="invalid-feedback">Please select class</div> : null}
                    </div>
                  </div>
                </Collapse>

                <Collapse in={groupIndex !== ''}>
                  <div>
                    <Form.Group controlId="selectClasses">
                      <Form.Control
                        as="select"
                        multiple
                        onChange={this.onStudentSelect}
                        value={students}
                        isInvalid={emptyField === 'students'}
                      >
                        {groupIndex !== '' ? groups.list[groupIndex].students.map((st, i) => (
                          <option key={st.id} value={i}>{st.name}</option>
                        )) : null}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select classes
                        </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </Collapse>
                  <Button variant="dark" block onClick={this.addToAttendance}>Add class attendance</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  att: state.attendance.adding,
})

const mapDispatchToProps = dispatch => ({
  getGroups: () => dispatch(getGroups()),
  getUsersByGroup: (groupId, success, fail) => dispatch(getUsersByGroup(groupId, success, fail)),
  addAttendance: (students, cb) => dispatch(addAttendance(students, cb))
})

export default connect(mapStateToProps, mapDispatchToProps)(Teacher);
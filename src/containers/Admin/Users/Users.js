import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import SubNav from '../../../components/SubNav/SubNav';
import { Container, Row, Col, ListGroup, Spinner, Collapse, Alert, Form, Button } from 'react-bootstrap';

import ExpandableUser from '../../../components/ExpandableUser/ExpandableUser';
import DeleteModal from '../../../components/DeleteModal/DeleteModal';

import { addUser, getUsers, deleteUser } from '../../../store/actions/users';
import { openDeleteModal, closeDeleteModal } from '../../../store/actions/modal';
import { getFaculties } from '../../../store/actions/faculties';
import { getClasses } from '../../../store/actions/class';
import { getGroups } from '../../../store/actions/groups';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const links = [
  {
    hash: '#students',
    to: '/users#students',
    text: 'Students'
  },
  {
    hash: '#teachers',
    to: '/users#teachers',
    text: 'Teachers'
  },
];

class Users extends Component {

  state = {
    user: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    facultyIndex: '',
    groupList: [],
    selectedGroup: '',
    // selectedClasses: [],
    emptyField: '',
    editId: null
  }

  componentDidMount(){
    this.updateData();
  }
  componentDidUpdate(prevProps) {
    if(prevProps.location.hash !== this.props.location.hash){
      this.updateData();
      this.resetState();
    }
  }
  updateData = () => {
    const { location, getFaculties, getUsers, getClasses, getGroups } = this.props;
    if (location.hash === links[0].hash) {
      getUsers('s');
      getGroups();
      getFaculties();
    } else if (location.hash === links[1].hash) {
      getUsers('t');
      getClasses();
    }
  }

  onDataChange = e => {
    const { value, name } = e.target;
    this.setState({
      user: {
        ...this.state.user,
        [name]: value
      },
      emptyField: (name === this.state.emptyField && value !== '') ? '' : this.state.emptyField
    });
  }

  selectFacIndex = e => {
    const { value } = e.target;
    const { groups, faculties } = this.props;
    if(value === ''){
      return this.setState({ facultyIndex: '', groupList: [] });
    }
    const facsWithGroups = faculties.list.map(fac => {
      if (groups.list.findIndex(gr => gr.faculty.id === fac.id) !== -1) {
        return fac;
      } else {
        return null
      }
    }).filter(el => el !== null);
    const fac = facsWithGroups[value];
    const newGroups = groups.list.filter(gr => gr.faculty.id === fac.id);
    console.log(groups.list, fac);
    this.setState({ facultyIndex: value, groupList: newGroups, emptyField: ('faculty' === this.state.emptyField && value !== '') ? '' : this.state.emptyField });
  }

  selectGroup = e => {
    const { value } = e.target;
    this.setState({ selectedGroup: value, emptyField: ('group' === this.state.emptyField && value !== '') ? '' : this.state.emptyField });
  }

  selectClass = (e) => {
    const { options } = e.target;
    const arr = [];
    Array.from(options).forEach(op => {
      if(op.selected) arr.push(+op.value);
    })
    this.setState({ selectedClasses: arr, emptyField: ('classes' === this.state.emptyField && arr.length > 0) ? '' : this.state.emptyField });
  }

  validate = () => {
    const { user, facultyIndex, selectedGroup, selectedClasses, editId } = this.state;
    const { hash } = this.props.location;
    if(user.firstname === ''){
      this.setState({ emptyField: 'firstname' });
      return false;
    }
    if(user.lastname === ''){
      this.setState({ emptyField: 'lastname' });
      return false;
    }
    if (!editId){
      if (user.email === '') {
        this.setState({ emptyField: 'email' });
        return false;
      }
      if (user.password === '') {
        this.setState({ emptyField: 'password' });
        return false;
      }
    }
    if(hash === '#students'){
      if (facultyIndex === '') {
        this.setState({ emptyField: 'faculty' });
        return false;
      }
      if (selectedGroup === '') {
        this.setState({ emptyField: 'group' });
        return false;
      }
    } else if (hash === '#teachers'){
      // if (selectedClasses.length < 1) {
      //   this.setState({ emptyField: 'classes' });
      //   return false;
      // }
    }
    return true;
  }

  getFacsWithGroups = () => {
    const { faculties, groups } = this.props;
    return faculties.list.map(fac => {
      if(groups.list.findIndex(gr => gr.faculty.id === fac.id) !== -1){
        return fac;
      } else {
        return null
      }
    }).filter(el => el !== null);
  }

  addUser = (e) => {
    e.preventDefault();
    if (!this.validate()) return;
    const { user, facultyIndex, selectedGroup, selectedClasses, editId } = this.state;
    const { location, faculties, groups } = this.props;
    const basicData = {
      email: user.email,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    }
    let newUser;
    if (location.hash === '#students'){
      const fac = this.getFacsWithGroups()[facultyIndex];
      const group = groups.list[selectedGroup];
      newUser = {
        ...basicData,
        role: 's',
        faculty: { id: fac.id, name: fac.name },
        group: { id: group.id, name: group.name }
      }
    } else if (location.hash === '#teachers') {
      // const newClasses = selectedClasses.map(cl => classes.list.find((el, i) => cl === i ? { id: el.id, name: el.name } : null)).filter(el => el !== null);
      newUser = {
        ...basicData,
        role: 't',
        // classes: newClasses
      }
    }
    if (editId){
      delete newUser.email;
      delete newUser.password;
    }
    this.props.addUser(newUser, editId, this.resetState);
  }
  resetState = (e) => {
    if(e) e.preventDefault();
    this.setState({
      user: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      },
      facultyIndex: '',
      selectedGroup: '',
      groupList: [],
      selectedClasses: [],
      emptyField: '',
      editId: null
    });
  }

  deleteUser = () => {
    const { hash } = this.props.location;
    let role;
    if(hash === '#students') role ='s'; 
    if(hash === '#teachers') role ='t'; 
    console.log(this.props.modal.itemId, role);
    this.props.deleteUser(this.props.modal.itemId, role)
  }

  setEditData = (editId) => {
    const { teachers, students, location, faculties, classes, groups } = this.props;
    let user;
    if (location.hash === '#students'){
      user = students.users.find(us => us.id === editId);
      let facultyIndex = this.getFacsWithGroups().findIndex(el => el.id === user.faculty.id);
      let selectedGroup = groups.list.findIndex(el => el.faculty.id === user.faculty.id);
      let groupList = groups.list.filter(gr => gr.faculty.id === user.faculty.id);
      console.log(this.getFacsWithGroups())
      this.setState({
        user: {
          ...this.state.user,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        facultyIndex,
        groupList,
        selectedGroup,
        editId
      })
    }
    if (location.hash === '#teachers') {
      user = teachers.users.find(us => us.id === editId);
      this.setState({
        user: {
          ...this.state.user,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        editId
      })
    }
  }

  render() {
    const { 
      location, 
      teachers, 
      students, 
      adding, 
      deleting, 
      classes, 
      groups,
      faculties,
      openDeleteModal,
      closeDeleteModal,
      modal
    } = this.props;
    if(location.pathname !== '/users' || (location.hash !== '#students' && location.hash !== '#teachers')){
      return (<Redirect to={{ pathname: '/users', hash: '#students' }} />);
    }
    const { 
      facultyIndex, 
      // selectedClasses, 
      selectedGroup,
      groupList,
      emptyField,
      editId
    } = this.state;
    let users, content, formContent, inputName;
    if(location.hash === links[0].hash){
      users = students.users;
      inputName = 'student';
      const facultyGroupArr = ['form-group'];
      const facultyControlArr = ['custom-select'];
      if(emptyField === 'faculty'){
        facultyGroupArr.push('has-danger');
        facultyControlArr.push('is-invalid');
      }

      const groupGroupArr = ['form-group'];
      const groupControlArr = ['custom-select'];
      if (emptyField === 'group') {
        groupGroupArr.push('has-danger');
        groupControlArr.push('is-invalid');
      }

      formContent = (
        <Fragment>
          <Row>
            <Col xs={12}>
              <div className={facultyGroupArr.join(' ')}>
                <select value={facultyIndex} className={facultyControlArr.join(' ')} onChange={this.selectFacIndex}>
                  <option value=''>select faculty</option>
                  {this.getFacsWithGroups().map((fac, i) => {
                    return (
                      <option key={fac.id} value={i}>{fac.name}</option>
                    )
                  })}
                </select>
                {emptyField === 'faculty' ? <div className="invalid-feedback">Please select faculty</div> : null}
              </div>
            </Col>
          </Row>
          <Collapse in={facultyIndex !== '' ? true : false}>
            <Row>
              <Col xs={12}>
                <div className={groupGroupArr.join(' ')}>
                  <select value={selectedGroup} className={groupControlArr.join(' ')} onChange={this.selectGroup}>
                    <option value=''>select group</option>
                    {groupList.map((group, i) => (
                      <option value={i} key={group.id}>{group.name}</option>
                    ))}
                  </select>
                  {emptyField === 'group' ? <div className="invalid-feedback">Please select group</div> : null}
                </div>
              </Col>
            </Row>
          </Collapse>
        </Fragment>
      );
    } else if (location.hash === links[1].hash){
      users = teachers.users;
      inputName = 'teacher';
      formContent = null;
        // <Form.Group controlId="selectClasses">
        //   <Form.Control 
        //     as="select" 
        //     multiple 
        //     onChange={this.selectClass}
        //     value={selectedClasses}
        //     isInvalid={emptyField === 'classes'}
        //   >
        //     {classes.list.map((item, i) => (
        //       <option key={item.id} value={i}>{item.name}</option>
        //     ))}
        //   </Form.Control>
        //   <Form.Control.Feedback type="invalid">
        //     Please select classes
        //   </Form.Control.Feedback>
        // </Form.Group>
      // )
    }
    if (
      students.loading || 
      teachers.loading || 
      classes.loading || 
      groups.loading || 
      faculties.loading
    ){
      content = <Spinner animation="border" style={{ marginTop: '8rem' }} />;
    } else {
      content = (
        <Row>
          <Col md="6">
            {users.length < 1 ? (
              <p style={{ marginTop: '5rem', textAlign: 'center' }}>No {location.hash.slice(1)} yet</p>
            ) : (
              <ListGroup>
                {users.map(user => (
                  <ExpandableUser key={user.id} delete={this.openDeleteModal} key={user.id} user={user}>
                    <Row>
                      {user.role === 's' ? (
                        <Fragment>
                          <Col xs={8}>
                            <p>email: {user.email}</p>
                            <p>faculty: {user.faculty.name}</p>
                            <p>group: {user.group.name}</p>
                          </Col>
                        </Fragment>
                      ) : user.role === 't' ? (
                        <Fragment>
                          <Col xs={8}>
                            <p style={{ margin: '.5rem 0' }}>email: {user.email}</p>
                            {/* <p>classes: {user.classes && user.classes.map(clss => clss.name).join(', ')}</p> */}
                          </Col>
                        </Fragment>
                      ) : null}
                      <Col xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <FontAwesomeIcon icon="user-edit" onClick={this.setEditData.bind(this, user.id)}/>
                        <FontAwesomeIcon icon="user-times" onClick={openDeleteModal.bind(this, user.id)} />
                      </Col>
                    </Row>
                  </ExpandableUser>
                ))}
              </ListGroup>
            )}
            
          </Col>
          <Col md={{ span: 4, offset: 1 }}>
            <Collapse in={adding.error}>
              <div id="error">
                <Alert variant="danger">
                  Oops, something went wrong...
                </Alert>
              </div>
            </Collapse>

            <Form onSubmit={!adding.loading ? this.addUser : null}>
                <Form.Group controlId="basicInf">
                  <Row>
                    <Col xs={12}>
                      <Form.Control
                        type="text"
                        onChange={this.onDataChange}
                        name="firstname"
                        placeholder="First name" 
                        value={this.state.user.firstname}
                      isInvalid={emptyField === 'firstname'}/>
                    <Form.Control.Feedback type="invalid">
                      Please enter valid first name
                    </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Form.Control
                        type="text"
                        onChange={this.onDataChange}
                        name="lastname"
                        placeholder="Last name" 
                        value={this.state.user.lastname}
                        isInvalid={emptyField === 'lastname'} />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid last name
                    </Form.Control.Feedback>
                    </Col>
                  </Row>
                </Form.Group>
                <hr />
                <Collapse in={!editId}>
                  <div>
                    <Form.Group controlId="passEmInf">
                      <Row>
                        <Col xs={12}>
                          <Form.Control
                            type="email"
                            onChange={this.onDataChange}
                            name="email"
                            placeholder="Email" 
                            value={this.state.user.email}
                            isInvalid={emptyField === 'email'} />
                        <Form.Control.Feedback type="invalid">
                          Please enter valid email
                        </Form.Control.Feedback>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Form.Control
                            type="text"
                            onChange={this.onDataChange}
                            name="password"
                            placeholder="Password" 
                            value={this.state.user.password}
                            isInvalid={emptyField === 'password'}/>
                        <Form.Control.Feedback type="invalid">
                          Please enter valid password
                        </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                    <hr />
                  </div>
                </Collapse>
                {formContent}
                <Row>
                {editId ? <Col md={6}><Button variant="outline-dark" block onClick={this.resetState}>Cancel</Button>
                </Col> : null}
                <Col md={!editId ? 12 : 6}>
                  <Button block variant="dark" type="submit">{adding.loading ? <Spinner size="sm" animation="border" variant="light" /> : !editId ? 'Add ' + inputName : 'Update'}</Button>
                </Col>
                </Row>
              </Form>

          </Col>
        </Row>
      );
    }
    return (
      <div>
        <SubNav links={links} />
        <Container>
          {content}
        </Container>
        <DeleteModal
          in={modal.show}
          text="Are you sure?"
          close={closeDeleteModal}
          loading={deleting.loading}
          action={this.deleteUser}
          actionText="Yes, delete"
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  students: state.users.students,
  teachers: state.users.teachers,
  adding: state.users.adding,
  deleting: state.users.deleting,
  faculties: state.faculties.faculties,
  classes: state.class.classes,
  groups: state.groups.groups,
  modal: state.modal
});
const mapDispatchToProps = dispatch => ({
  addUser: (user, editId, cb) => dispatch(addUser(user, editId, cb)),
  deleteUser: (userId, role) => dispatch(deleteUser(userId, role)),
  getUsers: (role) => dispatch(getUsers(role)),
  getFaculties: () => dispatch(getFaculties()),
  getGroups: () => dispatch(getGroups()),
  getClasses: () => dispatch(getClasses()),
  openDeleteModal: (id) => dispatch(openDeleteModal(id)),
  closeDeleteModal: () => dispatch(closeDeleteModal()),

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
import React, { Component, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col, Nav, ListGroup, ListGroupItem, Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DeleteModal from '../../../components/DeleteModal/DeleteModal';

import { getUsers } from '../../../store/actions/users';
import { getFaculties, addFaculty, deleteFaculty } from '../../../store/actions/faculties';
import { getGroups, addGroup, deleteGroup } from '../../../store/actions/groups';
import { getClasses, addClass, deleteClass } from '../../../store/actions/class';
import { openDeleteModal, closeDeleteModal } from '../../../store/actions/modal';

import styles from './Classes.module.sass';

class Classes extends Component {
  state = {
    data: {
      name: '',
      faculty: '',
      groups: [],
      teachers: []
    },
    emptyField: '',
    editId: null
  }
  componentDidMount(){
    this.updateData();
  }
  componentDidUpdate(prevProps){
    if(prevProps.location.hash !== this.props.location.hash){
      this.updateData();
      this.resetState();
    }
  }

  updateData = () => {
    const { location, getFaculties, getUsers, getClasses, getGroups } = this.props;
    switch (location.hash) {
      case '#classes':
        getClasses();
        getGroups();
        // getUsers('t');
        break;
      case '#groups':
        getGroups();
        getFaculties();
        // getUsers('s', ['group', '==', 'null'])
        break;
      case '#faculties':
        getFaculties();
        break;

      default: break;
    }
  }

  onDataChange = e => {
    const { name, value } = e.target;
    this.setState({
      data: {
        ...this.state.data,
        [name]: value
      },
      emptyField: (name === this.state.emptyField && value !== '') ? '' : this.state.emptyField
    })
  }

  selectData = e => {
    const { options, name } = e.target;
    const arr = [];
    Array.from(options).forEach(op => {
      if (op.selected) arr.push(op.value);
    });
    this.setState({ 
      data: {
        ...this.state.data,
        [name]: arr
      },
      emptyField: (name === this.state.emptyField && arr.length > 0) ? '' : this.state.emptyField
    });
  }

  resetState = (e) => {
    if (e) e.preventDefault();
    this.setState({
      data: {
        name: '',
        faculty: '',
        groups: [],
        teachers: []
      },
      emptyField: '',
      editId: null
    })
  }

  validation = () => {
    const { hash } = this.props.location;
    const { name, faculty } = this.state.data;
    if (name === '') {
      this.setState({ emptyField: 'name' })
      return false;
    }
    switch (hash) {
      case '#classes': break;

      case '#groups':
        if (faculty === '') {
          this.setState({ emptyField: 'faculty' })
          return false;
        }
        break;

      case '#faculty': break;
      default: break;
    }
    return true;
  }

  addClass = (e) => {
    e.preventDefault();
    if (!this.validation()) return;
    const { name, groups } = this.state.data;
    const groupsArr = [];
    groups.forEach(index => {
      const group = this.props.groups.groups.list[index];
      groupsArr.push({id: group.id, name: group.name });
    });
    const clss = { name, groups: groupsArr };
    this.props.addClass(clss, this.state.editId, this.resetState);
  }
  addGroup = (e) => {
    e.preventDefault();
    if (!this.validation()) return;
    const { name, faculty } = this.state.data;
    console.log(name, faculty);
    const addFaculty = this.props.faculties.faculties.list[faculty];
    console.log(addFaculty)
    const group = { name, faculty: { name: addFaculty.name, id: addFaculty.id }, classes: [], students: [] };
    this.props.addGroup(group, this.state.editId, this.resetState);
  }
  addFaculty = (e) => {
    e.preventDefault();
    if (!this.validation()) return;
    const { name } = this.state.data;
    const fac = { name };
    console.log('adding fac');
    this.props.addFaculty(fac, this.state.editId, this.resetState);
  }

  deleteGroup = () => {
    const { modal, deleteGroup } = this.props;
    deleteGroup(modal.itemId);
    if(this.state.editId === modal.itemId){
      this.resetState();
    }
  }
  deleteFaculty = () => {
    const { modal, deleteFaculty } = this.props;
    deleteFaculty(modal.itemId);
    if(this.state.editId === modal.itemId){
      this.resetState();
    }
  }
  deleteClass = () => {
    const { modal, deleteClass } = this.props;
    deleteClass(modal.itemId);
    if(this.state.editId === modal.itemId){
      this.resetState();
    }
  }

  setEditData = (cat, index) => {
    const { groups, faculties, classes, teachers } = this.props;
    if(cat === 'Class'){
      const clss = classes.classes.list[index];
      // const selectedTeachersIndexes = teachers.users.map((t, i) => clss.teachers.find(el => el.id === t.id) ? i : null).filter(el => el !== null);
      const selectedGroupsIndexes = groups.groups.list.map((g, i) => g.classes.find(el => el.id === clss.id) ? i : null).filter(el => el !== null);
      this.setState({
        data: {
          ...this.state.data,
          name: clss.name,
          // teachers: selectedTeachersIndexes,
          groups: selectedGroupsIndexes
        },
        editId: clss.id,
        emptyField: ''
      });
      return;
    }
    if(cat === 'Group'){
      const group = groups.groups.list[index];
      console.log(group);
      this.setState({
        data: {
          ...this.state.data,
          name: group.name,
          faculty: faculties.faculties.list.findIndex(el => el.id === group.faculty.id)
        },
        editId: group.id,
        emptyField: ''
      });
      return;
    }
    if(cat === 'Faculty'){
      const fac = faculties.faculties.list[index];
      console.log(fac);
      this.setState({
        data: {
          ...this.state.data,
          name: fac.name
        },
        editId: fac.id,
        emptyField: ''
      });
      return;
    }
  }

  render() {
    const { 
      faculties, 
      classes, 
      groups, 
      teachers,
      modal, 
      openDeleteModal, 
      closeDeleteModal
    } = this.props;
    const { hash } = this.props.location;
    const { data, emptyField, editId } = this.state;
    const btnSpinner = <Spinner size="sm" animation="border" variant="light" />;
    let content, list, formContent, action, loading, deleting, inputName;
    const facultyGroupArr = ['form-group'];
    const facultyControlArr = ['custom-select'];
    if (emptyField === 'faculty') {
      facultyGroupArr.push('has-danger');
      facultyControlArr.push('is-invalid');
    }
    if (faculties.faculties.loading || classes.classes.loading || groups.groups.loading || teachers.loading ){
      content = <Spinner animation="border" style={{ marginTop: '8rem' }} />;
    } else {
      switch (hash) {
        case '#classes':
          list = classes.classes.list;
          action = this.addClass;
          loading = classes.adding.loading;
          deleting = {
            ...classes.deleting,
            action: editId ? this.updateClass : this.deleteClass
          };
          inputName = 'Class';
          formContent = (
            <Fragment>
            <Form.Group>
              <Form.Control 
                value={data.groups} 
                as="select" 
                multiple 
                name="groups"
                onChange={this.selectData} 
                isInvalid={emptyField === 'groups'}
              >
                {groups.groups.list.map((group, i) => (
                  <option value={i} key={group.id}>{group.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select group
              </Form.Control.Feedback>
              </Form.Group>
              {/* <Form.Group>
                <Form.Control
                  value={data.teachers}
                  as="select"
                  multiple
                  name="teachers"
                  onChange={this.selectData}
                  isInvalid={emptyField === 'teachers'}
                >
                  {teachers.users.map((t, i) => (
                    <option value={i} key={t.id}>{t.firstname} {t.lastname}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select teachers
              </Form.Control.Feedback>
              </Form.Group> */}
              <Row>
                {editId ? <Col md={6}><Button variant="outline-dark" block onClick={this.resetState}>Cancel</Button>
                </Col> : null}
                <Col md={!editId ? 12 : 6}>
                  <Button variant="dark" block type="submit">{loading ? btnSpinner : !editId ? 'Add class' : 'Update'}</Button>
                </Col>
              </Row>
            </Fragment>
          );
          break;
        case '#groups':
          list = groups.groups.list;
          action = this.addGroup;
          loading = groups.adding.loading;
          deleting = {
            ...groups.deleting,
            action: this.deleteGroup
          };
          inputName = 'Group';
          formContent = (
            <Fragment>
              <Form.Group>
              <div className={facultyGroupArr.join(' ')}>
                  <select value={data.faculty} name="faculty" className={facultyControlArr.join(' ')} onChange={this.onDataChange}>
                  <option value=''>select faculty</option>
                  {faculties.faculties.list.map((fac, i) => (
                    <option key={fac.id} value={i}>{fac.name}</option>
                ))}
                </select>
                {emptyField === 'faculty' ? <div className="invalid-feedback">Please select faculty</div> : null}
              </div>
              </Form.Group>
              <Row>
              {editId ? <Col md={6}><Button variant="outline-dark" block onClick={this.resetState}>Cancel</Button>
              </Col> : null}
              <Col md={!editId ? 12 : 6}>
                <Button variant="dark" block type="submit">{loading ? btnSpinner : !editId ? 'Add group' : 'Update'}</Button>
              </Col>
              </Row>
            </Fragment>
          );
          break;
        case '#faculties':
          list = faculties.faculties.list;
          action = this.addFaculty;
          loading = faculties.adding.loading;
          deleting = {
            ...faculties.deleting,
            action: this.deleteFaculty
          };
          inputName = 'Faculty';
          formContent = (
            <Fragment>
              <Row>
              {editId ? <Col md={6}><Button variant="outline-dark" block onClick={this.resetState}>Cancel</Button>
              </Col> : null}
              <Col md={!editId ? 12 : 6}>
                <Button variant="dark" block type="submit">{loading ? btnSpinner : !editId ? 'Add faculty' : 'Update'}</Button>
              </Col>
              </Row>
            </Fragment>
          );
          break;

        default:
          formContent = (<span>Select tab</span>);
          break;
      }
      content = (
        <Row>
          <Col md={6}>
            <div className={styles['content']}>

              {list.length < 1 ? (
                <p style={{marginTop: '5rem', textAlign: 'center'}}>No {hash.slice(1)} yet</p>
              ) : (
                <ListGroup>
                  {list.map((el, i) => (
                    <ListGroupItem key={i}>
                      <div className={styles['list-item']}>
                        <h5>{el.name}</h5>
                        <FontAwesomeIcon icon="trash-alt" onClick={openDeleteModal.bind(this, el.id)} />
                        <FontAwesomeIcon icon="edit" onClick={this.setEditData.bind(this, inputName, i)} />
                      </div>
                  </ListGroupItem>
                  ))}
              </ListGroup>
              )}

            </div>
          </Col>
          <Col md={{ span: 4, offset: 1 }}>
            <Form style={{ marginTop: '2rem' }} onSubmit={!loading ? action : null}>
              <Form.Group>
                <Form.Control
                  value={data.name}
                  name="name"
                  type="text"
                  placeholder={inputName + " name"}
                  onChange={this.onDataChange} 
                  isInvalid={emptyField === 'name'}/>
                <Form.Control.Feedback type="invalid">
                  Please enter valid name
                </Form.Control.Feedback>
              </Form.Group>
              {formContent}
            </Form>
          </Col>
        </Row>
      );
    }
    return (
      <div className={styles['classes']}>
        <Container>
          <Nav variant="pills" className="justify-content-center" activeKey="/home">
            <Nav.Item>
              <NavLink className={hash === '#classes' ? styles['active'] : null} to="/classes#classes">Classes</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink className={hash === '#groups' ? styles['active'] : null} to="/classes#groups">Groups</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink className={hash === '#faculties' ? styles['active'] : null} to="/classes#faculties">Faculties</NavLink>
            </Nav.Item>
          </Nav>
          {content}
        </Container>
        <DeleteModal
          in={modal.show}
          text="Are you sure?"
          close={closeDeleteModal}
          loading={deleting ? deleting.loading : false}
          action={deleting ? deleting.action : null}
          actionText="Yes, delete"
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  classes: state.class,
  faculties: state.faculties,
  groups: state.groups,
  teachers: state.users.teachers,
  modal: state.modal
})

const mapDispatchToProps = dispatch => ({
  getFaculties: () => dispatch(getFaculties()),
  getGroups: () => dispatch(getGroups()),
  getClasses: () => dispatch(getClasses()),
  getUsers: (role) => dispatch(getUsers(role)),
  addFaculty: (fac, editId, cb) => dispatch(addFaculty(fac, editId, cb)),
  addGroup: (group, editId, cb) => dispatch(addGroup(group, editId, cb)),
  addClass: (clss, editId, cb) => dispatch(addClass(clss, editId, cb)),
  openDeleteModal: (id) => dispatch(openDeleteModal(id)),
  closeDeleteModal: () => dispatch(closeDeleteModal()),
  deleteClass: (id) => dispatch(deleteClass(id)),
  deleteFaculty: (id) => dispatch(deleteFaculty(id)),
  deleteGroup: (id) => dispatch(deleteGroup(id)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Classes));
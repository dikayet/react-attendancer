import * as actions from './actionTypes';
import axios from 'axios';

export const signIn = (id, pwd) => (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  dispatch({ type: actions.SIGNIN_START });
	firebase.auth().signInWithEmailAndPassword( id, pwd )
		.then(doc => {
      dispatch({ type: actions.SIGNIN_SUCCESS, doc });
    })
		.catch(err => {
      dispatch({ type: actions.SIGNIN_FAIL, err });
    });
}

export const signOut = () => (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  firebase.auth().signOut()
    .then(() => dispatch({ type: actions.SIGNOUT_SUCCESS }));
}

export const addUser = (user, editId, cb) => (dispatch, getState, { getFirebase, getFirestore }) => {
	const firebase = getFirebase();
  const firestore = getFirestore();
  let uid, promise, newUser;

  dispatch({ type: actions.ADD_USER_START });

  const ref = firestore.collection('users');

  if(!editId){
    newUser = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    };
    if (user.role === 't') {
      newUser.classes = user.classes;
    }
    if (user.role === 's') {
      newUser.faculty = user.faculty;
      newUser.group = user.group;
      newUser.attendance = [];
    }
    promise = axios.post('https://cors-anywhere.herokuapp.com/https://us-central1-attendance-b753a.cloudfunctions.net/createUser', {
      email: user.email,
      pass: user.password
    })
    .then(res => {
      uid = res.data.uid;
      console.log(uid);
      ref.doc(uid).set(newUser)
        .then(() => {
          dispatch({ type: actions.ADD_USER_SUCCESS, user: { ...newUser, id: uid } });
          if(newUser.role === 's'){
            firestore.collection('groups').doc(newUser.group.id).update({
              students: firestore.FieldValue.arrayUnion({ id: uid, name: `${newUser.firstname} ${newUser.lastname}` })
            })
              .then(() => console.log('group updated'))
              .catch(err => console.log('group update fail: ', err));
          }
          if (cb) cb();
        })
        .catch((err) => {
          dispatch({ type: actions.ADD_USER_FAIL, err });
        })
    })
  } else {
    newUser = user;
    console.log(newUser)
    if(newUser.role === 't'){
      return ref.doc(editId).update(newUser)
        .then(() => {
          dispatch({ type: actions.UPDATE_USER_SUCCESS, user: { ...newUser, id: editId } });
          if (cb) cb();
        })
        .catch(err => dispatch({ type: actions.ADD_USER_FAIL, err }));
    }
    ref.doc(editId).get()
      .then(doc => {
        let oldUser = doc.data();
        if(oldUser.group.id === newUser.group.id){
          console.log(oldUser, newUser);
          ref.doc(editId).update(newUser)
            .then(() => {
              dispatch({ type: actions.UPDATE_USER_SUCCESS, user: { ...newUser, id: editId } });
              if(cb) cb();
            })
            .catch(err => dispatch({ type: actions.ADD_USER_FAIL, err }));
        } else {
          ref.doc(editId).update(newUser)
            .then(() => {
              return firestore.collection('groups').doc(oldUser.group.id).get()
            })
            .then((doc) => {
              let group = doc.data();
              return firestore.collection('groups').doc(oldUser.group.id).update({
                students: group.students.filter(st => st.id !== editId)
              })
            })
            .then(() => {
              return firestore.collection('groups').doc(newUser.group.id).update({
                students: firestore.FieldValue.arrayUnion({ id: editId, name: `${newUser.firstname} ${newUser.lastname}` })
              })
            })
            .then(() => {
              console.log('groups updated');
              dispatch({ type: actions.UPDATE_USER_SUCCESS, user: { ...newUser, id: editId } });
              if (cb) cb();
            })
            .catch(err => console.log('groups update fail: ', err))
        }
      })
      .catch(err => dispatch({ type: actions.ADD_USER_FAIL, err }));
  }
}

export const getUsersByGroup = (groupId, success, fail) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  firestore.collection('users').where('group.id', '==', groupId).get()
    .then(snapshot => {
      if(snapshot.docs.length < 1) success(null);
      snapshot.forEach(doc => {
        let user = doc.data();
        success({ firstname: user.firstname, lastname: user.lastname, id: doc.id })
      })
    })
    .catch(err => fail(err));
}

export const deleteUser = (userId, role) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();

  dispatch({ type: actions.DELETE_USER_START });

  axios.post('https://cors-anywhere.herokuapp.com/https://us-central1-attendance-b753a.cloudfunctions.net/deleteUser', { uid: userId })
    .then(res => {
      let err = res.data.error;
      if(!err){
        return firestore.collection('users').doc(userId).delete()
      }
      return dispatch({ type: actions.DELETE_USER_FAIL, err });
    })
    .then(() => {
      dispatch({ type: actions.DELETE_USER_SUCCESS, userId, role });
      dispatch({ type: actions.CLOSE_DELETE_MODAL });
    })
    .catch(err => dispatch({ type: actions.DELETE_USER_FAIL, err }))
}

export const getUsers = (role, limit, startAfter) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();

  const actionStart = role === 't'
    ? actions.GET_TEACHER_START 
    : actions.GET_STUDENT_START;
  const actionSuccess = role === 't'
    ? actions.GET_TEACHER_SUCCESS 
    : actions.GET_STUDENT_SUCCESS;
  const actionError = role === 't'
    ? actions.GET_TEACHER_FAIL 
    : actions.GET_STUDENT_FAIL;

  dispatch({ type: actionStart });

  let ref = firestore.collection('users');
  if (role) {
    ref = ref.where('role', '==', role);
  }
  if (limit) {
    ref = ref.limit(limit);
  }
  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  ref.get()
    .then(snapshot => {
      if(snapshot.docs.length < 1){
        dispatch({ type: actionSuccess });
      } else {
        snapshot.forEach(doc => {
          dispatch({ type: actionSuccess, user: { ...doc.data(), id: doc.id } });
        })
      }
    })
    .catch(err => dispatch({ type: actionError, err }))
}

export const openEditUserModal = (userId) => ({ type: actions.OPEN_EDIT_USER_MODAL, userId });
export const closeEditUserModal = () => ({ type: actions.CLOSE_EDIT_USER_MODAL });

export const editUser = (user) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  dispatch({ type: actions.EDIT_USER_START });
  firestore.collection('users').doc(user.id).update({
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role
  })
    .then(() => dispatch({ type: actions.EDIT_USER_SUCCESS, user }))
    .catch(err => dispatch({ type: actions.EDIT_USER_FAIL, err }));
}
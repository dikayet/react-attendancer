import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import usersReducer from './users';
import classReducer from './class';
import facultyReducer from './faculties';
import groupsReducer from './groups';
import modalReducer from './modal';
import attendanceReducer from './attendance';

export default combineReducers({
	firebase: firebaseReducer,
	firestore: firestoreReducer,
	users: usersReducer,
  class: classReducer,
  faculties: facultyReducer,
  groups: groupsReducer,
  modal: modalReducer,
  attendance: attendanceReducer
});
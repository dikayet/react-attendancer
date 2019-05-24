import * as actions from '../actions/actionTypes';

const initState = {
  auth: {
    loading: false,
    error: false
  },
  adding: {
    loading: false,
    error: null
  },
  deleting: {
    loading: false,
    error: false,
    modal: false
  },
  editing: {
    loading: false,
    error: false,
    modal: false
  },
  teachers: {
    users: [],
    loading: false,
    error: false
  },
  students: {
    users: [],
    loading: false,
    error: false
  },
  loadingTeachers: false
}

export default (state = initState, action) => {
	switch (action.type) {
		case actions.SIGNIN_START:
			console.log('auth start...');
			return { 
        ...state, 
        auth: {
          ...state.auth,
          loading: true
        }
      };
		case actions.SIGNIN_SUCCESS:
			console.log('auth success:', action.doc);
			return { 
        ...state, 
        auth: {
          ...state.auth,
          error: null,
          loading: false
        }
      };

		case actions.SIGNIN_FAIL:
			console.log('auth fail:', action.err.message);
      return { 
        ...state, 
        auth: {
          ...state.auth,
          loading: false,
          error: action.err
        }
      };

		case actions.SIGNOUT_START:
			console.log('signout start...');
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true
        }
      };
		case actions.SIGNOUT_SUCCESS:
			console.log('signout success');
      return {
        ...state,
        auth: {
          ...state.auth,
          error: null,
          loading: false
        }
      };
		case actions.SIGNOUT_FAIL:
			console.log('signout fail');
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          error: action.err
        }
      };

    case actions.ADD_USER_START:
			console.log('adding user....');
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: true
        }
      };
    case actions.ADD_USER_SUCCESS:
			console.log('add user success', action.user);
      return {
        ...state,
        adding: {
          ...state.adding,
          error: null,
          loading: false
        },
        students: {
          ...state.students,
          users: action.user.role === 's' ? [action.user, ...state.students.users] : state.students.users
        },
        teachers: {
          ...state.teachers,
          users: action.user.role === 't' ? [action.user, ...state.teachers.users] : state.teachers.users
        }
      };
    case actions.UPDATE_USER_SUCCESS:
      console.log('update user success', action.user);
      let newUser;
      const { user } = action;
      if (user.role === 's'){
        newUser = { ...state.students.users.find(el => el.id === user.id), ...user }
      }
      if (user.role === 't'){
        newUser = { ...state.teachers.users.find(el => el.id === user.id), ...user }
      }
      return {
        ...state,
        adding: {
          ...state.adding,
          error: null,
          loading: false
        },
        students: {
          ...state.students,
          users: user.role === 's' ? [newUser, ...state.students.users.filter(us => us.id !== user.id)] : state.students.users
        },
        teachers: {
          ...state.teachers,
          users: user.role === 't' ? [newUser, ...state.teachers.users.filter(us => us.id !== user.id)] : state.teachers.users
        }
      };
    case actions.ADD_USER_FAIL:
			console.log('add user error', action.err);
      return {
        ...state,
        adding: {
          ...state.adding,
          error: action.err,
          loading: false
        }
      };
    case actions.DELETE_USER_START:
      console.log('deleting user....');
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: true
        }
      };
    case actions.DELETE_USER_SUCCESS:
      console.log('delete user success', action.userId, action.role);
      let newUsers;
      if(action.role === 's'){
        newUsers = state.students.users.filter(user => user.id !== action.userId);
      } else if(action.role === 't') {
        newUsers = state.teachers.users.filter(user => user.id !== action.userId);
      }
      return {
        ...state,
        deleting: {
          ...state.deleting,
          error: null,
          loading: false,
          modal: false,
        },
        teachers: {
          ...state.teachers,
          users: action.role === 't' ? newUsers : state.teachers.users
        },
        students: {
          ...state.teachers,
          users: action.role === 's' ? newUsers : state.students.users
        }
      };
    case actions.DELETE_USER_FAIL:
			console.log('delete user error', action.err);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          error: action.err,
          loading: false
        }
      };

    case actions.EDIT_USER_START:
      console.log('editing user....');
      return {
        ...state,
        editing: {
          ...state.deleting,
          loading: true
        }
      };
    case actions.EDIT_USER_SUCCESS:
      console.log('editing user success', action.user);
      if (action.role === 's') {
        newUsers = state.students.users.filter(user => user.id !== action.user.id);
        newUsers.unshift(action.user);
      } else {
        newUsers = state.teachers.users.filter(user => user.id !== action.user.id);
        newUsers.unshift(action.user);
      }
      return {
        ...state,
        editing: {
          ...state.editing,
          error: null,
          loading: false,
          modal: false
        },
        teachers: {
          ...state.teachers,
          users: action.role === 't' ? newUsers : state.teachers.users
        },
        students: {
          ...state.teachers,
          users: action.role === 's' ? newUsers : state.students.users
        }
      };
    case actions.EDIT_USER_FAIL:
      console.log('delete user error', action.err);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          error: action.err,
          loading: false
        }
      };

    case actions.GET_TEACHER_START:
      console.log('getting teachers...');
      return {
        ...state,
        teachers: {
          ...state.teachers,
          loading: true,
          users: []
        }
      }

    case actions.GET_TEACHER_SUCCESS:
      console.log('get teacher success', action.user);
      if (!action.user) return {
        ...state,
        teachers: {
          ...state.teachers,
          loading: false
        }
      };
      return {
        ...state,
        teachers: {
          ...state.teachers,
          loading: false,
          error: null,
          users: [
            ...state.teachers.users,
            action.user
          ]
        }
      }

    case actions.GET_TEACHER_FAIL:
			console.log('get teacher error', action.err);
      return {
        ...state,
        teachers: {
          ...state.teachers,
          loading: false,
          error: action.err
        }
      }

    case actions.GET_STUDENT_START:
      console.log('getting students...');
      return {
        ...state,
        students: {
          ...state.students,
          loading: true,
          users: []
        }
      }

    case actions.GET_STUDENT_SUCCESS:
      console.log('get student success', action.user);
      if(!action.user) return {
        ...state,
        students: {
          ...state.students,
          loading: false
        }
      };
      return {
        ...state,
        students: {
          ...state.students,
          loading: false,
          error: null,
          users: [
            ...state.students.users,
            action.user
          ]
        }
      }

    case actions.GET_STUDENT_FAIL:
      console.log('get student error', action.err);
      return {
        ...state,
        students: {
          ...state.students,
          loading: false,
          error: action.err
        }
      }
	
		default:
      return state;
	}
}
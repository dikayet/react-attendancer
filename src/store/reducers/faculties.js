import * as actions from '../actions/actionTypes';

const initState = {
  adding: {
    loading: false,
    error: null
  },
  deleting: {
    loading: false,
    error: null,
    modal: false,
    facID: null
  },
  faculties: {
    loading: false,
    error: null,
    list: []
  }
}

export default (state = initState, action) => {
  switch (action.type) {

    case actions.ADD_FACULTY_START:
      console.log('adding faculty...');
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: true
        }
      };

    case actions.ADD_FACULTY_SUCCESS:
      console.log('faculty adding success:', action.faculty);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: null
        },
        faculties: {
          ...state.faculties,
          list: [
            action.faculty,
            ...state.faculties.list,
          ]
        }
      };
    case actions.UPDATE_FACULTY_SUCCESS:
      console.log('faculty update success:', action.faculty);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: null
        },
        faculties: {
          ...state.faculties,
          list: [
            action.faculty,
            ...state.faculties.list.filter(el => el.id !== action.faculty.id),
          ]
        }
      };

    case actions.ADD_FACULTY_FAIL:
      console.log('faculty adding fail:', action.err.message);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: action.err
        }
      };

    case actions.DELETE_FACULTY_START:
      console.log('deleting faculty...');
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: true
        }
      };

    case actions.DELETE_FACULTY_SUCCESS:
      console.log('faculty deleting success:', action.facId);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: false,
          error: null
        },
        faculties: {
          ...state.faculties,
          list: state.faculties.list.filter(fac => fac.id !== action.facId)
        }
      };

    case actions.DELETE_FACULTY_FAIL:
      console.log('faculty deleting fail:', action.err.message);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: false,
          error: action.err
        }
      };

    case actions.GET_FACULTY_START:
      console.log('getting faculties...');
      return {
        ...state,
        faculties: {
          ...state.faculties,
          loading: true,
          list: []
        }
      }

    case actions.GET_FACULTY_SUCCESS:
      console.log('get faculties success', action.faculty);
      if (!action.faculty) return {
        ...state,
        faculties: {
          ...state.faculties,
          loading: false
        }
      };
      return {
        ...state,
        faculties: {
          ...state.faculties,
          loading: false,
          error: null,
          list: [
            ...state.faculties.list,
            action.faculty
          ]
        }
      }

    case actions.GET_FACULTY_FAIL:
      console.log('get faculties error', action.err);
      return {
        ...state,
        faculties: {
          ...state.faculties,
          loading: false,
          error: action.err
        }
      }

    default:
      return state;
  }
}
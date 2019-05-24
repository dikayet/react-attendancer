import * as actions from '../actions/actionTypes';

const initState = {
  adding: {
    loading: false,
    error: null
  },
  deleting: {
    loading: false,
    error: null
  },
  classes: {
    loading: false,
    error: null,
    list: []
  }
}

export default (state = initState, action) => {
  switch (action.type) {

    case actions.ADD_CLASS_START:
      console.log('adding class...');
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: true
        }
      };

    case actions.ADD_CLASS_SUCCESS:
      console.log('class adding success:', action.class);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: null
        },
        classes: {
          ...state.classes,
          list: [
            ...state.classes.list,
            action.class,
          ]
        }
      };
    case actions.UPDATE_CLASS_SUCCESS:
      console.log('class updating success:', action.class);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: null
        },
        classes: {
          ...state.classes,
          list: [
            action.class,
            ...state.classes.list.filter(el => el.id !== action.class.id),
          ]
        }
      };

    case actions.ADD_CLASS_FAIL:
      console.log('class adding fail:', action.err.message);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: action.err
        }
      };
    
    case actions.DELETE_CLASS_START:
      console.log('deleting class...');
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: true
        }
      };

    case actions.DELETE_CLASS_SUCCESS:
      console.log('class deleting success:', action.classId);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: false,
          error: null
        },
        classes: {
          ...state.classes,
          list: state.classes.list.filter(el => el.id !== action.classId)
        }
      };

    case actions.DELETE_CLASS_FAIL:
      console.log('class deleting fail:', action.err.message);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: false,
          error: action.err
        }
      };

    case actions.GET_CLASS_START:
      console.log('getting classes...');
      return {
        ...state,
        classes: {
          ...state.classes,
          loading: true,
          list: []
        }
      }

    case actions.GET_CLASS_SUCCESS:
      console.log('get class success', action.class);
      if (!action.class) return {
        ...state,
        classes: {
          ...state.classes,
          loading: false
        }
      };
      return {
        ...state,
        classes: {
          ...state.classes,
          loading: false,
          error: null,
          list: [
            ...state.classes.list,
            action.class
          ]
        }
      }

    case actions.GET_CLASS_FAIL:
      console.log('get class error', action.err);
      return {
        ...state,
        classes: {
          ...state.classes,
          loading: false,
          error: action.err
        }
      }

    default:
      return state;
  }
}
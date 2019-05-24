import * as actions from '../actions/actionTypes';

const initState = {
  adding: {
    loading: false,
    error: null
  },
  uploadingDoc: {
    loading: false,
    error: null,
    loadingIndex: null
  },
  action: {
    loading: false,
    error: null,
    loadingIndex: null
  },
  list: [],
  loading: false,
  error: null
}

export default (state = initState, action) => {
  switch (action.type) {

    case actions.ADD_ATT_START:
      console.log('adding attendance...');
      return {
        ...state,
        adding: {
          error: null,
          loading: true
        }
      };

    case actions.ADD_ATT_SUCCESS:
      console.log('attendance adding success:');
      return {
        ...state,
        adding: {
          loading: false,
          error: null
        }
      };

    case actions.ADD_ATT_FAIL:
      console.log('attendance adding fail:', action.err.message);
      return {
        ...state,
        adding: {
          loading: false,
          error: action.err
        }
      };

    case actions.GET_ATT_BY_STUDENT_START:
      console.log('attendance get start');
      return {
        ...state,
        loading: true,
        list: []
      }
    case actions.GET_ATT_BY_STUDENT_SUCCESS:
      console.log('attendance get success: ', action.att);
      if(!action.att) return {
        ...state,
        list: [],
        loading: false,
        error: null
      }
      let viewAtt = {
        ...action.att,
        class: [action.att.class],
      }
      state.list.forEach(att => {
        if(att.time === action.att.time){
          viewAtt.class.push(...att.class);
        }
      })
      console.log(viewAtt)
      return {
        ...state,
        loading: false,
        error: null,
        list: [viewAtt, ...state.list.filter(el => el.time !== viewAtt.time)]
      }
    case actions.GET_ATT_BY_STUDENT_FAIL:
      console.log('attendance get fail: ', action.err);
      return {
        ...state,
        loading: false,
        error: action.err,
      }
    case actions.GET_ATT_ADMIN_START:
      console.log('attendance get start');
      return {
        ...state,
        loading: true,
        list: []
      }
    case actions.GET_ATT_ADMIN_SUCCESS:
      console.log('attendance get success: ', action.att);
      if(!action.att) return {
        ...state,
        list: [],
        loading: false,
        error: null
      }
      viewAtt = {
        ...action.att,
        class: [action.att.class],
      }
      state.list.forEach(att => {
        if(att.time === action.att.time && att.student.id === action.att.student.id){
          viewAtt.class.push(...att.class);
        }
      })
      return {
        ...state,
        loading: false,
        error: null,
        list: [viewAtt, ...state.list.filter(el => el.time !== viewAtt.time || el.student.id !== viewAtt.student.id)]
      }
    case actions.GET_ATT_ADMIN_FAIL:
      console.log('attendance get fail: ', action.err);
      return {
        ...state,
        loading: false,
        error: action.err,
      }

    case actions.UPLOAD_ATT_DOC_START:
      console.log('attendance doc uploading...', action.index);
      return {
        ...state,
        uploadingDoc: {
          error: null,
          loading: true,
          loadingIndex: +action.index
        }
      }
    case actions.UPLOAD_ATT_DOC_SUCCESS:
      console.log('attendance doc upload success');
      let index = state.uploadingDoc.loadingIndex;
      return {
        ...state,
        uploadingDoc: {
          error: null,
          loading: false,
          loadingIndex: null
        },
        list: state.list.filter((el , i) => i !== index)
      }
    case actions.UPLOAD_ATT_DOC_FAIL:
      console.log('attendance doc upload fail ', action.err);
      return {
        ...state,
        uploadingDoc: {
          error: action.err,
          loading: false,
          loadingIndex: null
        }
      }
    case actions.ATT_ACTION_START:
      console.log('attendance action...', action.index);
      return {
        ...state,
        action: {
          error: null,
          loading: true,
          loadingIndex: +action.index
        }
      }
    case actions.ATT_ACTION_SUCCESS:
      console.log('attendance action success');
      index = state.action.loadingIndex;
      return {
        ...state,
        action: {
          error: null,
          loading: false,
          loadingIndex: null
        },
        list: state.list.filter((el , i) => i !== index)
      }
    case actions.ATT_ACTION_FAIL:
      console.log('attendance action fail ', action.err);
      return {
        ...state,
        action: {
          error: action.err,
          loading: false,
          loadingIndex: null
        }
      }

    default:
      return state;
  }
}
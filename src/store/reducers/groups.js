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
  groups: {
    loading: false,
    error: null,
    list: []
  }
}

export default (state = initState, action) => {
  switch (action.type) {

    case actions.ADD_GROUP_START:
      console.log('adding group...');
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: true
        }
      };

    case actions.ADD_GROUP_SUCCESS:
      console.log('group adding success:', action.group);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: null
        },
        groups: {
          ...state.groups,
          list: [
            ...state.groups.list,
            action.group,
          ]
        }
      };
    case actions.UPDATE_GROUP_SUCCESS:
      console.log('group updating success:', action.group);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: null
        },
        groups: {
          ...state.groups,
          list: [
            action.group,
            ...state.groups.list.filter(el => el.id !== action.group.id),
          ]
        }
      };



    case actions.REMOVE_GROUP_CLASS:
      console.log('removing group class', action.groupId, action.classId);
      let groups = state.groups.list;
      let group = groups.find(el => el.id === action.groupId);
      let newGroup = {...group, classes: group.classes.filter(el => el.id !== action.classId)}
      return {
        ...state,
        groups: {
          ...state.groups,
          list: [newGroup, ...groups.filter(el => el.id !== group.id)]
        }
      };
    case actions.ADD_GROUP_CLASS:
      console.log('adding group class', action.groupId, action.class);
      groups = state.groups.list;
      group = groups.find(el => el.id === action.groupId);
      newGroup = { ...group, classes: [action.class, ...group.classes] }
      return {
        ...state,
        groups: {
          ...state.groups,
          list: [newGroup, ...groups.filter(el => el.id !== group.id)]
        }
      };



    case actions.ADD_GROUP_FAIL:
      console.log('group adding fail:', action.err.message);
      return {
        ...state,
        adding: {
          ...state.adding,
          loading: false,
          error: action.err
        }
      };

    case actions.DELETE_GROUP_START:
      console.log('deleting group...');
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: true
        }
      };

    case actions.DELETE_GROUP_SUCCESS:
      console.log('group deleting success:', action.groupId);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: false,
          error: null
        },
        groups: {
          ...state.groups,
          list: state.groups.list.filter(el => el.id !== action.groupId)
        }
      };

    case actions.DELETE_GROUP_FAIL:
      console.log('group deleting fail:', action.err.message);
      return {
        ...state,
        deleting: {
          ...state.deleting,
          loading: false,
          error: action.err
        }
      };

    case actions.GET_GROUP_START:
      console.log('getting groups...');
      return {
        ...state,
        groups: {
          ...state.groups,
          loading: true,
          list: []
        }
      }

    case actions.GET_GROUP_SUCCESS:
      console.log('get groups success', action.group);
      if (!action.group) return {
        ...state,
        groups: {
          ...state.groups,
          loading: false
        }
      };
      return {
        ...state,
        groups: {
          ...state.groups,
          loading: false,
          error: null,
          list: [
            ...state.groups.list,
            action.group
          ]
        }
      }

    case actions.GET_GROUP_FAIL:
      console.log('get groups error', action.err);
      return {
        ...state,
        groups: {
          ...state.groups,
          loading: false,
          error: action.err
        }
      }

    default:
      return state;
  }
}
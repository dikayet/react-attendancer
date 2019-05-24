import * as actions from '../actions/actionTypes';

const initState = {
  show: false,
  itemId: null
}

export default (state = initState, action) => {
  switch (action.type) {

    case actions.OPEN_DELETE_MODAL:
      console.log('modal open', action.itemId);
      return {
        show: true,
        itemId: action.itemId
      };

    case actions.CLOSE_DELETE_MODAL:
      console.log('modal close');
      return {
        show: false,
        itemId: null
      };

    default:
      return state;
  }
}
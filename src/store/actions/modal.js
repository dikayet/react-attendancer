import * as actions from './actionTypes';

export const openDeleteModal = (itemId) => ({ type: actions.OPEN_DELETE_MODAL, itemId });
export const closeDeleteModal = () => ({ type: actions.CLOSE_DELETE_MODAL });
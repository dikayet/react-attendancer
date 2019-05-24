import * as actions from './actionTypes';

export const addGroup = (group, editId, cb) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  dispatch({ type: actions.ADD_GROUP_START });
  const actionSuccess = editId ? actions.UPDATE_GROUP_SUCCESS : actions.ADD_GROUP_SUCCESS;
  const ref = firestore.collection('groups');
  let refPromise;
  if (editId) {
    refPromise = ref.doc(editId).update(group);
  } else {
    refPromise = ref.add(group);
  }
  refPromise
    .then((doc) => {
      dispatch({ type: actionSuccess, group: { ...group, id: doc ? doc.id : editId } })
      if (cb) cb();
    }).catch((err) => {
      dispatch({ type: actions.ADD_GROUP_FAIL, err });
    })
}

export const deleteGroup = (groupId) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  dispatch({ type: actions.DELETE_GROUP_START })
  firestore.collection('groups').doc(groupId).delete()
    .then(() => {
      dispatch({ type: actions.DELETE_GROUP_SUCCESS, groupId });
      dispatch({ type: actions.CLOSE_DELETE_MODAL });
    }).catch((err) => {
      dispatch({ type: actions.DELETE_GROUP_FAIL, err });
    })
}

export const getGroups = () => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();

  dispatch({ type: actions.GET_GROUP_START });

  firestore.collection('groups').orderBy('name').get()
    .then(snapshot => {
      if (snapshot.docs.length < 1) {
        dispatch({ type: actions.GET_GROUP_SUCCESS });
      } else {
        snapshot.forEach(doc => {
          dispatch({ type: actions.GET_GROUP_SUCCESS, group: { ...doc.data(), id: doc.id } });
        })
      }
    })
    .catch(err => dispatch({ type: actions.GET_GROUP_FAIL, err }))
}
import * as actions from './actionTypes';

export const addFaculty = (fac, editId, cb) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  dispatch({ type: actions.ADD_FACULTY_START })
  const actionSuccess = editId ? actions.UPDATE_FACULTY_SUCCESS : actions.ADD_FACULTY_SUCCESS;
  const ref = firestore.collection('faculties');
  let refPromise;
  if (editId) {
    refPromise = ref.doc(editId).update({ ...fac });
  } else {
    refPromise = ref.add({ ...fac });
  }
  refPromise.then((doc) => {
    dispatch({ type: actionSuccess, faculty: { groups: [], ...fac, id: doc ? doc.id : editId } });
    if (cb) cb();
    }).catch((err) => {
      dispatch({ type: actions.ADD_FACULTY_FAIL, err });
    })
}

export const deleteFaculty = (facId) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  dispatch({ type: actions.DELETE_FACULTY_START })
  firestore.collection('faculties').doc(facId).delete()
    .then(() => {
      dispatch({ type: actions.DELETE_FACULTY_SUCCESS, facId });
      dispatch({ type: actions.CLOSE_DELETE_MODAL });
    }).catch((err) => {
      dispatch({ type: actions.DELETE_FACULTY_FAIL, err });
    })
}

export const getFaculties = () => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();

  dispatch({ type: actions.GET_FACULTY_START });

  firestore.collection('faculties').get()
    .then(snapshot => {
      if (snapshot.docs.length < 1) {
        dispatch({ type: actions.GET_FACULTY_SUCCESS });
      } else {
        snapshot.forEach(doc => {
          dispatch({ type: actions.GET_FACULTY_SUCCESS, faculty: { ...doc.data(), id: doc.id } });
        })
      }
    })
    .catch(err => dispatch({ type: actions.GET_FACULTY_FAIL, err }))
}
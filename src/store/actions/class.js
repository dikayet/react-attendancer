import * as actions from './actionTypes';

export const addClass = (newClass, editId, cb) => (dispatch, getState, { getFirebase, getFirestore }) => {
  console.log(newClass);
  const firestore = getFirestore();
  const actionSuccess = editId ? actions.UPDATE_CLASS_SUCCESS : actions.ADD_CLASS_SUCCESS;
  dispatch({ type: actions.ADD_CLASS_START });
  const ref = firestore.collection('classes');
  let refPromise;
  if(editId){
    refPromise = ref.doc(editId).update({name: newClass.name});
  } else {
    refPromise = ref.add({name: newClass.name});
  }
  refPromise.then((doc) => {
    let classId = doc ? doc.id : editId;
    if(editId){
    firestore.collection('groups').get()
      .then(snapshot => {
        let counter = 0;
        snapshot.forEach((doc, i) => {
          counter++;
          let promise, group = doc.data(), groupId = doc.id;
          let groupHasClass = group.classes.findIndex(c => c.id === classId) !== -1 ? true : false;
          let classHasGroup = newClass.groups.findIndex(g => g.id === groupId) !== -1 ? true : false;
          if (groupHasClass && !classHasGroup) {
            dispatch({ type: actions.REMOVE_GROUP_CLASS, groupId, classId: editId })
            promise = firestore.collection('groups').doc(groupId)
              .update({
                classes: group.classes.filter(c => c.id !== classId)
              })
          }
          if(!groupHasClass && classHasGroup){
            dispatch({ type: actions.ADD_GROUP_CLASS, groupId, class: { counter: 0, name: newClass.name, id: classId } })
            promise = firestore.collection('groups').doc(groupId)
              .update({
                classes: firestore.FieldValue.arrayUnion({ name: newClass.name, id: classId, counter: 0 })
              })
          }
          if(promise){
            promise
              .then(() => {
                console.log('group updated');
                console.log(snapshot.docs.length, counter);
                if (counter === snapshot.docs.length){
                  if (cb) cb();
                  dispatch({ type: actionSuccess, class: { name: newClass.name, id: classId } });
                }
              })
              .catch(err => console.log('group update fail: ', err))
          }
          if (cb) cb();
          dispatch({ type: actionSuccess, class: { name: newClass.name, id: classId } });
        })
      }).catch(err => console.log('groups update fail: ', err));
    } else {
      newClass.groups.forEach((group, i) => {
        firestore.collection('groups').doc(group.id).update({
          classes: firestore.FieldValue.arrayUnion({ name: newClass.name, id: classId, counter: 0 })
        })
          .then(() => {
            console.log('group updated')
            if (i === newClass.groups.length - 1){
              if (cb) cb();
              dispatch({ type: actionSuccess, class: { name: newClass.name, id: classId } });
            }
          })
          .catch(err => console.log('group update fail: ', err))
      })
    }
  }).catch((err) => {
    dispatch({ type: actions.ADD_CLASS_FAIL, err });
  });
}

export const deleteClass = (classId) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  dispatch({ type: actions.DELETE_CLASS_START });
  firestore.collection('classes').doc(classId).delete()
    .then(() => {
      firestore.collection('groups').get()
        .then(snapshot => {
          let counter = 0;
          snapshot.forEach(doc => {
            counter++;
            let group = doc.data();
            if (group.classes.findIndex(c => c.id === classId) !== -1) {
              let ref = firestore.collection('groups').doc(doc.id);
              ref.get()
                .then(doc => {
                  let classes = doc.data().classes;
                  let newClasses = classes.filter(el => classId !== el.id);
                  return ref.update({ classes: newClasses })
                })
                .then(() => {
                  console.log('classes updated')
                  if (counter === snapshot.docs.length){
                    dispatch({ type: actions.DELETE_CLASS_SUCCESS, classId });
                    dispatch({ type: actions.CLOSE_DELETE_MODAL });
                  }
                })
                .catch(err => console.log('classes update fail: ', err))
            } else {
              console.log('classes didnt require to be updated');
              if (counter === snapshot.docs.length) {
                dispatch({ type: actions.DELETE_CLASS_SUCCESS, classId });
                dispatch({ type: actions.CLOSE_DELETE_MODAL });
              }
            }
          })
        })
    }).catch((err) => {
      dispatch({ type: actions.DELETE_CLASS_FAIL, err });
    })
}

export const getClasses = (spec, limit, startAfter) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();

  dispatch({ type: actions.GET_CLASS_START });

  let ref = firestore.collection('classes');
  if(spec){
    ref = ref.where('spec', '==', spec);
  }
  if(limit){
    ref = ref.limit(limit);
  }
  if (startAfter){
    ref = ref.startAfter(startAfter);
  }

  ref.orderBy('name').get()
    .then(snapshot => {
      if(snapshot.docs.length < 1){
        dispatch({ type: actions.GET_CLASS_SUCCESS });
      } else {
        snapshot.forEach(doc => {
          dispatch({ type: actions.GET_CLASS_SUCCESS, class: { ...doc.data(), id: doc.id } });
        })
      }
    })
    .catch(err => dispatch({ type: actions.GET_CLASS_FAIL, err }))
}
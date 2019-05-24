import * as actions from './actionTypes';
import moment from 'moment';

export const addAttendance = (attendance, cb) => (dispatch, getState, { getFirebase, getFirestore }) => {
  console.log(attendance);
  const firestore = getFirestore();
  const time = moment(new Date()).format('DDD/YY');
  dispatch({ type: actions.ADD_ATT_START });
  attendance.forEach(att => {
    if(att.students.length > 0){
      att.students.forEach(student => {
        console.log(student, att.group, att.class);
        firestore.collection('attendance').add({
          student,
          group: att.group,
          class: { id: att.class.id, name: att.class.name },
          time,
          checked: false,
          photoUrl: null,
          photoId: null
        })
          .then(() => {
            dispatch({ type: actions.ADD_ATT_SUCCESS })
            if (cb) cb();
          })
          .catch(err => dispatch({ type: actions.ADD_ATT_FAIL, err }))
      })
    }
    // ! Not updating counter properly
    // firestore.collection('groups').doc(att.group.id).get()
    //   .then(doc => {
    //     let group = doc.data();
    //     group.classes.forEach(clss => {
    //       let newClasses = group.classes.map(clss => clss.id === att.class.id ? { ...clss, counter: clss.counter + 1 } : clss);
    //     })
    // //     return firestore.collection('groups').doc(att.group.id).update({
    // //       classes: newClasses
    // //     })
    //   })
    //   .then(() => console.log('counter updated'))
    //   .catch(err => console.log('counter update fail: ', err))
  })
}

export const getAttByStudent = studentId => (dispatch, getState, { getFirebase, getFirestore }) => {
  console.log(studentId)
  const firestore = getFirestore();
  dispatch({ type: actions.GET_ATT_BY_STUDENT_START });
  firestore.collection('attendance').where('student.id', '==', studentId).where('checked', '==', false).get()
    .then(snapshot => {
      if (snapshot.docs.length < 1) {
        console.log('here');
        dispatch({ type: actions.GET_ATT_BY_STUDENT_SUCCESS, att: null });
      } else {
        snapshot.forEach(doc => {
          if(doc.data().photoId === null){
            dispatch({
              type: actions.GET_ATT_BY_STUDENT_SUCCESS,
              att: {
                ...doc.data(),
                id: doc.id
              }
            })
          }
        });
      }
    })
    .catch(err => dispatch({ type: actions.GET_ATT_BY_STUDENT_FAIL, err }))
}

export const getAttAdmin = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  dispatch({ type: actions.GET_ATT_ADMIN_START });
  firestore.collection('attendance').where('checked', '==', false).get()
    .then(snapshot => {
      const withPhotos = [];
      snapshot.forEach(doc => {
        if(doc.data().photoId !== null){
          withPhotos.push(doc);
        }
      })
      if (withPhotos.length < 1) {
        dispatch({ type: actions.GET_ATT_ADMIN_SUCCESS, att: null });
      } else {
        withPhotos.forEach(doc => {
          dispatch({ type: actions.GET_ATT_ADMIN_SUCCESS, att: { ...doc.data(), id: doc.id } })
        })
      }
    })
    .catch(err => dispatch({ type: actions.GET_ATT_ADMIN_FAIL, err }))
}

export const uploadDoc = (file, attId, studentId, time, index) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const date = new Date();
  dispatch({ type: actions.UPLOAD_ATT_DOC_START, index });
  firestore.collection('images').add({ uploadedAt: date, attId })
    .then(doc => {
      let imgId = doc.id
      let imgRef = firebase.storage().ref(imgId);
      imgRef.put(file)
        .then((doc) => {
          return imgRef.getDownloadURL();
        })
        .then(url => {
          firestore.collection('attendance').where('time', '==', time).where('student.id', '==', studentId).get()
          .then(snapshot => {
            dispatch({ type: actions.UPLOAD_ATT_DOC_SUCCESS });
            snapshot.forEach(doc => {
              firestore.collection('attendance').doc(doc.id).update({ photoId: imgId, photoUrl: url })
                .then(() => console.log('attendance updated'))
                .catch(err => console.log('attendance update fail: ', err))
            })
          })
            .catch(err => dispatch({ type: actions.UPLOAD_ATT_DOC_FAIL, err }))
        })
        .catch(err => dispatch({ type: actions.UPLOAD_ATT_DOC_FAIL, err }))
    })
    .catch(err => dispatch({ type: actions.UPLOAD_ATT_DOC_FAIL, err }))
}


export const acceptDoc = (studentId, time, index) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const ref = firestore.collection('attendance');

  dispatch({ type: actions.ATT_ACTION_START, index })

  ref.where('student.id', '==', studentId).where('time', '==', time).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        ref.doc(doc.id).update({ checked: true })
          .then(() => dispatch({ type: actions.ATT_ACTION_SUCCESS, index }))
          .catch(err => dispatch({ type: actions.ATT_ACTION_FAIL, err }))
      })
    })
    .catch(err => dispatch({ type: actions.ATT_ACTION_FAIL, err }))
  
}
export const declineDoc = (studentId, time, index) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const ref = firestore.collection('attendance');

  dispatch({ type: actions.ATT_ACTION_START, index })

  ref.where('student.id', '==', studentId).where('time', '==', time).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        ref.doc(doc.id).update({ photoId: null, photoUrl: null })
          .then(() => dispatch({ type: actions.ATT_ACTION_SUCCESS, index }))
          .catch(err => dispatch({ type: actions.ATT_ACTION_FAIL, err }))
      })
    })
    .catch(err => dispatch({ type: actions.ATT_ACTION_FAIL, err }))
}
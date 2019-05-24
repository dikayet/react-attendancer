import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { getFirestore, reduxFirestore } from 'redux-firestore';
import fbConfig from '../config/fbConfig';
import rootReducer from './reducers/root';

// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;



const store = createStore(rootReducer, compose(
	applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
	reduxFirestore(fbConfig),
	reactReduxFirebase(fbConfig, {
		attachAuthIsReady: true,
		useFirestoreForProfile: true,
		userProfile: 'users',
		enableRedirectHandling: false
	})
));

export default store;
// Setup for the core app and services (firestore, auth)
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Config object, provided by Firebase
const config = {
	apiKey: 'AIzaSyBaq0fIwvXMxbd8u5tNVCAIoTt6PJJHbrs',
	authDomain: 'crowndb-a1f2d.firebaseapp.com',
	databaseURL: 'https://crowndb-a1f2d.firebaseio.com',
	projectId: 'crowndb-a1f2d',
	storageBucket: 'crowndb-a1f2d.appspot.com',
	messagingSenderId: '293114275649',
	appId: '1:293114275649:web:8f30f3ec0bc89c0c9b23c0',
	measurementId: 'G-YC41TCWRPH',
};

// Adding the user to the DB
export const createUserProfileDocument = async (userAuth, additionalData) => {
	if (!userAuth) return;
	/* This returns a documentReference object. We use it to CRUD */
	const userRef = firestore.doc(`users/${userAuth.uid}`);
	/* And here we actually CRUD */
	const snapShot = await userRef.get();

	if (!snapShot.exists) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await userRef.set({
				displayName,
				email,
				createdAt,
				...additionalData,
			});
		} catch (err) {
			console.log('error creating user', err.message);
		}
	}

	return userRef;
};

// Here core app is initialized
firebase.initializeApp(config);

//...and now the services to use
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// This allows us to use Google Sign-up
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;

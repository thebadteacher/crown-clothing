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
// Here core app is initialized
firebase.initializeApp(config);

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

export const addCollectionAndDocuments = async (
	collectionKey,
	objectsToAdd
) => {
	const collectionRef = firestore.collection(collectionKey);
	console.log(collectionRef);

	const batch = firestore.batch();
	objectsToAdd.forEach((object) => {
		const newDocRef = collectionRef.doc();
		batch.set(newDocRef, object);
	});

	return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
	//This gives us an array with object as we want them to appear in our state.
	// NOTE: I hate firebase
	const transformedCollection = collections.docs.map((doc) => {
		const { title, items } = doc.data();

		return {
			routeName: encodeURI(title.toLowerCase()),
			id: doc.id,
			title,
			items,
		};
	});

	//now we take the array we built. Each iteration adds into the accumulator the collections under the key of the name of that collection.
	// { hats: {hatsCollection}, etc. } ** No idea why not use routeName here **

	return transformedCollection.reduce((accumulator, collection) => {
		accumulator[collection.title.toLowerCase()] = collection;
		return accumulator;
	}, {});
	//The empty object at the end? That's our initial accumulator. Read docs on .reduce /facepalm
};

//...and now the services to use
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// This allows us to use Google Sign-up
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;

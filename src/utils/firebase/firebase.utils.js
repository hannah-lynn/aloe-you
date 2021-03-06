import { initializeApp } from 'firebase/app';
import 'firebase/compat/auth';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  collection,
  query,
  getDocs,
  updateDoc,
  serverTimestamp,
  collectionGroup,
  where,
} from 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDlmCidTUi3-tvqPbvn5sKsw3sPxc8TEzI',
  authDomain: 'aloe-you-db.firebaseapp.com',
  projectId: 'aloe-you-db',
  storageBucket: 'aloe-you-db.appspot.com',
  messagingSenderId: '640153378212',
  appId: '1:640153378212:web:19771a376fd6a348c23531',
  measurementId: 'G-1NKB3Q9DVH',
};

// eslint-disable-next-line no-unused-vars
const firebaseApp = initializeApp(config);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const auth = getAuth();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);
  objectsToAdd.forEach((obj) => {
    const docRef = doc(collectionRef, obj.category.toLowerCase());
    batch.set(docRef, obj);
  });
  await batch.commit();
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);

  const categoryMap = querySnapshot.docs.map((docSnapshot) => {
    const { items } = docSnapshot.data();
    return items;
  }, {});

  return categoryMap;
};

export const createUserProfileDocument = async (
  userAuth,
  additionalData = {}
) => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
      await createCustomerDocument(userAuth, additionalData, createdAt);
    } catch (err) {
      console.log('error creating user', err.message);
    }
  }

  return userRef;
};

const createCustomerDocument = async (userAuth, additionalData) => {
  const createdAt = new Date();
  if (!userAuth) return;
  await setDoc(doc(db, 'customers', userAuth.uid), {
    ...additionalData,
    createdAt,
  });
};

export const getCustomerDocument = async (user) => {
  if (!user) return;
  const customer = await getDoc(doc(db, 'customers', user.uid));
  if (customer.exists()) {
    return customer;
  } else {
    console.log('Customer does not exist');
  }
};

export const updateCustomerDocument = async (userId, additionalData) => {
  if (!userId) return;
  await updateDoc(doc(db, 'customers', userId), {
    ...additionalData,
    updatedAt: serverTimestamp(),
  });
};

export const createOrderDocument = (customer, payment) => {
  const { created, client_secret, amount, id, status } = payment.paymentIntent;
  if (!customer || !customer.userId) return;
  const orderNumber = 'AY_' + new Date().getTime();
  setDoc(doc(db, 'orders', orderNumber), {
    customer: customer.userId,
    clientSecret: client_secret,
    amount: amount / 100,
    paymentId: id,
    status,
    created,
  });
};

export const getOrders = async (user) => {
  if (!user) return;
  const orders = query(
    collectionGroup(db, 'orders'),
    where('customer', '==', user)
  );
  let theOrders = [];
  const querySnapshot = await getDocs(orders);
  querySnapshot.forEach((doc) => {
    theOrders.push(doc.data());
  });
  return theOrders;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUserOut = () => signOut(auth);

export const onAuthStateChangedListener = (callback) => {
  if (!callback) return;
  onAuthStateChanged(auth, callback);
};

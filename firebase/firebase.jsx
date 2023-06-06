import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut 
} from "firebase/auth";
import { 
    getDatabase, 
    ref as firebaseDatabaseRef, 
    set as firebaseSet,
    child,
    get,
    onValue, update 
} from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, getMetadata, getBlob  } from "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyAcOf4MCq8W7qf4cAb7yiDmcfXbJ98qWfI",
    authDomain: "soicialnetworkapp.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://soicialnetworkapp-default-rtdb.firebaseio.com",
    projectId: "soicialnetworkapp",
    storageBucket: "soicialnetworkapp.appspot.com",
    messagingSenderId: "1028380084868",  // project number
    appId: "1:1028380084868:android:e515bf816cc79e5862d0d1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
const storage = getStorage(app);

export {
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged, 
    firebaseDatabaseRef, 
    firebaseSet, 
    sendEmailVerification,
    child,
    get,
    update,
    onValue, // reload when online DB changed
    signOut,
    
    storage, storageRef, uploadBytes, getDownloadURL, getMetadata, getBlob
}
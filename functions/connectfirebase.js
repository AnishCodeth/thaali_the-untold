import { initializeApp } from 'firebase/app';
import {getFirestore,collection,getDocs} from 'firebase/firestore/lite'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
apiKey: "AIzaSyBR4ytd3exescBCTNd8p7jwBTMSvZacH68",
authDomain: "thaali-9dc70.firebaseapp.com",
projectId: "thaali-9dc70",
storageBucket: "thaali-9dc70.appspot.com",
messagingSenderId: "1027868059022",
appId: "1:1027868059022:web:ea093f12670ce31e1a30df",
measurementId: "G-5BPWY07M2J"
};

const app = initializeApp(firebaseConfig);
const db=getFirestore(app);



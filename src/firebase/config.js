// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQe-xQaBzX4i27RWxlsH0phlmTtog9Z0E",
  authDomain: "custos-6dcb8.firebaseapp.com",
  projectId: "custos-6dcb8",
  storageBucket: "custos-6dcb8.appspot.com",
  messagingSenderId: "201323479148",
  appId: "1:201323479148:web:2b577e8e9b87c744b75849",
  measurementId: "G-BJHBGL6BP0"
};

// Inicializando o firebase
const app = initializeApp(firebaseConfig);

//  Chamando o banco de dados
const db = getFirestore(app);



export { app, db };

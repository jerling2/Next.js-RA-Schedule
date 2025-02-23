import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBQqpfzTFcQhB-yTEvdBKl9vMSDEs2wpTI",
  authDomain: "next-js-ra-app.firebaseapp.com",
  projectId: "next-js-ra-app",
  storageBucket: "next-js-ra-app.firebasestorage.app",
  messagingSenderId: "666893757413",
  appId: "1:666893757413:web:c0231331c726a5bb235d0c"
};

  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


if (process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true') {
  console.log("using auth emulator");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}


export { app, auth };
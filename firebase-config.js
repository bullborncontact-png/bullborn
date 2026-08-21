import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB37IY26RQLCwYFB4U_biSI7FslS1GuWSA",
    authDomain: "bullborn-f7192.firebaseapp.com",
    databaseURL: "https://bullborn-f7192-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bullborn-f7192",
    storageBucket: "bullborn-f7192.firebasestorage.app",
    messagingSenderId: "610156006264",
    appId: "1:610156006264:web:01a13091d3b719100f168d",
    measurementId: "G-2TBS7JZFTC"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
/* ═══════════════════════════════════════════════════════════════════════════
   Firebase Configuration & Initialization
   ═══════════════════════════════════════════════════════════════════════════
   IMPORTANT: Replace the placeholder values below with your actual
   Firebase project credentials from the Firebase Console.
   Go to: Firebase Console → Project Settings → General → Your apps → Web app
   ═══════════════════════════════════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyCPHSIPI_7bKPmCW4yhqRojcbAUh4iy7Nw",
  authDomain: "affiliate-4075c.firebaseapp.com",
  projectId: "affiliate-4075c",
  storageBucket: "affiliate-4075c.firebasestorage.app",
  messagingSenderId: "397935903559",
  appId: "1:397935903559:web:71b885a20ebf86fa270262",
  measurementId: "G-ZH97SY7NH6"
};

let db = null;
let productsRef = null;
let adminsRef = null;
let analytics = null;

try {
  if (firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID' && firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    productsRef = db.collection('products');
    adminsRef = db.collection('admins');
    if (typeof firebase.analytics === 'function') {
      analytics = firebase.analytics();
    }
    console.log('%c🔥 Firebase Firestore & Analytics connected', 'color: #34d399; font-weight: bold;');
  } else {
    console.log('%cℹ ShopVault running in local/demo mode (add credentials to firebase-config.js to sync with Firestore)', 'color: #38bdf8; font-weight: bold;');
  }
} catch (err) {
  console.warn('Firebase initialization skipped or failed:', err);
}

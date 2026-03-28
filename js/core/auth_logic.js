// IMPORT FIREBASE
import { auth, db } from "./firebase.js";
import { DEFAULT_AVATAR } from "./avatars.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// REGISTER
export async function register(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Crear usuario en Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    photoURL: DEFAULT_AVATAR,
    createdAt: serverTimestamp()
  });

  return user;
}

// LOGIN
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

// LOGOUT
export async function logout() {
  await signOut(auth);
}

// GOOGLE SIGN-IN
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Solo crear el documento en Firestore si es la primera vez
  const isNew = result._tokenResponse?.isNewUser;
  if (isNew) {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "Usuario",
      email: user.email,
      photoURL: DEFAULT_AVATAR,
      createdAt: serverTimestamp()
    });
  }

  return user;
}

import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db, googleProvider } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export async function loginUser(email: string, password: string, expectedRole?: "admin" | "student") {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  const userDoc = await getDoc(doc(db, "users", user.uid))

  if (!userDoc.exists()) {
    throw new Error("User profile not found")
  }

  const data = userDoc.data()

  if (expectedRole && data.role !== expectedRole) {
    throw new Error("Role mismatch")
  }

  return {
    uid: user.uid,
    email: user.email,
    ...data,
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "admin" | "student"
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email: user.email || "",
    role,
    photoURL: "",
    createdAt: new Date().toISOString(),
  })

  return {
    uid: user.uid,
    email: user.email,
    name,
    role,
  }
}

export async function signInWithGoogle(role: "admin" | "student") {
  const result = await signInWithPopup(auth, googleProvider)
  const user = result.user

  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      role,
      photoURL: user.photoURL || "",
      createdAt: new Date().toISOString(),
    })
  }

  const finalSnap = await getDoc(userRef)

  return {
    uid: user.uid,
    email: user.email,
    ...finalSnap.data(),
  }
}
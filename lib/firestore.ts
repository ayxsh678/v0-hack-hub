import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// ── Generic helpers ──────────────────────────────────────────────
export function colRef(path: string) {
  return collection(db, path)
}

export function docRef(path: string, id: string) {
  return doc(db, path, id)
}

// ── CRUD ─────────────────────────────────────────────────────────
export async function getAll<T = DocumentData>(
  path: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = constraints.length ? query(colRef(path), ...constraints) : colRef(path)
  const snap = await getDocs(q)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as T[]
}

export async function getOne<T = DocumentData>(
  path: string,
  id: string
): Promise<T | null> {
  const snap = await getDoc(docRef(path, id))

  return snap.exists()
    ? ({ id: snap.id, ...snap.data() } as T)
    : null
}

export async function create<T = DocumentData>(
  path: string,
  data: T
): Promise<string> {
  const ref = await addDoc(colRef(path), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function update<T = DocumentData>(
  path: string,
  id: string,
  data: Partial<T>
) {
  await updateDoc(docRef(path, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function remove(path: string, id: string) {
  await deleteDoc(docRef(path, id))
}

// ── REAL-TIME (🔥 MAIN FEATURE) ───────────────────────────────────
export function subscribe<T = DocumentData>(
  path: string,
  callback: (docs: T[]) => void,
  ...constraints: QueryConstraint[]
) {
  const q = constraints.length ? query(colRef(path), ...constraints) : colRef(path)

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as T[]

    callback(data)
  })
}

export function subscribeDoc<T = DocumentData>(
  path: string,
  id: string,
  callback: (doc: T | null) => void
) {
  return onSnapshot(docRef(path, id), (snap) => {
    callback(
      snap.exists()
        ? ({ id: snap.id, ...snap.data() } as T)
        : null
    )
  })
}

// ── COLLECTIONS (ADD YOURS HERE) ─────────────────────────────────
export const COLLECTIONS = {
  USERS: "users",
  SUBMISSIONS: "submissions",
  ANNOUNCEMENTS: "announcements",
  TEAMS: "teams",
  MESSAGES: "messages",
} as const

// ── EXPORT HELPERS ───────────────────────────────────────────────
export { query, where, orderBy, serverTimestamp }
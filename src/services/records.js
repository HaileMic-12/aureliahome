import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, requireFirebase } from "../firebase";

const clean = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clean(item)]),
    );
  return value;
};

export async function createRecord(collectionName, payload) {
  requireFirebase();
  const reference = await addDoc(collection(db, collectionName), {
    ...clean(payload),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

export async function getRecords(collectionName) {
  requireFirebase();
  const snapshot = await getDocs(
    query(collection(db, collectionName), orderBy("createdAt", "desc")),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function updateRecord(collectionName, id, values) {
  requireFirebase();
  return updateDoc(doc(db, collectionName, id), {
    ...clean(values),
    updatedAt: serverTimestamp(),
  });
}

export async function removeRecord(collectionName, id) {
  requireFirebase();
  return deleteDoc(doc(db, collectionName, id));
}

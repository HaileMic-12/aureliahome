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
  writeBatch,
} from "firebase/firestore";
import { db, requireFirebase } from "../firebase";

const clean = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value.map(clean);
  }
  if (value !== null && typeof value === "object") {
    // Preserve Firestore timestamps and Dates without converting them into generic objects
    if (
      value instanceof Date ||
      value.constructor?.name === "FieldValue" ||
      value.constructor?.name === "Timestamp" ||
      "_methodName" in value
    ) {
      return value;
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clean(item)])
    );
  }
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

export async function createTrackableRecord(
  collectionName,
  payload,
  tracking
) {
  requireFirebase();
  if (!tracking?.reference) {
    throw new Error("A tracking reference is required.");
  }

  const batch = writeBatch(db);
  const privateRef = doc(collection(db, collectionName));

  batch.set(privateRef, {
    ...clean(payload),
    reference: tracking.reference,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const publicRef = doc(db, "publicTracking", tracking.reference);

  batch.set(publicRef, {
    reference: tracking.reference,
    type: tracking.type,
    status: payload.status || "pending",
    title: tracking.title || "Hotel Request",
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return privateRef.id;
}

export async function getRecords(collectionName) {
  requireFirebase();
  const snapshot = await getDocs(
    query(collection(db, collectionName), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function updateRecord(collectionName, id, values) {
  requireFirebase();
  return updateDoc(doc(db, collectionName, id), {
    ...clean(values),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePublicTracking(reference, values) {
  requireFirebase();
  return updateDoc(doc(db, "publicTracking", reference), {
    ...clean(values),
    updatedAt: serverTimestamp(),
  });
}

export async function removeRecord(collectionName, id) {
  requireFirebase();
  return deleteDoc(doc(db, collectionName, id));
}

export async function removePublicTracking(reference) {
  requireFirebase();
  return deleteDoc(doc(db, "publicTracking", reference));
}
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const eventsRef = collection(db, 'events');

// CREATE - shton event te ri
export const addEvent = async (eventData) => {
  return await addDoc(eventsRef, {
    ...eventData,
    createdAt: serverTimestamp(),
  });
};

// READ - merr te gjitha eventet
export const getEvents = async () => {
  const q = query(eventsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// UPDATE - perditeson nje event ekzistues
export const updateEvent = async (eventId, updatedData) => {
  const eventDoc = doc(db, 'events', eventId);
  return await updateDoc(eventDoc, updatedData);
};

// DELETE - fshin nje event
export const deleteEvent = async (eventId) => {
  const eventDoc = doc(db, 'events', eventId);
  return await deleteDoc(eventDoc);
};

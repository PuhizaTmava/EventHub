import { db } from '../firebase/config';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

const favId = (userId, eventId) => `${userId}_${eventId}`;

export const addFavorite = async (userId, eventId) => {
  await setDoc(doc(db, 'favorites', favId(userId, eventId)), {
    userId,
    eventId,
    createdAt: new Date(),
  });
};

export const removeFavorite = async (userId, eventId) => {
  await deleteDoc(doc(db, 'favorites', favId(userId, eventId)));
};

// Kthen listen e ID-ve te eventeve qe i ka favorite ky user
export const getFavoriteEventIds = async (userId) => {
  const q = query(collection(db, 'favorites'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().eventId);
};

import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

function generateTicketCode() {
  return 'TCK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const purchaseTicket = async (userId, event) => {
  const ticketData = {
    userId,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.eventDate || null,
    ticketCode: generateTicketCode(),
    purchasedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'tickets'), ticketData);
  return { id: docRef.id, ...ticketData };
};

export const getUserTickets = async (userId) => {
  const q = query(collection(db, 'tickets'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const tickets = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  tickets.sort((a, b) => (b.purchasedAt?.seconds || 0) - (a.purchasedAt?.seconds || 0));
  return tickets;
};

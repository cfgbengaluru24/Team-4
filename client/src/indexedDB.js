// src/utils/indexedDB.js
import { openDB } from 'idb';

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('messages')) {
      db.createObjectStore('messages', { keyPath: 'chatId' });
    }
  },
});

export const saveMessages = async (chatId, messages) => {
  const db = await dbPromise;
  await db.put('messages', { chatId, messages });
};

export const getMessages = async (chatId) => {
  const db = await dbPromise;
  return (await db.get('messages', chatId))?.messages;
};

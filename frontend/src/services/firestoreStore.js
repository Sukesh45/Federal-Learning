import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { INITIAL_HOSPITALS } from '../utils/constants.js';
import {
  getInitialDemoThreats,
  getInitialDemoAlerts,
  getInitialDemoExperiments,
  getInitialDemoRounds,
  getInitialAuditLogs,
  getInitialDemoDatasets
} from '../utils/demoData.js';

// Reactive local store event emitter
class LocalStoreEmitter extends EventTarget {}
const emitter = new LocalStoreEmitter();

const STORAGE_PREFIX = 'healthshield_';

// In-memory cache synced with localStorage
const localCache = {
  hospitals: [],
  threats: [],
  alerts: [],
  experiments: [],
  federatedRounds: [],
  auditLogs: [],
  datasets: [],
  users: []
};

// Initialize local cache from localStorage or seed
function initCache() {
  const collections = Object.keys(localCache);
  let needsSeed = false;

  collections.forEach(col => {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${col}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localCache[col] = parsed;
        } else {
          localCache[col] = getDefaultCollectionData(col);
          needsSeed = true;
        }
      } catch (e) {
        localCache[col] = getDefaultCollectionData(col);
        needsSeed = true;
      }
    } else {
      localCache[col] = getDefaultCollectionData(col);
      needsSeed = true;
    }
  });

  if (needsSeed || !localCache.hospitals || localCache.hospitals.length === 0) {
    seedLocalData();
  }
}

function getDefaultCollectionData(colName) {
  switch (colName) {
    case 'hospitals': return [...INITIAL_HOSPITALS];
    case 'threats': return getInitialDemoThreats();
    case 'alerts': return getInitialDemoAlerts();
    case 'experiments': return getInitialDemoExperiments();
    case 'federatedRounds': return getInitialDemoRounds();
    case 'auditLogs': return getInitialAuditLogs();
    case 'datasets': return getInitialDemoDatasets();
    default: return [];
  }
}

function saveCollectionToLocal(colName) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${colName}`, JSON.stringify(localCache[colName]));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
  // Dispatch reactive update
  emitter.dispatchEvent(new CustomEvent(`update:${colName}`, { detail: localCache[colName] }));
  emitter.dispatchEvent(new CustomEvent('update:all'));
}

export function seedLocalData() {
  localCache.hospitals = [...INITIAL_HOSPITALS];
  localCache.threats = getInitialDemoThreats();
  localCache.alerts = getInitialDemoAlerts();
  localCache.experiments = getInitialDemoExperiments();
  localCache.federatedRounds = getInitialDemoRounds();
  localCache.auditLogs = getInitialAuditLogs();
  localCache.datasets = getInitialDemoDatasets();

  Object.keys(localCache).forEach(col => {
    saveCollectionToLocal(col);
  });
  console.log('🌱 [HealthShield Store] Demo data initialized in reactive store.');
}

// Run init on module load
initCache();

/**
 * Subscribe to real-time collection updates
 * @param {string} colName - collection name ('threats', 'alerts', 'hospitals', etc.)
 * @param {function} callback - callback receiving array of documents
 * @returns {function} unsubscribe function
 */
export function subscribeCollection(colName, callback) {
  // Always trigger callback immediately with existing cache so UI renders instantly
  const fallbackData = (localCache[colName] && localCache[colName].length > 0)
    ? localCache[colName]
    : getDefaultCollectionData(colName);

  try {
    callback(fallbackData);
  } catch (err) {
    console.warn('Initial callback invoke error:', err);
  }

  // Fallback / Demo reactive listener handler
  const handler = (e) => {
    try {
      const data = (e.detail && e.detail.length > 0) ? e.detail : fallbackData;
      callback(data);
    } catch (err) {
      console.warn('Emitter callback error:', err);
    }
  };

  emitter.addEventListener(`update:${colName}`, handler);

  let firestoreUnsub = null;

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, colName));
      firestoreUnsub = onSnapshot(
        q,
        snapshot => {
          if (snapshot && !snapshot.empty && snapshot.docs.length > 0) {
            const items = snapshot.docs.map(docSnap => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            localCache[colName] = items;
            callback(items);
          } else {
            // Fresh / empty Firestore collection: keep fallback data active
            callback(fallbackData);
          }
        },
        error => {
          console.warn(`Firestore listener on ${colName} notice (${error.message}). Running on local reactive store.`);
          callback(fallbackData);
        }
      );
    } catch (err) {
      console.warn('Firestore subscription fallback:', err.message);
    }
  }

  // Always return a guaranteed safe unsubscribe function
  return () => {
    try {
      emitter.removeEventListener(`update:${colName}`, handler);
      if (typeof firestoreUnsub === 'function') {
        firestoreUnsub();
      }
    } catch (e) {}
  };
}

/**
 * Add a new item to a collection
 */
export async function addItem(colName, data) {
  const id = data.id || `${colName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const itemWithMeta = {
    ...data,
    id,
    createdAt: data.createdAt || new Date().toISOString(),
    timestamp: data.timestamp || new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, colName), {
        ...itemWithMeta,
        createdAt: serverTimestamp()
      });
      itemWithMeta.id = docRef.id;
    } catch (err) {
      console.warn(`Firestore addDoc notice on ${colName}:`, err.message);
    }
  }

  // Local store save
  if (!localCache[colName]) localCache[colName] = [];
  localCache[colName] = [itemWithMeta, ...localCache[colName]];
  saveCollectionToLocal(colName);
  return itemWithMeta;
}

/**
 * Update an existing item
 */
export async function updateItem(colName, id, updates) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, colName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn(`Firestore updateDoc notice on ${colName}/${id}:`, err.message);
    }
  }

  if (localCache[colName]) {
    localCache[colName] = localCache[colName].map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    saveCollectionToLocal(colName);
  }
}

/**
 * Delete an item
 */
export async function deleteItem(colName, id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, colName, id));
    } catch (err) {
      console.warn(`Firestore deleteDoc notice on ${colName}/${id}:`, err.message);
    }
  }

  if (localCache[colName]) {
    localCache[colName] = localCache[colName].filter(item => item.id !== id);
    saveCollectionToLocal(colName);
  }
}

/**
 * Get all items from a collection (snapshot / one-time)
 */
export async function getCollectionItems(colName) {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, colName));
      if (!snapshot.empty && snapshot.docs.length > 0) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn(`Firestore getDocs notice for ${colName}:`, err.message);
    }
  }
  return localCache[colName] && localCache[colName].length > 0
    ? localCache[colName]
    : getDefaultCollectionData(colName);
}

/**
 * Reset and seed demo database
 */
export async function resetDatabase() {
  seedLocalData();
  return true;
}

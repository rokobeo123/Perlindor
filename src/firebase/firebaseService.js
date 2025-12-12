import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import firebaseConfig from './config'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

// Collections
const COLLECTIONS = {
  SITE_SETTINGS: 'siteSettings',
  MEMBERS: 'members',
  ACHIEVEMENTS: 'achievements',
  GALLERY: 'gallery',
  VIDEOS: 'videos',
  BEST_MOMENTS: 'bestMoments',
  GUESTBOOK: 'guestbook',
  MOMENTS_WALL: 'momentsWall'
}

// Site Settings
export const getSiteSettings = async () => {
  const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'settings')
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : null
}

export const updateSiteSettings = async (data) => {
  const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'settings')
  await setDoc(docRef, data, { merge: true })
}

// Generic CRUD operations
export const getCollection = async (collectionName) => {
  const querySnapshot = await getDoc(doc(db, collectionName, 'data'))
  const data = querySnapshot.exists() ? querySnapshot.data() : { items: [] }
  return data.items || []
}

export const addToCollection = async (collectionName, item) => {
  const docRef = doc(db, collectionName, 'data')
  const currentData = await getDoc(docRef)
  const items = currentData.exists() ? currentData.data().items || [] : []
  
  const newItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  
  await setDoc(docRef, { items: [...items, newItem] }, { merge: true })
  return newItem
}

export const updateInCollection = async (collectionName, id, updates) => {
  const docRef = doc(db, collectionName, 'data')
  const currentData = await getDoc(docRef)
  const items = currentData.exists() ? currentData.data().items || [] : []
  
  const updatedItems = items.map(item => 
    item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
  )
  
  await setDoc(docRef, { items: updatedItems }, { merge: true })
}

export const deleteFromCollection = async (collectionName, id) => {
  const docRef = doc(db, collectionName, 'data')
  const currentData = await getDoc(docRef)
  const items = currentData.exists() ? currentData.data().items || [] : []
  
  const filteredItems = items.filter(item => item.id !== id)
  await setDoc(docRef, { items: filteredItems }, { merge: true })
}

// Realtime listener
export const onCollectionUpdate = (collectionName, callback) => {
  const docRef = doc(db, collectionName, 'data')
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      callback(data.items || [])
    } else {
      callback([])
    }
  })
}

// Image Upload
export const uploadImage = async (file, folder = 'uploads') => {
  try {
    // Create storage reference
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return {
      url: downloadURL,
      fileName: file.name,
      size: file.size,
      contentType: file.type
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

// Listen to site settings changes
export const onSiteSettingsUpdate = (callback) => {
  const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'settings')
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data())
    }
  })
}

export { COLLECTIONS, db, storage }

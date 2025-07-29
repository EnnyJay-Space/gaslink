// plugins/firebase.client.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { defineNuxtPlugin } from '#app'

const firebaseConfig = {
    apiKey: "AIzaSyDiRELM8RFLk4P7-87LBV-mIA_828SuazM",
    authDomain: "stafftimebook.firebaseapp.com",
    projectId: "stafftimebook",
    storageBucket: "stafftimebook.firebasestorage.app",
    messagingSenderId: "313053147093",
    appId: "1:313053147093:web:70ddba6fe6d63e7305975c"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('auth', auth)
  nuxtApp.provide('db', db)
})

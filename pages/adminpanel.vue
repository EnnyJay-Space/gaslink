<template>
  <div class="p-8 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Create Staff Account</h1>
    <form @submit.prevent="createStaff">
      <div class="mb-4">
        <label class="block mb-1">Full Name</label>
        <input v-model="name" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Email</label>
        <input v-model="email" type="email" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Password</label>
        <input v-model="password" type="password" class="w-full border p-2 rounded" required />
      </div>

      <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Account</button>

      <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const name = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const error = ref('')

const { $auth, $db } = useNuxtApp()

const createStaff = async () => {
  error.value = ''
  message.value = ''

  try {
    const userCred = await createUserWithEmailAndPassword($auth, email.value, password.value)
    const uid = userCred.user.uid

    // Save staff profile in Firestore
    await setDoc(doc($db, 'staff', uid), {
      name: name.value,
      email: email.value,
      role: 'staff',
      createdAt: new Date(),
    })

    message.value = `Staff account for ${name.value} created!`
    name.value = email.value = password.value = ''
  } catch (err) {
    console.error(err)
    error.value = 'Error creating account: ' + err.message
  }
}
</script>

<template>
    <div class="flex justify-center items-center h-screen bg-[url(/auth-bg.jpg)] bg-cover bg-left lg:bg-center">
        <div class="bg-white rounded-[8px] shadow-xl w-[90%] max-w-[360px]">
            <div class="bg-blue-700 p-4 rounded-t-[8px]">
                <img src="/logo.webp" class="w-[70%] mx-auto" alt="">
            </div>
            <div class="p-8">
                <h2 class=" font-bold mb-6 text-center">Staff Time Book Login</h2>
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label class="block mb-1">Email</label>
                        <input v-model="email" type="email" class="w-full border px-4 py-2 rounded-md" placeholder="your official email address" required />
                    </div>
                    <div class="mb-4">
                        <label class="block mb-1">Password</label>
                        <input v-model="password" type="password" class="w-full border px-4 py-2 rounded-md" required />
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Login
                    </button>
                    <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')

const { $auth } = useNuxtApp()

const handleLogin = async () => {
    try {
        error.value = ''
        await signInWithEmailAndPassword($auth, email.value, password.value)
        navigateTo('/dashboard') // or wherever you want
    } catch (err) {
        error.value = 'Login failed. Please check your credentials.'
        console.error(err)
    }
}
</script>
<style scoped></style>
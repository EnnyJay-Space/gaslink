<template>
    <div
        class="hero hero-bg h-[100vh] fixed md:h-[60vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-1">
        <div class="container w-full max-w-screen-lg">
            <div class="hero-content flex flex-col lg:items-end p-0">
                <div class="card bg-base-100 w-full max-w-md md:max-w-lg lg:max-w-[40%] shadow-2xl lg:p-4">
                    <form class="card-body pb-3 space-y-2" @submit.prevent="signUp">
                        <h2 class="text-xl font-medium mb-4">Welcome Back!</h2>
                        <input v-model="email" type="email" placeholder="Email"
                            class="w-full input input-bordered border-muted mt-4 rounded" />
                        <input v-model="password" type="password" placeholder="Password"
                            class="w-full input input-bordered border-muted mt-4 rounded" />
                        <label class="label">
                            <NuxtLink to="/forget-password" class="label-text-alt link link-hover">Forgot password?</NuxtLink>
                        </label>
                        <button
                            class="w-full btn btn-primary font-normal text-base border-1 rounded mt-4" :disabled="loading">
                            <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span v-if="!loading">Log In</span>
                                <span v-else>Processing...</span></button>
                        <p class="my-4 text-sm">Don't have an account? <NuxtLink to="/signup"
                                class="text-primary font-medium">
                                Sign Up
                            </NuxtLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const password = ref('');
const email = ref('');
const loading = ref(false);
const router = useRouter();

const signUp = async () => {
    if (!email.value.trim() || !password.value.trim()) {
        alert("Please fill in all fields.");
        return;
    }

    loading.value = true;
    try {
        // Simulate API request (Replace with actual API call)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        loading.value = false;

        // Redirect to dashboard after signup
        router.push("/dashboard");  
    } catch (error) {
        loading.value = false;
        console.error(error);
    }
};
</script>

<style scoped>
.hero-bg {
    background-image: linear-gradient(90deg, #00000085 0%, #000000d0 50%), url('../assets/images/hero-bg.webp');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    font-family: 'Poppins', sans-serif;
}

.border-muted {
    border-color: #bbb !important;
}
</style>

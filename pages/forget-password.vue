<template>
    <div
        class="hero hero-bg h-[100vh] fixed md:h-[60vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-1">
        <div class="container w-full max-w-screen-lg">
            <div class="hero-content flex flex-col lg:items-end p-0">
                <div class="card bg-base-100 w-full max-w-md md:max-w-lg lg:max-w-[40%] shadow-2xl lg:p-4">
                    <form class="card-body pb-3 space-y-2" @submit.prevent="signUp">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-xl font-semibold">Forgot Password</span>
                            </label>
                            <p>Enter your registered email, and we’ll send instructions to reset your password.</p>

                            <input v-model="email" type="email" placeholder="Email your emall"
                                class="input input-bordered border-muted mt-4 rounded" />
                        </div>

                        <div class="form-control mt-6">
                            <button
                            class="w-full btn btn-primary font-normal text-base border-1 rounded mt-4" :disabled="loading">
                            <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span v-if="!loading">Continue</span>
                                <span v-else>Processing...</span>
                        </button>
                        <p class="text-center mt-4">Already have an account? <NuxtLink to="/login"
                                class="text-primary font-medium">Sign in</NuxtLink>
                        </p>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref('');
const loading = ref(false);

const signUp = async () => {
    if (!email.value.trim()) {
        alert("Please fill in all fields.");
        return;
    }

    loading.value = true;

    // Simulate API request
    setTimeout(() => {
        loading.value = false;
        alert("Signup successful!");
    }, 2000);
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


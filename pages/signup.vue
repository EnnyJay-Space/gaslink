
<template>
    <div
        class="hero hero-bg h-[100vh] fixed md:h-[60vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-1">
        <div class="container w-full max-w-screen-lg">
            <div class="hero-content flex flex-col lg:items-end p-0">
                <div class="card bg-base-100 w-full max-w-md md:max-w-lg lg:max-w-[40%] shadow-2xl lg:p-4">
                    <form class="card-body pb-0 space-y-2" @submit.prevent="signUp">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-lg md:text-xl font-semibold text-center">Enter your Details
                                    to Sign Up</span>
                            </label>
                            <!-- <vue-tel-input class="input input-bordered rounded-full w-full" v-model="phone" -->
                                <!-- mode="international" /> -->
                            <input v-model="phone" type="tel" placeholder="Enter your phone number"
                                class="input input-bordered border-muted mt-4 rounded w-full" />
                            <input v-model="email" type="email" placeholder="Enter your email"
                                class="input input-bordered border-muted mt-4 rounded w-full" />
                        </div>

                        <div class="form-control mt-4">
                            <button class="btn btn-primary font-normal text-base border rounded-full w-full flex items-center justify-center"
                                :disabled="loading">
                                <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span v-if="!loading">Sign up</span>
                                <span v-else>Processing...</span>
                            </button>
                        </div>
                        <label class="label text-center">
                            <NuxtLink to="/forget-password" class="label-text-alt link link-hover text-sm">
                                Forgot password?
                            </NuxtLink>
                        </label>
                    </form>

                    <div class="card-body">
                        <div class="divider">OR</div>
                        <button
                            class="btn google-btn font-normal text-base rounded-full bg-transparent border border-muted w-full flex items-center justify-center">
                            <img src="../assets/icons/google.png" class="h-6 w-6 mr-2" alt="Google Icon" />
                            Sign in using Google
                        </button>
                        <p class="text-center mt-4 text-sm">
                            Already have an account?
                            <NuxtLink to="/login" class="text-primary font-medium">Sign in</NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const phone = ref('');
const email = ref('');
const loading = ref(false);
const router = useRouter();

const signUp = async () => {
    if (!email.value.trim() || !phone.value.trim()) {
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

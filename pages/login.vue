<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const login = async () => {
    console.log("Login with", email.value, password.value);
};
</script>

<template>
    <div class="hero bg-base-200 min-h-screen poppins-font">
        <div class="hero-content container flex-col md:flex-row">
            <div class="text-center lg:text-left">
                <img src="../assets/images/gaslink-logo.png" class="w-60" alt="">
                <p class="py-6">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
            </div>
            <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <form class="w-106 p-10 bg-white shadow-lg rounded-lg">
                    <h2 class="text-xl font-medium mb-4">Welcome Back!</h2>
                    <input v-model="email" type="email" placeholder="Email"
                        class="w-full input input-bordered border-muted mt-4 rounded" />
                    <input v-model="password" type="password" placeholder="Password"
                        class="w-full input input-bordered border-muted mt-4 rounded" />
                    <label class="label">
                        <NuxtLink href="#" class="label-text-alt link link-hover">Forgot password?</NuxtLink>
                    </label>
                    <button 
                        class="w-full btn btn-primary font-normal text-base border-1 rounded mt-4">Login</button>
                    <p class="mt-4 text-sm">Don't have an account? <NuxtLink to="/" class="text-primary font-medium">
                            Sign Up
                        </NuxtLink>
                    </p>
                </form>
                
            </div>
        </div>
    </div>
    
</template>
<style scoped>
.poppins-font {
    font-family: 'Poppins', sans-serif;
}

.border-muted {
    border-color: #bbb !important;
}
.container {
    width: 60%;
}
</style>

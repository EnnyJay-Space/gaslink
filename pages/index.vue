<script setup lang="ts">

const phone = ref('')
const email = ref('')
</script>


<template>
    <div class="hero hero-bg bg-base-200 min-h-screen">
        <div class="container">
            <div class="hero-content flex-col lg:flex-row">
                <div class="card bg-base-100 w-full shrink-0 shadow-2xl">
                    <form class="card-body pb-0">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-xl font-semibold">Enter your Details to Sign Up</span>
                            </label>
                            <vue-tel-input class="input input-bordered rounded-full" v-model="phone"
                                mode="international" />

                            <input v-model="email" type="email" placeholder="Email your emall"
                                class="input input-bordered border-muted mt-4 rounded" />
                        </div>

                        <div class="form-control mt-6">
                            <button class="btn btn-primary font-normal text-base border-1 rounded-full">Sign in</button>
                        </div>

                    </form>

                    <div class="card-body">
                        <div class="divider">OR</div>
                        <button
                            class="btn google-btn font-normal text-base rounded-full bg-transparent border-1 border-muted">
                            <img src="../assets/icons/google.png" class="h-6 w-6 " alt="">
                            Sign in using Google
                        </button>
                        <p class="text-center mt-4">Already have an account? <NuxtLink to="/login"  class="text-primary font-medium">Sign in</NuxtLink></p>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.hero-bg {
    background-image: linear-gradient(90deg, #00000085 0%, #000000d0 50%), url('../assets/images/hero-bg.webp');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    font-family: 'Poppins', sans-serif;
}

.container {
    width: 70%;
}

.hero-content {
    width: 40%;
    margin-left: auto;
}

.border-muted {
    border-color: #bbb !important;
}
</style>
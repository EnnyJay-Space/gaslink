<template>
    <div>
        <!-- Navbar -->
        <div class="navbar bg-[#340846] text-white shadow-sm">
            <div class="container w-full lg:w-[85%] mx-auto">
                <div class="flex-1">
                    <a class="btn btn-ghost  text-xl">daisyUI</a>
                </div>
                <div class="hidden lg:flex lg:flex-none">
                    <ul class="menu menu-horizontal px-1">
                        <li><a>Home</a></li>
                        <li><a>About Us</a></li>
                        <li><a>Features</a></li>
                        <li><a>Support</a></li>
                        <li>
                            <details>
                                <summary>Register</summary>
                                <ul class="bg-[#000000] rounded-t-none w-[210px] p-2">
                                    <li>
                                        <NuxtLink to="/signup">Become a gas vendor</NuxtLink>
                                        <p class="mt-[-15px] text-xs text-blue-100">Reach more customers and
                                            increase earnings</p>

                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
                <div class="drawer lg:hidden block lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
                    <div class="drawer-content flex flex-col items-end justify-end">
                        <!-- Page content here -->
                        <label for="my-drawer-2" class=" drawer-button lg:hidden">
                            <span class="mdi mdi-menu text-[30px]"></span>
                        </label>
                    </div>
                    <div class="drawer-side z-40">
                        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
                        <ul class="menu bg-base-200 text-base-content min-h-full w-64 p-4">
                            <li><a>Home</a></li>
                            <li><a>About Us</a></li>
                            <li><a>Features</a></li>
                            <li><a>Support</a></li>
                            <li>
                                <details>
                                    <summary>Register</summary>
                                    <ul class="rounded-t-none w-full p-2">
                                        <li>
                                            <NuxtLink to="/signup">Become a gas vendor</NuxtLink>
                                            <p class="mt-[-15px] text-xs text-gray-500">Reach more customers and
                                                increase earnings</p>

                                        </li>
                                    </ul>
                                </details>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>

        </div>

        <!-- Hero Section -->
        <div class="hero bg-base-300 min-h-[90vh]">
            <div class="hero-content w-full lg:w-[85%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                <img src="../assets/images/gas_delivery_app_banner.svg" class="w-[100%] block lg:hidden" />
                <div class="text-center lg:text-left">
                    <h1 class="text-2xl text-center lg:text-left lg:text-4xl font-bold">Cooking gas order made easy!</h1>
                    <p class="py-6 text-center lg:text-left">Gas Delivery brings gas to you, helping you save money and time, with assurance.
                        With our on-demand feature, there will be no more stops at the gas station. </p>
                    <NuxtLink to="/signup" class="btn bg-[#655DC6] hover:bg-[#340846] text-white px-10 font-normal ">
                        Get Started</NuxtLink>
                </div>
                <img src="../assets/images/gas_delivery_app_banner.svg" class="w-[100%] hidden lg:block" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'


</script>

<style scoped>
.hero-bg {
    background-color: #f2f7fc;
}
</style>
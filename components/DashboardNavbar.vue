<template>
  <header
    class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md h-16 flex items-center justify-between px-4 md:ml-64"
  >
    <div class="flex items-center gap-3">
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="md:hidden text-gray-500 dark:text-gray-300"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <h2 class="text-lg font-semibold">Dashboard</h2>
    </div>
    <div class="flex items-center gap-4">
      <!-- Right-side controls (profile, notifications, etc.) -->
      <span class="hidden sm:inline">Admin</span>
      <img
        src="https://i.pravatar.cc/40"
        alt="avatar"
        class="w-8 h-8 rounded-full"
      />
    </div>

    <!-- Mobile Sidebar Drawer -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
        @click="sidebarOpen = false"
      >
        <aside
          class="w-64 bg-gray-900 text-white h-full p-4"
          @click.stop
        >
          <h1 class="text-xl mb-4">Admin Panel</h1>
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.to"
              class="block px-4 py-2 rounded hover:bg-gray-800"
              active-class="bg-gray-800"
              @click="sidebarOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </aside>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const sidebarOpen = ref(false)

const navItems = [
  { name: 'Dashboard', to: '/admindash' },
//   { name: 'Staff', to: '/admindash/staff' },
//   { name: 'Reports', to: '/admindash/reports' },
//   { name: 'Settings', to: '/admindash/settings' },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

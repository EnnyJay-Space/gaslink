<template>
  <aside
    class="hidden md:flex md:w-64 md:flex-col bg-gray-900 text-white h-screen fixed top-0 left-0 z-40"
  >
    <div class="flex items-center justify-center h-16 border-b border-gray-700">
      <h1 class="text-lg font-semibold">Admin Panel</h1>
    </div>
    <nav class="flex-1 px-4 py-4 space-y-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="block px-4 py-2 rounded hover:bg-gray-800"
        active-class="bg-gray-800"
      >
        {{ item.name }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const navItems = [
  { name: 'Dashboard', to: '/admindash' },
  { name: 'User Management', to: '/admindash/user-management' },
  { name: 'Attendance', to: '/admindash/attendance' },
//   { name: 'Settings', to: '/admindash/settings' },
]
</script>

<template>
  <div>
    <DashboardSidebar />
    <DashboardNavbar />

    <div class="md:ml-64">
      <main class="p-6 space-y-8">

        <!-- ✅ Overview Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
            <div class="p-3 bg-blue-100 text-blue-600 rounded-full">
              <i class="fas fa-users"></i>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-500">Total Staff</h2>
              <p class="text-3xl font-bold">{{ totalStaff }}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
            <div class="p-3 bg-green-100 text-green-600 rounded-full">
              <i class="fas fa-user-check"></i>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-500">Clocked In Today</h2>
              <p class="text-3xl font-bold">{{ clockedInToday }}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
            <div class="p-3 bg-yellow-100 text-yellow-600 rounded-full">
              <i class="fas fa-clock"></i>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-500">Total Hours Today</h2>
              <p class="text-3xl font-bold">{{ totalHoursToday }} hrs</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
            <div class="p-3 bg-purple-100 text-purple-600 rounded-full">
              <i class="fas fa-calendar-week"></i>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-500">Hours This Week</h2>
              <p class="text-3xl font-bold">{{ totalHoursWeek }} hrs</p>
            </div>
          </div>
        </div>

        <!-- ✅ Recent Activity Section -->
        <div class="bg-white rounded-lg shadow">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="font-semibold text-gray-700">Recent Activity</h3>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Filter</button>
              <button class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Sort By</button>
              <button @click="handleExportCSV" class="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                Export CSV
              </button>
              <button @click="handleExportPDF" class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200">
                Export PDF
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Employee</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Log Hours</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>

              <tbody v-if="!loading && !error" class="bg-white divide-y divide-gray-200">
                <tr v-for="record in timebookRecords" :key="record.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ record.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(record.clockIn) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(record.clockOut) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ calcHours(record.clockIn, record.clockOut) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="statusClass(record.status)">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Loading & Error -->
            <div v-if="loading" class="p-4 text-center">
              <span class="loading loading-spinner loading-md"></span>
            </div>
            <div v-else-if="error" class="p-4 text-center text-red-500">
              {{ error }}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import DashboardSidebar from '~/components/DashboardSidebar.vue'
import DashboardNavbar from '~/components/DashboardNavbar.vue'
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { collection, getDocs, query, where, Timestamp, orderBy, limit } from 'firebase/firestore'
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { exportToCSV, exportToPDF } from '@/utils/export.js'

const { $db } = useNuxtApp()

const loading = ref(true)
const error = ref('')
const timebookRecords = ref([])

const totalStaff = ref(0)
const clockedInToday = ref(0)
const totalHoursToday = ref(0)
const totalHoursWeek = ref(0)

function formatTime(ts) {
  if (!ts?.toDate) return '-'
  return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function calcHours(clockIn, clockOut) {
  if (!clockIn?.toDate || !clockOut?.toDate) return '-'
  const diff = (clockOut.toDate() - clockIn.toDate()) / (1000 * 60 * 60)
  return diff.toFixed(2) + ' hrs'
}

function statusClass(status) {
  switch (status) {
    case 'Present':
    case 'Clocked In':
      return 'px-2 py-1 text-xs rounded bg-green-100 text-green-700'
    case 'Absent':
      return 'px-2 py-1 text-xs rounded bg-red-100 text-red-700'
    default:
      return 'px-2 py-1 text-xs rounded bg-gray-100 text-gray-700'
  }
}

function handleExportCSV() {
  exportToCSV(timebookRecords.value, 'timebook.csv')
}

function handleExportPDF() {
  exportToPDF(timebookRecords.value, ['name', 'status', 'clockIn', 'clockOut'], 'timebook.pdf')
}

const fetchDashboardData = async () => {
  try {
    loading.value = true
    const staffSnap = await getDocs(collection($db, 'users'))
    totalStaff.value = staffSnap.size

    const now = new Date()
    const todayStart = Timestamp.fromDate(startOfDay(now))
    const todayEnd = Timestamp.fromDate(endOfDay(now))

    const todayQuery = query(
      collection($db, 'timebooks'),
      where('clockIn', '>=', todayStart),
      where('clockIn', '<=', todayEnd)
    )
    const todaySnap = await getDocs(todayQuery)
    clockedInToday.value = todaySnap.size

    let todayTotal = 0
    todaySnap.forEach(doc => {
      const { clockIn, clockOut } = doc.data()
      if (clockIn && clockOut) {
        todayTotal += (clockOut.toDate() - clockIn.toDate()) / (1000 * 60 * 60)
      }
    })
    totalHoursToday.value = todayTotal.toFixed(1)

    const weekStart = Timestamp.fromDate(startOfWeek(now))
    const weekEnd = Timestamp.fromDate(endOfWeek(now))
    const weekSnap = await getDocs(
      query(collection($db, 'timebooks'), where('clockIn', '>=', weekStart), where('clockIn', '<=', weekEnd))
    )
    let weekTotal = 0
    weekSnap.forEach(doc => {
      const { clockIn, clockOut } = doc.data()
      if (clockIn && clockOut) {
        weekTotal += (clockOut.toDate() - clockIn.toDate()) / (1000 * 60 * 60)
      }
    })
    totalHoursWeek.value = weekTotal.toFixed(1)

    // Recent Records
    const recentSnap = await getDocs(query(collection($db, 'timebooks'), orderBy('clockIn', 'desc'), limit(7)))
    timebookRecords.value = recentSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardData)
</script>

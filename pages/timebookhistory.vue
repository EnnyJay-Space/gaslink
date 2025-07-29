<template>
  <div class="flex justify-center items-center h-screen bg-[url(/auth-bg.jpg)] bg-cover bg-left bg-no-repeat bg-fixed lg:bg-center">
    <div class="w-[90%] lg:w-[50%] mx-auto bg-white text-center rounded-2xl shadow px-4 py-6 lg:p-10">

      <div class="grid grid-cols-2 md:grid-cols-2 gap-4 mb-10">
        <div class="text-start">
          <h4 class="font-bold text-black text-[16px] lg:text-[18px]">Timebook History</h4>
        </div>
        <div class="text-end">
          <NuxtLink to="/dashboard" class="text-[14px] lg:text-[16px] text-white px-2 py-1 rounded bg-green-600">Dashboard</NuxtLink>
        </div>
      </div>

      <!-- Filter Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <!-- Day Filter -->
        <div class="lg:mb-4 flex justify-center lg:justify-start items-center">
          <label for="day" class="font-medium text-[14px] ">Select Day:</label>
          <input
            id="day"
            type="date"
            v-model="selectedDay"
            class="border px-4 py-1 rounded-md ml-2 text-[14px]"
            @change="onDayChange"
          />
        </div>

        <!-- Month Filter -->
        <div class="mb-4 flex justify-center lg:justify-end items-center">
          <label for="month" class="font-medium text-[14px] ">Select Month:</label>
          <input
            id="month"
            type="month"
            v-model="selectedMonth"
            class="border px-4 py-1 rounded-md ml-2 text-[14px]"
            @change="onMonthChange"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto shadow-lg">
        <table class="table w-full">
          <thead>
            <tr class="bg-base-200">
              <th class="text-black">Date</th>
              <th class="text-black">Clock In</th>
              <th class="text-black">Clock Out</th>
              <th class="text-black">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in filteredRecords" :key="index">
              <td class="text-[14px]">{{ formatDate(record.date) }}</td>
              <td class="text-[14px]">{{ record.clockInTime || '-' }}</td>
              <td class="text-[14px]">{{ record.clockOutTime || '-' }}</td>
              <td class="text-[14px]">{{ record.totalWorkHours || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredRecords.length === 0" class="text-center my-4 text-sm text-gray-500">
          No records found for selected date or month.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { format } from 'date-fns'

const selectedMonth = ref('')
const selectedDay = ref('')
const allRecords = ref([])
const filteredRecords = ref([])

const auth = getAuth()
const { $db } = useNuxtApp()

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadRecords(user.uid)
      filterRecords()
    } else {
      console.warn('User not logged in')
    }
  })
})

const loadRecords = async (uid) => {
  const q = query(collection($db, 'timebooks'), where('userId', '==', uid))
  const snapshot = await getDocs(q)

  allRecords.value = snapshot.docs.map(doc => {
    const data = doc.data()
    const date = data.date?.toDate?.() || new Date(data.date)
    return {
      ...data,
      date: format(date, 'yyyy-MM-dd') // Standard date string
    }
  })
}

const onMonthChange = () => {
  selectedDay.value = '' // Clear day selection
  filterRecords()
}

const onDayChange = () => {
  selectedMonth.value = '' // Clear month selection
  filterRecords()
}

const filterRecords = () => {
  if (selectedDay.value) {
    // Filter by exact day
    filteredRecords.value = allRecords.value.filter(record => record.date === selectedDay.value)
  } else if (selectedMonth.value) {
    // Filter by month
    const [year, month] = selectedMonth.value.split('-')
    filteredRecords.value = allRecords.value.filter(record => {
      const [recordYear, recordMonth] = record.date.split('-')
      return recordYear === year && recordMonth === month
    })
  } else {
    filteredRecords.value = allRecords.value // Show all
  }
}

const formatDate = (dateStr) => {
  try {
    const dateObj = new Date(dateStr)
    return format(dateObj, 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}
</script>

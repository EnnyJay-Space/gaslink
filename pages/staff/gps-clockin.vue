<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ hasClockedIn ? 'GPS Clock-Out' : 'GPS Clock-In' }}
      </h2>

      <p class="text-gray-600">Current Time: <span class="font-semibold">{{ currentTime }}</span></p>

      <p v-if="totalWorkHours !== null" class="text-gray-700">
        Total Work Time Today: <span class="font-bold">{{ totalWorkHours }}</span>
      </p>

      <button
        class="btn btn-primary w-full"
        :disabled="loading"
        @click="handleClock"
      >
        <span v-if="loading" class="loading loading-spinner"></span>
        <span v-else>{{ hasClockedIn ? 'Clock Out with GPS' : 'Clock In with GPS' }}</span>
      </button>

      <p v-if="statusMessage" :class="statusColor">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getAuth } from 'firebase/auth'
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { useRouter, useNuxtApp } from '#imports'

const router = useRouter()
const { $db } = useNuxtApp()

const auth = getAuth()
const user = ref(auth.currentUser)
const loading = ref(false)
const statusMessage = ref('')
const statusColor = ref('')
const currentTime = ref(new Date().toLocaleTimeString())
const hasClockedIn = ref(false)
const totalWorkHours = ref(null)

let intervalId
onMounted(async () => {
  if (!user.value) return router.push('/login')

  intervalId = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)

  await checkClockInStatus()
  await calculateTotalWorkHours()
})
onBeforeUnmount(() => clearInterval(intervalId))

async function checkClockInStatus() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const clockInRef = collection($db, `users/${user.value.uid}/clockins`)
  const q = query(
    clockInRef,
    where('time', '>=', Timestamp.fromDate(todayStart)),
    where('time', '<=', Timestamp.fromDate(todayEnd))
  )

  try {
    const snapshot = await getDocs(q)
    hasClockedIn.value = !snapshot.empty
  } catch (error) {
    console.error('Error checking clock-in status:', error)
  }
}

async function calculateTotalWorkHours() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const uid = user.value?.uid
  if (!uid) return

  const clockInRef = collection($db, `users/${uid}/clockins`)
  const clockOutRef = collection($db, `users/${uid}/clockouts`)

  const clockInQuery = query(
    clockInRef,
    where('time', '>=', Timestamp.fromDate(todayStart)),
    where('time', '<=', Timestamp.fromDate(todayEnd))
  )

  const clockOutQuery = query(
    clockOutRef,
    where('time', '>=', Timestamp.fromDate(todayStart)),
    where('time', '<=', Timestamp.fromDate(todayEnd))
  )

  try {
    const clockInSnapshot = await getDocs(clockInQuery)
    const clockOutSnapshot = await getDocs(clockOutQuery)

    if (!clockInSnapshot.empty && !clockOutSnapshot.empty) {
      const clockInTime = clockInSnapshot.docs[0].data().time?.toDate()
      const clockOutTime = clockOutSnapshot.docs[0].data().time?.toDate()

      if (clockInTime && clockOutTime) {
        const diffMs = clockOutTime - clockInTime
        const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2)
        totalWorkHours.value = `${diffHours} hrs`
      }
    }
  } catch (error) {
    console.error('Error calculating total work hours:', error)
  }
}

async function handleClock() {
  if (!navigator.geolocation) {
    statusMessage.value = 'Geolocation not supported.'
    statusColor.value = 'text-red-600'
    return
  }

  loading.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      const clockData = {
        time: serverTimestamp(),
        method: 'GPS',
        location: { latitude, longitude },
      }

      const mode = hasClockedIn.value ? 'clockouts' : 'clockins'

      try {
        await addDoc(collection($db, `users/${user.value.uid}/${mode}`), clockData)

        hasClockedIn.value = !hasClockedIn.value
        statusMessage.value = `✅ ${hasClockedIn.value ? 'Clock-out' : 'Clock-in'} successful!`
        statusColor.value = 'text-green-600'

        await calculateTotalWorkHours()
      } catch (error) {
        console.error(error)
        statusMessage.value = '❌ Failed to save record.'
        statusColor.value = 'text-red-600'
      } finally {
        loading.value = false
      }
    },
    (error) => {
      console.error('GPS Error:', error)
      statusMessage.value = '❌ Failed to retrieve location.'
      statusColor.value = 'text-red-600'
      loading.value = false
    }
  )
}
</script>

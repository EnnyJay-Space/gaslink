<template>
  <div class="flex justify-center items-center h-screen bg-[url(/auth-bg.jpg)] bg-cover bg-left bg-no-repeat bg-fixed lg:bg-center">
    <div class="w-[60%] mx-auto bg-white text-center rounded-2xl shadow p-6">
      <!-- Navbar -->
      <div class="navbar mb-7 bg-black bg-base-100 shadow-sm rounded-xl">
        <div class="flex-1 justify-left">
          <img src="/ef-logo.png" class="w-[90%] lg:w-[30%]" alt="">
        </div>
        <h4 class="font-bold text-white text-[12px] lg:text-[18px]"> {{ userName }}</h4>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Avatar" class="object-cover rounded-full"
                   src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a>Timebook History</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>

      <!-- Date and Time -->
      <h3 class="text-gray-600 font-bold mb-4 text-[12px] lg:text-[16px]">
        {{ currentDate }} | 🕒 {{ currentTime }}
      </h3>

      <!-- Clock Info -->
      <div class="bg-white w-[100%] mx-auto shadow-md rounded-xl p-4 md:p-4">
        <div class="flex flex-col items-center">
          <h5 class="text-[12px] lg:text-[16px] font-semibold mb-2">Today's Clock Activity</h5>
          <div class="bg-gray-100 p-4 rounded-xl w-full text-center mb-2">
            <p class="text-[12px] lg:text-[16px]">🕒 Total work hours today:
              <span class="font-bold">{{ totalWorkHours }}</span>
            </p>
          </div>
          <div class="flex items-center gap-[100px] mb-3">
            <span class="text-[12px] lg:text-[16px] text-green-600 font-bold">Clocked In</span>
            <span class="text-[12px] lg:text-[16px] text-gray-600">
              {{ clockInTime || '--:--:--' }}
            </span>
          </div>
          <div class="flex items-center gap-[100px]">
            <span class="text-[12px] lg:text-[16px] text-red-600 font-bold">Clocked Out</span>
            <span class="text-[12px] lg:text-[16px] text-gray-600">
              {{ clockOutTime || '--:--:--' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Clock In/Out Buttons -->
      <div class="flex gap-4 justify-center mt-6">
        <button v-if="!isClockedIn"
          class="bg-blue-600 text-[12px] lg:text-[16px] font-semibold hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow"
          @click="handleClockIn">
          Clock in with GPS
        </button>
        <button v-else
          class="bg-red-600 text-[12px] lg:text-[16px] font-semibold hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow"
          @click="handleClockOut">
          Clock out
        </button>
      </div>

      <!-- Placeholder Map -->
      <div class="mt-8">
        <div class="w-full skeleton h-[200px] bg-gray-300 rounded-xl flex items-center justify-center text-gray-600">
          Map Placeholder (Capital Icon)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const { $db } = useNuxtApp()
const auth = getAuth()
const router = useRouter()

// Reactive states
const user = ref(auth.currentUser)
const userName = ref('')
const currentDate = ref(new Date().toDateString())
const currentTime = ref('')
const clockInTime = ref('')
const clockOutTime = ref('')
const totalWorkHours = ref('00:00:00')
const isClockedIn = ref(false)
const userId = ref('')

// Update live time
function updateTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${h}:${m}:${s}`
}

// Load user info and today's clock data
async function loadUserData() {
  try {
    const userDocRef = doc($db, 'users', user.value.uid)
    const userDoc = await getDoc(userDocRef)
    userName.value = userDoc.exists() ? userDoc.data().name : 'User Not Found'
    userId.value = user.value.uid

    const todayKey = new Date().toISOString().split('T')[0]
    const timebookRef = doc($db, 'timebooks', `${userId.value}_${todayKey}`)
    const timebookDoc = await getDoc(timebookRef)

    if (timebookDoc.exists()) {
      const data = timebookDoc.data()
      clockInTime.value = data.clockInTime || ''
      clockOutTime.value = data.clockOutTime || ''
      totalWorkHours.value = data.totalWorkHours || '00:00:00'
      console.log('Timebook data loaded:', data)
      isClockedIn.value = !!data.clockInTime && !data.clockOutTime
    }
  } catch (err) {
    console.error('Error loading user data:', err)
  }
}

// Clock in handler
// Clock in handler
async function handleClockIn() {
  navigator.geolocation.getCurrentPosition(async position => {
    const now = new Date()
    const timeString = now.toTimeString().split(' ')[0] // "HH:MM:SS"
    const todayKey = now.toISOString().split('T')[0]
    const docRef = doc($db, 'timebooks', `${userId.value}_${todayKey}`)

    await setDoc(docRef, {
      userId: userId.value,
      clockInTime: timeString,
      clockOutTime: '',
      totalWorkHours: '',
      date: todayKey,
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })

    clockInTime.value = timeString
    isClockedIn.value = true
  }, err => {
    alert('Location access denied or unavailable.')
    console.error(err)
  })
}


// Clock out handler
// Clock out handler
async function handleClockOut() {
  const now = new Date()
  const timeString = now.toTimeString().split(' ')[0] // "HH:MM:SS"
  const todayKey = now.toISOString().split('T')[0]
  const docRef = doc($db, 'timebooks', `${userId.value}_${todayKey}`)

  const timebookDoc = await getDoc(docRef)
  if (timebookDoc.exists()) {
    const data = timebookDoc.data()
    const clockIn = new Date(`${todayKey}T${data.clockInTime}`)
    const clockOut = now
    const diffMs = clockOut - clockIn

    if (isNaN(diffMs)) {
      console.error('Invalid date difference. Check clockInTime format.')
      return
    }

    const hours = Math.floor(diffMs / 3600000).toString().padStart(2, '0')
    const minutes = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0')
    const seconds = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0')
    const total = `${hours}:${minutes}:${seconds}`

    await updateDoc(docRef, {
      clockOutTime: timeString,
      totalWorkHours: total
    })

    clockOutTime.value = timeString
    totalWorkHours.value = total
    isClockedIn.value = false
  }
}


// Init on mount
onMounted(async () => {
  if (!user.value) {
    router.push('/login')
  } else {
    await loadUserData()
  }

  updateTime()
  setInterval(updateTime, 1000)
})
</script>

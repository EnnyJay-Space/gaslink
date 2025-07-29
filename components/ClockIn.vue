<template>
  <div
    class="flex justify-center items-center h-screen bg-[url(/auth-bg.jpg)] bg-cover bg-left bg-no-repeat bg-fixed lg:bg-center">
    <div class="w-[30%] mx-auto bg-white text-center rounded-2xl shadow p-6">
      <!-- Navbar -->
      <h4 class="font-bold text-black text-[12px] lg:text-[18px]"> Welcome {{ userName }}</h4>


      <div class="bg-[url(/clock-bg.png)] bg-cover bg-center rounded-xl my-6">
        <div class="grid grid-cols-2 gap-4 p-4 pb-0">
          <div class="text-start">
            <h3 class="text-white font-bold mb-4 text-[12px] lg:text-[14px]">
              {{ currentDate }}
            </h3>
          </div>
          <div class="text-end">
            <a class="text-white text-[14px]" href="#">Timebook History</a>
          </div>
        </div>
        <div class="lg:py-6">
          <h3 class="text-white font-bold mb-4 text-[18px] lg:text-[34px]">
            {{ currentTime }}
          </h3>
        </div>
        <div class="p-4 rounded-b-xl bg-[#202B3E]">
          <p class="text-white font-bold text-[12px] lg:text-[16px]">Total work hours today
              <span class="font-bold ms-6">{{ totalWorkHours }}</span>
            </p>
          
        </div>
      </div>


      <!-- Clock Info -->
      <div class="bg-white w-[100%] mx-auto shadow-md rounded-xl p-4 md:p-4">
        <div class="flex flex-col items-center">
          <h5 class="text-[12px] lg:text-[18px] font-bold mb-2">My Day Activity</h5>
          <hr class="border-gray-300 w-[80%] mx-auto mb-3">
          <div class="flex items-center gap-[100px] mb-3">
            <span class="text-[12px] lg:text-[16px] text-green-600 font-bold">Clocked In</span>
            <span class="text-[12px] lg:text-[16px] text-gray-600">
              {{ clockInTime || '--:--:--' }}
            </span>
          </div>
          <hr class="border-gray-300 w-[80%] mx-auto mb-3">
          <div class="flex items-center gap-[100px]">
            <span class="text-[12px] lg:text-[16px] text-red-600 font-bold">Clocked Out</span>
            <span class="text-[12px] lg:text-[16px] text-gray-600">
              {{ clockOutTime || '--:--:--' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Clock In/Out Buttons -->
      <div class="flex gap-4 justify-center my-6">
        <button v-if="!isClockedIn"
          class="bg-green-600 text-[12px] h-[150px] w-[150px] lg:text-[16px] font-semibold hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
          @click="handleClockIn">
          
          <img src="../assets/images/clock-in-out.png" alt="Clock In Icon" class="w-[40%] mb-2 mx-auto">
          Clock In
        </button>
        <button v-else
          class="h-[150px] w-[150px] bg-red-600 text-[12px] lg:text-[16px] font-semibold hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
          @click="handleClockOut">
          <img src="../assets/images/clock-in-out.png" alt="Clock In Icon" class="w-[40%] mb-2 mx-auto">
          Clock out
        </button>
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

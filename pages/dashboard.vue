<template>
  <div
    class="flex justify-center items-center h-screen bg-[url(/auth-bg.jpg)] bg-cover bg-left bg-no-repeat bg-fixed lg:bg-center">
    <div class="w-[90%] lg:w-[30%] mx-auto bg-white text-center rounded-2xl shadow p-6">
      <!-- Navbar -->
      <h4 class="font-bold text-black text-[16px] lg:text-[18px]"> Welcome, {{ userName }}</h4>


      <div class="bg-[url(/clock-bg.png)] bg-cover bg-center rounded-xl mb-6">
        <div class="grid grid-cols-2 gap-4 p-4 pt-8 pb-0">
          <div class="text-start">
            <h3 class="text-white font-bold mb-4 text-[14px] lg:text-[16px]">
              {{ currentDate }}
            </h3>
          </div>
          <div class="text-end">
            <NuxtLink to="/timebookhistory" class="text-[14px] lg:text-[14px] font-semibold text-white">View History</NuxtLink>
          </div>
        </div>
        <div class="py-3 lg:py-6">
          <h3 class="text-white font-bold mb-4 text-[18px] lg:text-[34px]">
            {{ currentTime }}
          </h3>
        </div>
        <div class="p-4 rounded-b-xl bg-[#202B3E]">
          <p class="text-white font-bold text-[14px] lg:text-[16px]">Total work hours today
            <span class="font-bold ms-6">{{ totalWorkHours }}</span>
          </p>

        </div>
      </div>


      <!-- Clock Info -->
      <div class="bg-white w-[100%] mx-auto shadow-md rounded-xl p-4 md:p-4">
        <div class="flex flex-col items-center">
          <h5 class="text-[14px] text-black lg:text-[16px] font-bold mb-2">My Day Activity</h5>
          <hr class="border-gray-300 w-[80%] mx-auto mb-3">
          <div class="flex items-center gap-[100px] mb-3">
            <span class="text-[14px] lg:text-[16px] text-green-600 font-bold">Clocked In</span>
            <span class="text-[14px] lg:text-[16px] text-gray-600">
              {{ clockInTime || '--:--:--' }}
            </span>
          </div>
          <hr class="border-gray-300 w-[80%] mx-auto mb-3">
          <div class="flex items-center gap-[100px]">
            <span class="text-[14px] lg:text-[16px] text-red-600 font-bold">Clocked Out</span>
            <span class="text-[14px] lg:text-[16px] text-gray-600">
              {{ clockOutTime || '--:--:--' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Clock In/Out Buttons -->
      <div class="flex gap-4 justify-center my-6">
        <button v-if="!isClockedIn"
          class="bg-green-600 text-[14px] h-[150px] 6-[150px] lg:text-[16px] font-semibold hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
          @click="handleClockIn">

          <img src="../assets/images/clock-in-out.png" alt="Clock In Icon" class="w-[40%] mb-2 mx-auto">
          Clock In
        </button>
        <button v-else
          class="h-[150px] w-[150px] bg-red-600 text-[14px] lg:text-[16px] font-semibold hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
          @click="handleClockOut">
          <img src="../assets/images/clock-in-out.png" alt="Clock In Icon" class="w-[40%] mb-2 mx-auto">
          Clock out
        </button>
      </div>

      <button @click="logOut" type="button" title="logout"
        class="bg-red-600 text-[14px] lg:text-[16px] hover:bg-red-700 w-full text-white px-4 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.55)]">Log
        Out</button>
      <!-- Open the modal-->
      <dialog id="clockOutModal" class="modal" ref="clockOutModal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Hello {{ userName }}!</h3>
          <p class="py-4">
            Hope you had a nice day! <br />
            See you tomorrow. Bye!
          </p>
          <div class="modal-action justify-center mt-0">
            <button class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white" @click="closeModal">Bye and
              close</button>
          </div>
        </div>
      </dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const auth = getAuth()
const { $db } = useNuxtApp()
const router = useRouter()
const clockOutModal = ref(null)

// Constants 5.026204183192006, 7.908716695235571
const OFFICE_LOCATION = {
  // lat: 5.02624,
  // lng: 7.90899
  lat: 6.6486272,
  lng: 3.2997376
}
const ALLOWED_RADIUS = 500 // in meters

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

// Time updater
function updateTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${h}:${m}:${s}`
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // Earth radius in meters
  const toRad = deg => deg * Math.PI / 180
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // distance in meters
}

// Load user and timebook data
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
      isClockedIn.value = !!data.clockInTime && !data.clockOutTime
    }
  } catch (err) {
    console.error('Error loading user data:', err)
  }
}

// Handle clock-in with GPS validation
async function handleClockIn() {
  navigator.geolocation.getCurrentPosition(async position => {

    const { latitude, longitude } = position.coords
    const distance = calculateDistance(latitude, longitude, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng)
    console.log('Current location:', latitude, longitude)
    console.log('Distance from office:', distance)

    if (distance > ALLOWED_RADIUS) {
      alert('You are not within the office premises. Clock-in denied.')
      return
    }

    const now = new Date()
    const timeString = now.toTimeString().split(' ')[0]
    const todayKey = now.toISOString().split('T')[0]
    const docRef = doc($db, 'timebooks', `${userId.value}_${todayKey}`)

    await setDoc(docRef, {
      userId: userId.value,
      clockInTime: timeString,
      clockOutTime: '',
      totalWorkHours: '',
      date: todayKey,
      location: {
        lat: latitude,
        lng: longitude
      }
    })

    clockInTime.value = timeString
    isClockedIn.value = true
  }, err => {
    alert('Location access denied or unavailable.')
    console.error(err)
  })
}

// Handle clock-out
async function handleClockOut() {
  const now = new Date()
  const timeString = now.toTimeString().split(' ')[0]
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
    clockOutModal.value?.showModal()
  }
}

function logOut() {
  auth.signOut().then(() => {
    router.push('/')
  }).catch(err => {
    console.error('Logout failed:', err)
  })
}

const closeModal = () => {
  clockOutModal.value?.close()
}


// On mount
onMounted(async () => {
  if (!user.value) {
    router.push('/')
  } else {
    await loadUserData()
  }

  updateTime()
  setInterval(updateTime, 1000)
})

</script>

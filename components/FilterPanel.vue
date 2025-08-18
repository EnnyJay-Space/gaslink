<template>
    <div class="flex gap-4 items-center">
        <input type="date" v-model="selectedDate" @change="filterByDate" class="input input-bordered" />
        <select v-model="selectedMonth" @change="filterByMonth" class="select select-bordered">
            <option disabled value="">Select month</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
            </option>
        </select>
    </div>
</template>

<script setup>
const emit = defineEmits(['filter'])

const selectedDate = ref('')
const selectedMonth = ref('')

const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
    // ...add remaining months
]

function filterByDate() {
    emit('filter', { type: 'date', value: selectedDate.value })
}
function filterByMonth() {
    emit('filter', { type: 'month', value: selectedMonth.value })
}
</script>

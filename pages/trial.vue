<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
        
  
        <!-- Step 1: Register -->
        <div v-if="step === 1">
            <div class="grid grid-flow-col gap-4">
              <select v-model="formData.gasType" class="select select-bordered w-full">
                <option disabled selected>Select Gas Type</option>
                <option value="cooking gas">Cooking Gas (LPG)</option>
                <option value="propane">Propane</option>
                <option value="butane">Butane</option>
              </select>

              <select v-model="formData.cylinderSize" class="select select-bordered w-full">
                <option disabled selected>Cylinder Size</option>
                <option value="1kg">1kg</option>
                <option value="2kg">2kg</option>
                <option value="3kg">3kg</option>
                <option value="5kg">5kg</option>
                <option value="6kg">6kg</option>
                <option value="6.5kg">6.5kg</option>
                <option value="10kg">10kg</option>
                <option value="12.5kg">12.5kg</option>
                <option value="15kg">15kg</option>
                <option value="25kg">25kg</option>
                <option value="35kg">35kg</option>
                <option value="50kg">50kg</option>
                <option value="100kg">100kg</option>
              </select>
            </div>
            <div class="my-4">
              <input type="text" v-model="formData.quantity" placeholder="Quantity (e.g ₦3000, 3kg)" class="input input-bordered w-full" />
            </div>
            <div class="my-4">
              <input type="text" v-model="formData.deliveryLocation" placeholder="Delivery Location/address" class="input input-bordered w-full" />
            </div>
            <div class="my-4">
              <vue-tel-input class="input input-bordered rounded-full px-0" v-model="formData.phone" mode="international" />
            </div>
            <div class="my-4">
              <input v-model="formData.email" type="email" placeholder="Your email address" class="input input-bordered w-full" />
            </div>
        </div>
  
        <!-- Step 2: Choose Plan -->
        <div v-if="step === 2">
          <h2 class="text-xl font-semibold">Choose a Payment method</h2>
              <select v-model="formData.paymentMethod" id="paymentMethod" class="select select-bordered w-full">
              <option value="Select a payment method" selected disabled>Select a payment method</option>
              <option value="cash_on _delivery">Cash on Delivery</option>
              <option value="online_payment">Online Payment</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="pos">POS</option>
            </select>
        </div>
  
  
        <!-- Navigation Buttons -->
        <div class="text-right mt-6">
          <button v-if="step > 1" @click="prevStep" class="btn btn-outline">Back</button>
          <button v-if="step < 4" @click="nextStep" class="btn btn-primary">Next</button>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Form data state
  const formData = ref({
    gasType: "",
    cylinderSize: "",
    quantity: "",
    deliveryLocation: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });
  
  // Step state
  const step = ref(1);
  
  // Navigation functions
  const nextStep = () => {
    if (step.value < 2) step.value++;
  };
  
  const prevStep = () => {
    if (step.value > 1) step.value--;
  };
  
  // Submit function
  const submitForm = () => {
    alert("Order Confirmed! ✅");
    console.log("Submitted Data:", formData.value);
  };
  </script>
  
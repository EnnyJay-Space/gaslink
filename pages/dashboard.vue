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
const isLoading = ref(false);
const vendorsDetails = ref(null); // Stores vendor details
const errors = ref({}); // Validation errors

// Validation function
const validateStep = () => {
  errors.value = {}; // Clear errors before validation

  if (step.value === 1) {
    if (!formData.value.gasType) errors.value.gasType = "Gas type is required";
    if (!formData.value.cylinderSize) errors.value.cylinderSize = "Cylinder size is required";
    if (!formData.value.quantity) errors.value.quantity = "Quantity is required";
    if (!formData.value.deliveryLocation) errors.value.deliveryLocation = "Delivery location is required";
    // if (!formData.value.phone) errors.value.phone = "Phone number is required";
    if (!formData.value.email) errors.value.email = "Email is required";
  } else if (step.value === 2) {
    if (!formData.value.paymentMethod) errors.value.paymentMethod = "Payment method is required";
  }

  return Object.keys(errors.value).length === 0; // Returns true if no errors
};

// Navigation functions
const nextStep = () => {
   if (validateStep()) {
     step.value++;
   }
};



// Submit function with loader
const submitForm = () => {
  if (!validateStep()) return;
  isLoading.value = true; // Show loader

  // Simulating API request
  setTimeout(() => {
    isLoading.value = false; // Hide loader

    // Simulated vendor details after order submission
    vendorsDetails.value = {
      vendorName: "GasLink Vendor Ltd.",
      deliveryName: "John Doe",
      phone: "+2348123456789",
      email: "vendor@example.com",
      address: "No. 12, Gas Street, Lagos",
    };

    step.value = 3; // Move to step 3 after order is processed
  }, 2000); // 2 seconds delay for simulation
};
</script>

<template>
  <div>
    <!-- Map -->
    
    <main
      class="flex md:flex-row flex-col md:p-[0.5rem] p-4 md:h-[100vh] h-full relative w-full md:gap-2 gap-[2rem] bg-[#CECBEC]">

      <!-- Sidebar -->
      <section
        class="lg:w-[30%] md:w-[40%] w-full z-50 flex flex-col items-center bg-[#655DC6] md:h-full h-[100vh] rounded-2xl relative">
        <div class="w-full px-5">
          <div class="grid grid-cols-2 items-center justify-between w-full">
            <div class="col-span-2 items-center justify-start">'
              <h1 class="text-[24px] text-lg-[2em] font-bold text-white">GasLink Gas Delivery</h1>
              <h4 class="font-poppins font-[400] text-[16px] text-white">by Enobong Johnson</h4>
            </div>
          </div>
        </div>

        <div class="items-center bg-white w-full rounded-2xl absolute px-10 py-5 top-[7rem] bottom-0">

          <!-- Stepper Progress -->
          <ul class="steps w-full mb-1">
            <li class="text-[14px]" :class="step >= 1 ? 'step step-primary' : 'step'" @click="step = 1">Gas Order</li>
            <li class="text-[14px]" :class="step >= 2 ? 'step step-primary' : 'step'">Payment</li>
            <li class="text-[14px]" :class="step >= 3 ? 'step step-primary' : 'step'">Order Success</li>
          </ul>
          <form>

            <!-- Step 1: Gas Order Details -->
            <div v-if="step === 1">
              <h2 class="text-center text-lg font-bold mb-5">Gas Order Details</h2>
              <div class="grid grid-flow-col gap-4">

                <div>
                  <select v-model="formData.gasType" class="select select-bordered w-full" required>
                    <option value="" disabled selected>Select gas type</option>
                    <option value="cooking gas">Cooking Gas (LPG)</option>
                    <option value="propane">Propane</option>
                    <option value="butane">Butane</option>
                  </select>
                  <p v-if="errors.gasType" class="text-red-500 text-sm">{{ errors.gasType }}</p>
                </div>
                <div>
                  <select v-model="formData.cylinderSize" class="select select-bordered w-full" required>
                    <option value="" disabled selected>Select cylinder size</option>
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
                  <p v-if="errors.cylinderSize" class="text-red-500 text-sm">{{ errors.cylinderSize }}</p>
                </div>
              </div>



              <input type="text" v-model="formData.quantity" placeholder="Quantity (e.g ₦3000, 3kg)"
                class="input input-bordered w-full mt-4" required />
              <p v-if="errors.quantity" class="text-red-500 text-sm">{{ errors.quantity }}</p>

              <input type="text" v-model="formData.deliveryLocation" placeholder="Delivery Location"
                class="input input-bordered w-full mt-4" required />
              <p v-if="errors.deliveryLocation" class="text-red-500 text-sm">{{ errors.deliveryLocation }}</p>

              <vue-tel-input class="input input-bordered rounded-[200px] mt-4 px-0" v-model="formData.phone"
                mode="international" required />
              <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>

              <input type="email" v-model="formData.email" placeholder="Your Email"
                class="input input-bordered w-full mt-4" required />
              <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
            </div>

            <!-- Step 2: Payment Method -->
            <div v-if="step === 2">
              <h2 class="text-center text-lg font-bold mb-5">Payment</h2>
              <label class="block font-semibold">Select Payment Method</label>
              <select v-model="formData.paymentMethod" class="select select-bordered w-full" required>
                <option value="" disabled selected>Select payment method</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="online_payment">Online Payment</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="pos">POS</option>
              </select>
              <p v-if="errors.paymentMethod" class="text-red-500 text-sm">{{ errors.paymentMethod }}</p>
            </div>

            <!-- Step 3: Order Success Message -->
            <div v-if="step === 3">
              <h2 class="text-center text-lg font-bold text-green-600 my-10">Order Successful! ✅</h2>
              <!-- <p class="text-center text-gray-700">Your gas order has been placed successfully.</p> -->

              <div class="grid grid-flow-col gap-4 my-5">
                <div>
                  <img class="rounded-full w-full" src="../assets/images/vendor.webp" alt="">
                </div>
                <div class="col-span-6 my-auto">
                  <h4 class="font-[700] text-[20px]">Delivery Vendor Details</h4>
                  <p class="mb-1">{{ vendorsDetails?.vendorName }}</p>
                <p class="mb-1">{{ vendorsDetails?.deliveryName }}</p>
                <p class="mb-1">{{ vendorsDetails?.phone }}</p>
                <p class="mb-1">{{ vendorsDetails?.email }}</p>
                <p class="mb-1">{{ vendorsDetails?.address }}</p>
                </div>
              </div>
              <div class="grid grid-flow-col gap-4">
                <div class="col-span-2 ">
                  <label class="input input-bordered bg-gray-300 rounded-full flex items-center gap-2">
                    <span class="mdi mdi-chat-processing text-[30px]"></span>
                    <input type="text" class="grow " placeholder="Any delivery notes?" />
                  </label>
                </div>
                <div class="my-auto">
                  <a href="" class="rounded-full bg-gray-300 py-2 px-3"><span
                      class="mdi mdi-phone text-[20px] font[700]"></span></a>
                </div>
              </div>
              <!-- <div class="bg-black text-white p-4 mt-4 rounded-lg ">
                <h4 class="font-[700] text-[20px]">Delivery Vendor Details</h4>
                <p class="mb-4"><strong>Vendor Name:</strong> {{ vendorsDetails?.vendorName }}</p>
                <p class="mb-4"><strong>Delivery Name:</strong> {{ vendorsDetails?.deliveryName }}</p>
                <p class="mb-4"><strong>Phone:</strong> {{ vendorsDetails?.phone }}</p>
                <p class="mb-4"><strong>Email:</strong> {{ vendorsDetails?.email }}</p>
                <p class="mb-4"><strong>Vendor Address:</strong> {{ vendorsDetails?.address }}</p>
              </div> -->
            </div>

            <!-- Loader -->
            <div v-if="isLoading" class="block text-center justify-center mt-4">
              <h4 class="font-[700] text-[20px]">Delivery Vendor Found</h4>
              <p>Waiting for delivery vendor to confirm order</p>
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Navigation Buttons -->
            <div class="text-right mt-4">
              <button v-if="step === 1" @click="nextStep"
                class="btn bg-[#655DC6] hover:bg-[#340846] text-white w-full">Continue...</button>

              <input type="submit" v-if="step === 2" @click.prevent="submitForm" value="Complete Order"
                class="input input-bordered w-full bg-[#655DC6] hover:bg-[#340846] text-white cursor-pointer" />
            </div>
          </form>
        </div>
      </section>

      <!-- Map -->
      <section
        class="skeleton flex items-center lg:w-[70%] md:w-[60%] w-full md:h-full h-[20rem] rounded-2xl bg-gray-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d63591.99771490514!2d7.9048306!3d5.0223586000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1740667366350!5m2!1sen!2sng"
          width="100%" height="100%" style="border:0;" class="rounded-2xl" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </section>

    </main>
  </div>
</template>

<style scoped>
.step-primary:before,
.step-primary:after {
  background-color: orange !important;
}

.vue-tel-input {
  border-radius: 7px;
}
</style>
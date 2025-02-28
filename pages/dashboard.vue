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

<template>
  <div>
    <main
      class="flex md:flex-row flex-col md:p-[0.5rem] p-4 md:h-[100vh] h-full relative w-full md:gap-2 gap-[2rem] bg-[#CECBEC]">

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

        <div class="items-center bg-white w-full rounded-2xl absolute p-10 top-[7rem] bottom-0">

          <h2 class="font-bold text-center text-[20px] my-5">Gas Order Details</h2>
          <form action="">
            <!-- Step 1: Register -->
            <div v-if="step === 1">
              <div class="grid grid-flow-col gap-4">
                <div>
                  <label class="block font-[500] text-[16px]">Select Gas Type</label>
                  <select v-model="formData.gasType" class="select select-bordered w-full" required>
                    <option value="cooking gas">Cooking Gas (LPG)</option>
                    <option value="propane">Propane</option>
                    <option value="butane">Butane</option>
                  </select>
                </div>

                <div>
                  <label class="block font-[600] text-[16px]">Select Cylinder Size</label>
                <select v-model="formData.cylinderSize" class="select select-bordered w-full" required>
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
              </div>
              <div class="my-4">
                <input type="text" v-model="formData.quantity" placeholder="Quantity (e.g ₦3000, 3kg)"
                  class="input input-bordered w-full" required />
              </div>
              <div class="my-4">
                <input type="text" v-model="formData.deliveryLocation" placeholder="Delivery Location/address"
                  class="input input-bordered w-full" required />
              </div>
              <div class="my-4">
                <vue-tel-input class="input input-bordered rounded-full px-0" v-model="formData.phone"
                  mode="international" required />
              </div>
              <div class="my-4">
                <input v-model="formData.email" type="email" placeholder="Your email address"
                  class="input input-bordered w-full" required />
              </div>
            </div>

            <!-- Step 2: Choose Plan -->
            <div v-if="step === 2">
              <h2 class="text-xl font-semibold">Choose a Payment method</h2>
              <select v-model="formData.paymentMethod" id="paymentMethod" class="select select-bordered w-full" required>
                <option value="Select a payment method" selected disabled>Select a payment method</option>
                <option value="cash_on _delivery">Cash on Delivery</option>
                <option value="online_payment">Online Payment</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="pos">POS</option>
              </select>
            </div>


            <!-- Navigation Buttons -->
            <div class="text-right mt-6">
              <input type="submit" v-if="step > 1" value="Complete Order" class="bg-[#655DC6] hover:bg-[#340846] text-white input input-bordered w-full">
              <button v-if="step < 2" @click="nextStep" class="btn bg-[#655DC6] hover:bg-[#340846] text-white">Place Order</button>
            </div>

          </form>
        </div>
      </section>


      <!-- Map -->
      <section class="skeleton flex items-center bg-gray lg:w-[70%] md:w-[60%] w-full md:h-full h-[20rem] rounded-2xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d63591.99771490514!2d7.9048306!3d5.0223586000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1740667366350!5m2!1sen!2sng"
          width="100%" height="100%" style="border:0;" class="rounded-2xl" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </section>


    </main>
  </div>
</template>

export default function useApi() {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;
  
    return {
      async getGasStations() {
        return await $fetch(`${apiBase}/gas-stations`);
      },
      async createOrder(orderData: any) {
        return await $fetch(`${apiBase}/orders`, {
          method: 'POST',
          body: orderData,
        });
      }
    };
  }
  
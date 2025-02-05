export default defineNuxtRouteMiddleware((to, from) =>  {
  if (process.client){
  const userData = localStorage.getItem('formData') ?? {};
  
  if (Object.keys(userData).length == 0) {
      return navigateTo("/login");
  }
} 
}); 
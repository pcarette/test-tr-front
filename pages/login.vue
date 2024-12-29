<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-black flex items-center justify-center p-4">
      <!-- Main Content -->
      <main class="relative flex items-center justify-center p-4 min-h-screen">
        <div class="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-white/10">
          <div>
            <h2 class="text-3xl font-bold text-white text-center">
              {{ isLogin ? 'Connexion' : 'Inscription' }}
            </h2>
          </div>
          
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label for="email" class="block text-sm font-medium text-white">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label for="password" class="block text-sm font-medium text-white">Mot de passe</label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {{ isLogin ? 'Se connecter' : "S'inscrire" }}
              </button>
            </div>
          </form>
  
          <div class="text-center">
            <button
              @click="isLogin = !isLogin"
              class="text-white/70 hover:text-white text-sm transition-colors duration-200"
            >
              {{ isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const config = useRuntimeConfig()
  const {BASE_API_URL} = config.public
  const router = useRouter()
  const isLogin = ref(true)
  const email = ref('')
  const password = ref('')
  
  const handleSubmit = async () => {
    console.log("BASE_API_URL : ",BASE_API_URL)
    try {
      // This is a mock API call - replace with your actual authentication endpoint
      const response = await fetch(BASE_API_URL + `/auth/${isLogin.value ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
  
      const data = await response.json()
  
      if (data.authToken) {
        // Store JWT and user data
        localStorage.setItem('jwt', data.authToken)
        localStorage.setItem('user', JSON.stringify({ email: email.value }))
        
        // Redirect to home page
        router.push('/')
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }
  </script>
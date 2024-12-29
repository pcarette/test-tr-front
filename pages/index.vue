<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-black relative">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex-shrink-0">
            <h1 class="text-white text-xl font-bold">MySeries</h1>
          </div>
          
          <div>
            <div v-if="user" class="flex items-center gap-4">
              <span class="text-white/80 text-sm">{{ user.email }}</span>
              <button
                @click="logout"
                class="text-white/80 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="relative flex items-center justify-center p-4 pt-20" style="min-height: calc(100vh - 64px)">
      <section class="max-w-md w-full">
        <div class="space-y-8">
          <h2 class="text-4xl font-bold text-white text-center mb-12">
            Gestionnaire de Séries
          </h2>
          
          <div class="space-y-4">
            <button
              @click="startNewSeries"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Commencer une nouvelle série
            </button>
            
            <button
              @click="viewPastSeries"
              class="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-6 py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Consulter les séries passées
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  // Check for JWT token and user data
  const token = localStorage.getItem('jwt')
  const userData = localStorage.getItem('user')
  
  if (!token || !userData) {
    router.push('/login')
    return
  }
  
  user.value = JSON.parse(userData)
})

const logout = () => {
  localStorage.removeItem('jwt')
  localStorage.removeItem('user')
  router.push('/login')
}

const startNewSeries = () => {
  router.push('/quiz')
}

const viewPastSeries = () => {
  router.push('/history')
}
</script>


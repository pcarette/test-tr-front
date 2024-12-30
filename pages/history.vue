<template>
    <div class="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black relative">
      <!-- Navbar -->
      <nav class="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex-shrink-0">
              <h1 class="text-white text-xl font-bold">SafeRoad</h1>
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
      <main class="relative p-4 pt-20 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-white my-8 text-center">Historique des Séries</h2>
        
        <div class="space-y-8 my-8">
          <template v-for="(monthGroup, month) in groupedSeries" :key="month">
            <div class="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 class="text-xl font-semibold text-white mb-4">{{ month }}</h3>
              
              <div class="space-y-4">
                <div v-for="serie in monthGroup" :key="serie._id.$oid" 
                     class="bg-black/30 rounded-lg p-4 hover:bg-black/40 transition-colors cursor-pointer"
                     @click="redirectToSerie(serie._id)">
                  <div class="flex justify-between items-center">
                    <div class="text-white">
                      <div class="font-medium">
                        Série du {{ formatDate(serie.createdAt) }}
                      </div>
                      <div class="text-sm text-gray-400 mt-1">
                        {{ serie.questions.length }} questions
                      </div>
                    </div>
                    <div class="text-sm text-gray-400">
                      {{ formatTime(serie.createdAt) }}
                    </div>
                  </div>
                  
                  <!-- Progress information -->
                  <div class="mt-3 flex items-center gap-2">
                    <div class="flex-1 bg-gray-800 rounded-full h-2">
                      <div 
                        class="bg-red-600 h-2 rounded-full" 
                        :style="`width: ${(serie.score / serie.questions.length) * 100}%`"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400">
                      {{ serie.score }}/{{ serie.questions.length }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
  
        <!-- Return Button -->
        <div class="flex justify-center mt-8">
          <button
            @click="router.push('/')"
            class="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Retour à l'accueil
        </button>
    </div>
</main>
</div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const {BASE_API_URL} = useRuntimeConfig().public
  
  const router = useRouter()
  const user = ref(null)
  const series = ref([])


  const fetchSeries = async () => {
  const token = localStorage.getItem('jwt');
  try {
    const response = await fetch(BASE_API_URL + '/datas/series', {
      headers: {
        "authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    await response.json().then(data => {
      series.value = data
    });
  } catch (err) {
    console.log(err.message);
  } 
};
  
  // Format date to European format (DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  // Format time (HH:mm)
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Group series by month
  const groupedSeries = computed(() => {
    const groups = {}
    
    // Sort series by date (newest first)
    const sortedSeries = [...series.value].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    
    sortedSeries.forEach(serie => {
      const date = new Date(serie.createdAt)
      const monthYear = date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
      })
      
      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      
      groups[monthYear].push(serie)
    })
    
    return groups
  })
  
  onMounted(() => {
    // Check authentication
    const token = localStorage.getItem('jwt')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    user.value = JSON.parse(userData)
    fetchSeries()
  })

  const redirectToSerie = (serieId) => {
    router.push("/serie/" + serieId)
  }
  
  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    router.push('/login')
  }
  </script>
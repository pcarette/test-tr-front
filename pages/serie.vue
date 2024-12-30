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
      <main class="relative flex items-center justify-center p-4 pt-20" style="min-height: calc(100vh - 64px)">
        <div v-if="loading" class="text-white text-xl">
        Chargement...
      </div>
      
      <div v-else-if="error" class="text-red-500 text-xl">
        {{ error }}
      </div>
        <div class="max-w-2xl w-full space-y-6">
          <!-- Score Card -->
          <div class="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <h2 class="text-3xl font-bold text-white mb-2">Résultats</h2>
            <p class="text-xl text-white">
              Score: <span class="font-bold">{{ results.score }}/{{ results.realAnswers.length }}</span>
            </p>
          </div>
  
          <!-- Questions Review -->
          <div v-for="(answer, index) in results.realAnswers" :key="answer._id" 
               class="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-semibold text-white">Question {{ answer.numero }}</h3>
            </div>
  
            <!-- User's Answers -->
            <div class="space-y-2">
              <div v-for="(userChoice, choiceIndex) in results.answersByUser[index]" :key="choiceIndex"
                   :class="{
                     'text-green-500': answer.answers.includes(userChoice),
                     'text-red-500': !answer.answers.includes(userChoice)
                   }"
                   class="p-3 bg-black/30 rounded-lg flex items-center">
                <span class="mr-2">
                  {{ answer.answers.includes(userChoice) ? '✓' : '✗' }}
                </span>
                <span>Réponse {{ userChoice + 1 }}</span>
              </div>
            </div>
  
            <!-- Correct Answers (if user missed any) -->
            <div v-if="!areAnswersCorrect(answer.answers, results.answersByUser[index])" 
                 class="mt-4 p-4 bg-white/10 rounded-lg">
              <p class="text-white text-sm font-medium mb-2">Réponses correctes:</p>
              <div class="text-green-500">
                <div v-for="correctAnswer in answer.answers" :key="correctAnswer">
                  Réponse {{ correctAnswer + 1 }}
                </div>
              </div>
            </div>
  
            <!-- Commentary -->
            <div class="mt-4 p-4 bg-white/10 rounded-lg">
              <p class="text-white text-sm italic">{{ answer.commentaire }}</p>
            </div>
          </div>
  
          <!-- Return Button -->
          <div class="flex justify-center mt-6">
            <button
              @click="router.push('/')"
              class="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // This would typically come from your state management or route params
  // For demo purposes, I'm using the provided JSON directly
  const results = ref({
    "success": "ok",
    "realAnswers": [
      {
        "_id": "66d459e65228aa243c5e73a4",
        "numero": 4,
        "answers": [2],
        "commentaire": "Hors agglomération, c'est toujours 80 km/h."
      },
      {
        "_id": "66d459595228aa243c5e73a2",
        "numero": 2,
        "answers": [1, 3],
        "commentaire": "Conduire alcoolisé est passible d'une suspension de permis de 6 mois."
      },
      {
        "_id": "66d45af35228aa243c5e73a6",
        "numero": 1,
        "answers": [1],
        "commentaire": "Le panneau STOP a une seule signification, vous devez vous arrêter."
      }
    ],
    "answersByUser": [
      [2, 1],
      [0, 2],
      [0]
    ],
    "score": 0
  })
  
  const areAnswersCorrect = (correctAnswers, userAnswers) => {
    if (!userAnswers) return false
    if (correctAnswers.length !== userAnswers.length) return false
    return correctAnswers.every(answer => userAnswers.includes(answer)) &&
           userAnswers.every(answer => correctAnswers.includes(answer))
  }
  
  onMounted(() => {
    // Check authentication
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
  </script>
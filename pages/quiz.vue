<template>
    <div class="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black relative">
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
        <div class="max-w-2xl w-full" style="max-width: calc(100vh - 64px)">
          <!-- Question Card -->
          <div class="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl">
            <div class="space-y-8">
              <div class="space-y-4">
                <h2 class="text-2xl font-bold text-white">Question {{ currentQuestion + 1 }}/{{ questions.length }}</h2>
                <p class="text-lg text-white">{{ questions[currentQuestion].question }}</p>
              </div>
  
              <!-- Answer Options -->
              <div class="space-y-3">
                <button
                  v-for="(option, index) in questions[currentQuestion].options"
                  :key="index"
                  @click="toggleAnswer(index)"
                  class="w-full text-left px-6 py-4 rounded-lg transition-all duration-200"
                  :class="{
                    'bg-red-600 text-white': selectedAnswers.includes(index),
                    'bg-red-800 text-white hover:bg-gray-700': !selectedAnswers.includes(index)
                  }"
                >
                  {{ option }}
                </button>
              </div>
  
              <!-- Submit Button -->
              <div class="flex justify-end">
                <button
                  @click="submitAnswer"
                  class="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  {{ isLastQuestion ? 'Terminer' : 'Question suivante' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const user = ref(null)
  const currentQuestion = ref(0)
  const selectedAnswers = ref([])
  
  // Sample questions - replace with your actual questions
  const questions = ref([
    {
      question: "Quelle est la capitale de la France ?",
      options: ["Londres", "Paris", "Berlin", "Madrid"],
      correctAnswers: [1] // Index of correct answer(s)
    },
    {
      question: "Quels sont les pays scandinaves ? (plusieurs réponses possibles)",
      options: ["Norvège", "Finlande", "Danemark", "Allemagne"],
      correctAnswers: [0, 1, 2] // Multiple correct answers
    }
  ])
  
  const isLastQuestion = computed(() => {
    return currentQuestion.value === questions.value.length - 1
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
  })
  
  const toggleAnswer = (index) => {
    const position = selectedAnswers.value.indexOf(index)
    if (position === -1) {
      selectedAnswers.value.push(index)
    } else {
      selectedAnswers.value.splice(position, 1)
    }
  }
  
  const submitAnswer = () => {
    // Here you would typically validate the answer and store the result
    
    if (isLastQuestion.value) {
      // Handle quiz completion
      router.push('/')
    } else {
      // Move to next question
      currentQuestion.value++
      selectedAnswers.value = []
    }
  }
  
  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    router.push('/login')
  }
  </script>
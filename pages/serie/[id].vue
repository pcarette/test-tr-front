<template>
    <div class="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black relative">
      <!-- Navbar -->
      <nav class="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex-shrink-0 cursor-pointer" @click="goToMenu">
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
              Score: <span class="font-bold">{{ results.score }}/{{ results.answers.length }}</span>
            </p>
          </div>
  
          <!-- Questions Review -->
          <div v-for="(answer, index) in results.answers" :key="answer._id" 
               class="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-semibold text-white">Question {{ index + 1 }} : {{ results.questions[index].question }}</h3>
            </div>
  
            <!-- User's Answers -->
            <div class="space-y-2">
              <div v-for="(userChoice, choiceIndex) in results.inputsByUser[index]" :key="choiceIndex"
                   :class="{
                     'text-green-500': answer.answers.includes(userChoice),
                     'text-red-500': !answer.answers.includes(userChoice)
                   }"
                   class="p-3 bg-black/30 rounded-lg flex items-center">
                <span class="mr-2">
                  {{ answer.answers.includes(userChoice) ? '✓' : '✗' }}
                </span>
                <span>Réponse {{ userChoice + 1 }} : {{results.questions[index].propositions[userChoice]}}</span>
              </div>
            </div>
  
            <!-- Correct Answers (if user missed any) -->
            <div v-if="!areAnswersCorrect(answer.answers, results.inputsByUser[index])" 
                 class="mt-4 p-4 bg-white/10 rounded-lg">
              <p class="text-white text-sm font-medium mb-2">Réponses correctes:</p>
              <div class="text-green-500">
                <div v-for="correctAnswer in answer.answers" :key="correctAnswer">
                  Réponse {{ correctAnswer + 1 }} : {{results.questions[index].propositions[correctAnswer]}}
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
              @click="router.push('/history')"
              class="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Retour aux séries
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
  const route = useRoute();
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const {BASE_API_URL} = useRuntimeConfig().public

  const id = route.params.id


  
  // This would typically come from your state management or route params
  // For demo purposes, I'm using the provided JSON directly
  const results = ref({
  "_id": "6772d7ce63d4374571a5f7bf",
  "questions": [
    {
      "_id": "66d49747943e6b63315e739f",
      "numero": 4,
      "question": "Hors aglomération, il faut rouler maximum à ...",
      "propositions": [
        "50 km.",
        "80 km.",
        "110 km."
      ]
    },
    {
      "_id": "66d49726943e6b63315e739c",
      "numero": 1,
      "question": "Quand il y a un STOP, faut il ...",
      "propositions": [
        "s'arreter.",
        "avancer."
      ]
    },
    {
      "_id": "66d49758943e6b63315e73a0",
      "numero": 5,
      "question": "Sur autoroute, il faut rouler maximum à ...",
      "propositions": [
        "80 km.",
        "110 km.",
        "130 km."
      ]
    }
  ],
  "user": "67719eccae863aead76dbd41",
  "inputsByUser": [
    [
      1
    ],
    [
      0
    ],
    [
      2
    ]
  ],
  "currentQuestion": 3,
  "createdAt": "2024-12-30T17:26:38.245Z",
  "updatedAt": "2024-12-30T17:26:50.712Z",
  "__v": 0,
  "score": 3,
  "answers": [
    {
      "_id": "66d459e65228aa243c5e73a4",
      "numero": 4,
      "answers": [
        1
      ],
      "commentaire": "Hors agglomération, c'est toujours 80 km/h."
    },
    {
      "_id": "66d45af35228aa243c5e73a6",
      "numero": 1,
      "answers": [
        0
      ],
      "commentaire": "Le panneau STOP a une seule signification, vous devez vous arrêter."
    },
    {
      "_id": "66d45a135228aa243c5e73a5",
      "numero": 5,
      "answers": [
        2
      ],
      "commentaire": "Sur autoroute, c'est toujours 130 km/h."
    }
  ]
})

  const fetchResults = async (serieId) => {
  const token = localStorage.getItem('jwt')
  try {
    const response = await fetch(`${BASE_API_URL}/datas/serie/${serieId}/`, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les résultats')
    }

    if (response.status === 401) {
      logout()
    }
    
    const data = await response.json()
    console.log("data : ", data)
    results.value = data
    loading.value = false
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}
  
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
    fetchResults(id)
  })
  
  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const goToMenu = () => {
    router.push('/')
  }
  </script>
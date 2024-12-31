<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-black"
  >
    <!-- Navbar -->
    <nav
      class="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-white/10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex-shrink-0 cursor-pointer" @click="goToMenu">
              <h1 class="text-white text-xl font-bold">SafeRoad</h1>
            </div>
          <div v-if="user" class="flex items-center gap-4">
            <span class="text-white/80 text-sm">{{ user.email }}</span>
            <button
              @click="logout"
              class="text-white/80 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main
      class="relative flex items-center justify-center p-4 pt-20"
      style="min-height: calc(100vh - 64px)"
    >
      <div v-if="loading" class="text-white">Loading...</div>
      <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>
      <div v-else>
        <div
          class="max-w-2xl w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl"
        >
          <div class="space-y-8">
            <div class="space-y-4">
              <h2 class="text-2xl font-bold text-white">
                Question {{ currentQuestion + 1 }}/{{ questions.length }}
              </h2>
              <p class="text-lg text-white">
                {{ questions[currentQuestion]?.question }}
              </p>
            </div>

            <div class="space-y-3">
              <button
                v-for="(option, index) in questions[currentQuestion]
                  ?.propositions || []"
                :key="index"
                @click="toggleAnswer(index)"
                class="w-full text-left px-6 py-4 rounded-lg transition-all"
                :class="{
                  'bg-blue-600 text-white': selectedAnswers.includes(index),
                  'bg-blue-800 text-white hover:bg-gray-700':
                    !selectedAnswers.includes(index),
                }"
              >
                {{ option }}
              </button>
            </div>

            <div class="flex justify-end">
              <button
                @click="submitAnswer"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-sm font-semibold"
              >
                {{ isLastQuestion ? "Terminer" : "Question suivante" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const questions = ref([]);
const currentQuestion = ref(0);
const selectedAnswers = ref([]);
const loading = ref(true);
const error = ref(null);
const user = ref(null);
const { BASE_API_URL } = useRuntimeConfig().public;

const fetchQuestions = async () => {
  const token = localStorage.getItem("jwt");
  try {
    const response = await fetch(BASE_API_URL + "/datas/questions", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch questions");
    if (response.status === 401) {
      logout();
    }
    await response.json().then((data) => {
      questions.value = data.questions;
      currentQuestion.value = data.currentQuestion;
    });
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const QuestionnaryPost = async (selectedAnswers, indexQuestion) => {
  const token = localStorage.getItem("jwt");
  try {
    var tokenToSend = "Bearer " + token;
    const response = await fetch(BASE_API_URL + "/datas/serie/last", {
      //  <<<< backend api here <<<
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: tokenToSend,
      },
      body: JSON.stringify({
        selectedAnswers: selectedAnswers,
        indexQuestion: indexQuestion,
      }),
    });
    if (response.status === 401) {
      logout();
    }
    const res = await response.json();
    return res;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  const token = localStorage.getItem("jwt");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    router.push("/login");
    return;
  }

  user.value = JSON.parse(userData);
  fetchQuestions();
});

const toggleAnswer = (index) => {
  const position = selectedAnswers.value.indexOf(index);
  if (position === -1) {
    selectedAnswers.value.push(index);
  } else {
    selectedAnswers.value.splice(position, 1);
  }
};

const submitAnswer = () => {
  QuestionnaryPost(selectedAnswers.value, currentQuestion.value).then((res) =>
    console.log("res: ", res)
  );
  if (currentQuestion.value === questions.value.length - 1) {
    router.push("/");
  } else {
    currentQuestion.value++;
    selectedAnswers.value = [];
  }
};

const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  router.push("/login");
};


const goToMenu = () => {
  router.push('/')
}

</script>

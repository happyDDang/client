<template>
  <div class="app">
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <button class="start-button" @click="startGame">GAME START</button>
      </div>
    </div>
    <div v-else>
      <div v-if="timerWidth > 0">
        <div class="timer-container">
          <p class="timer-label">Time!</p>
          <div class="timer-bar" :style="{ width: timerWidth + '%' }"></div>
        </div>
        <div class="score-container">Score: {{ score }}</div>
        <div class="image-container">
          <img :src="currentImage" alt="Random Image" />
        </div>
        <div class="key-list-container">
          <div class="key-list-box">
            <p class="key-list-label">Random Key List:</p>
            <p class="keys">{{ formattedKeyList }}</p>
          </div>
        </div>
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
      <div v-else>
        <div class="popup-overlay">
          <div class="popup">
            <input
              type="text"
              v-model="nickname"
              class="nickname-input"
              placeholder="Enter your nickname"
            />
            <button class="start-button" @click="startGame">RESTART</button>
            <button class="rank-button" :disabled="!nickname" @click="goToRank">
              Go to Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Import images directly
import Dog1_1 from '../assets/dog1_1.png';
import Dog1_2 from '../assets/dog1_2.png';
import Dog1_3 from '../assets/dog1_3.png';
import Dog1_4 from '../assets/dog1_4.png';
import Dog1_5 from '../assets/dog1_5.png';

const router = useRouter();

const images = [
  [Dog1_1, Dog1_2, Dog1_3, Dog1_4, Dog1_5],
  [Dog1_1, Dog1_2, Dog1_3, Dog1_4, Dog1_5],
  [Dog1_1, Dog1_2, Dog1_3, Dog1_4, Dog1_5],
  [Dog1_1, Dog1_2, Dog1_3, Dog1_4, Dog1_5],
  [Dog1_1, Dog1_2, Dog1_3, Dog1_4, Dog1_5],
];

const currentImageIndex = ref(0);
const currentDogStep = ref(0);
const keyList = ref([]);
const errorMessage = ref('');
const showPopup = ref(true);
const timerWidth = ref(100);
const score = ref(0);
const nickname = ref('');
const currentKeyIndex = ref(0);

const currentImage = computed(
  () => images[currentImageIndex.value][currentDogStep.value]
);

const formattedKeyList = computed(() => {
  return keyList.value
    .map((key) => {
      switch (key) {
        case 'ArrowUp':
          return '⬆️';
        case 'ArrowDown':
          return '⬇️';
        case 'ArrowLeft':
          return '⬅️';
        case 'ArrowRight':
          return '➡️';
        case ' ':
          return '⭕';
        default:
          return key;
      }
    })
    .join(', ');
});

const startGame = () => {
  score.value = 0;
  window.addEventListener('keydown', handleKeyPress);
  showPopup.value = false;
  generateRandomKeys();
  startTimer();
};

const startTimer = () => {
  timerWidth.value = 100;
  const timerInterval = setInterval(() => {
    if (timerWidth.value > 0) {
      timerWidth.value -= 5;
    } else {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(timerInterval);
    }
  }, 1000);
};

const generateRandomKeys = () => {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
  const randomKeys = [];
  while (randomKeys.length < 8) {
    const remainingKeys = keys.filter((key) => !randomKeys.includes(key));
    if (remainingKeys.length > 0) {
      randomKeys.push(
        remainingKeys[Math.floor(Math.random() * remainingKeys.length)]
      );
    } else {
      randomKeys.push(keys[Math.floor(Math.random() * keys.length)]);
    }
  }
  keyList.value = randomKeys;
};

const handleKeyPress = (event) => {
  if (timerWidth.value <= 0) return;

  if (keyList.value[currentKeyIndex.value] === event.key) {
    errorMessage.value = '';
    currentKeyIndex.value++;
    createFirework(); // 폭죽 효과 실행

    // 강아지 단계 증가
    if (currentKeyIndex.value % 2 === 0) {
      currentDogStep.value += 1;
    }

    // 다음 강아지로 넘어가기
    if (currentKeyIndex.value >= keyList.value.length) {
      score.value += 20;
      currentKeyIndex.value = 0;
      currentImageIndex.value = Math.floor(Math.random() * images.length);
      currentDogStep.value = 0;
      generateRandomKeys();
    }
  } else {
    errorMessage.value = 'Incorrect key! Restarting...';
    currentKeyIndex.value = 0;

    setTimeout(() => {
      errorMessage.value = '';
    }, 2000);
  }
};

const createFirework = () => {
  const container = document.createElement('div');
  container.className = 'firework-container';
  document.body.appendChild(container);

  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework';
    const angle = (Math.PI * 2 * i) / 10; // 360도를 10개로 분산
    const distance = Math.random() * 100 + 50; // 랜덤 거리

    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    container.appendChild(particle);

    // 애니메이션 끝난 후 제거
    particle.addEventListener('animationend', () => {
      container.remove();
    });
  }
};

const goToRank = () => {
  if (nickname.value.trim()) {
    router.push('/rank'); // Navigate to ranking screen
  }
};

onMounted(() => {
  generateRandomKeys();
});
</script>

<script>
export default {
  name: 'HomePage',
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: url('@/assets/game_background.png') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  color: white;
  overflow: hidden;
}
.timer-container {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 150px;
  text-align: center;
}
.timer-label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
}
.timer-bar {
  height: 20px;
  background: #4caf50;
  border-radius: 10px;
  transition: width 1s linear;
}
.score-container {
  position: fixed;
  top: 10px;
  right: 20px;
  font-size: 18px;
  font-weight: bold;
}
.image-container img {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  margin-top: 20px;
  background-color: white;
}
.key-list-container {
  margin-top: 40px;
}
.key-list-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.key-list-label {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
.keys {
  font-size: 35px;
  font-weight: bold;
  color: #ffcc00;
}
.error-message {
  margin-top: 20px;
  color: red;
  font-weight: bold;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.nickname-input {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 1rem;
  width: 80%;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.rank-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.rank-button {
  background-color: #3498db; /* Change button color to desired blue */
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.rank-button:hover {
  background-color: #2980b9; /* Darker blue on hover */
}
.start-button {
  background-color: #ffcc00;
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.firework-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1000;
}

.firework {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ffcc00;
  border-radius: 50%;
  animation: explode 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes explode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0.5);
    opacity: 0;
  }
}
</style>

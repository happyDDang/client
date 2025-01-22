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
          <!-- <font-awesome-icon class="shake-icon" icon="fa-solid fas fa-clock" /> -->
          <div class="shake-icon">
            <img :src="Clock" alt="Clock Image" class="clock" />
            <p class="timer-label">Time!</p>
          </div>
          <div class="timer-bar" :style="{ width: timerWidth + '%' }"></div>
        </div>
        <div class="score-container">Score: {{ score }}</div>
        <div class="image-container">
          <div>
            <div class="animated-icons">
              <div
                class="resize-icon"
                :style="{
                  top: bubblePostion.top + 'px',
                  left: bubblePostion.left + 'px',
                }"
              >
                <img class="bubble" :src="Bubble" alt="Bubble" />
              </div>
              <div class="swing-icon">
                <img
                  :src="ShowerHead"
                  alt="Shower Head"
                  :style="{
                    top: showerPostion.top + 'px',
                    left: showerPostion.left + 'px',
                  }"
                />
              </div>
            </div>
            <img :src="currentImage" alt="Random Image" class="dog-image" />
          </div>
        </div>
        <div class="key-list-container">
          <div class="key-list-box" :class="{ shaking: isWrongKey }">
            <p class="key-list-label">아이 꺠끗해!</p>
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
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import images directly
import Dog1_1 from '../assets/dog1_1.png';
import Dog1_2 from '../assets/dog1_2.png';
import Dog1_3 from '../assets/dog1_3.png';
import Dog1_4 from '../assets/dog1_4.png';
import Dog1_5 from '../assets/dog1_5.png';
import Clock from '../assets/clock.png';
import ShowerHead from '../assets/shower_head.png';
import Bubble from '../assets/bubble.png';

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
const isWrongKey = ref(false);

const bubblePostion = ref({ top: 270, left: 30 });
const showerPostion = ref({ top: 0, left: 270 });

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
  }, 10000);
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

    // 아이콘 애니메이션 재시작
    // const animatedIcons = document.querySelector('.animated-icons');
    // animatedIcons.classList.remove('animate');
    // void animatedIcons.offsetWidth; // 리플로우 트릭
    // animatedIcons.classList.add('animate');

    bubblePostion.value = {
      top: Math.floor(Math.random() * 300),
      left: Math.floor(Math.random() * 300),
    };
    showerPostion.value = {
      top: Math.floor(Math.random() * 300),
      left: Math.floor(Math.random() * 300),
    };

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
    currentDogStep.value = 0;

    isWrongKey.value = true;

    setTimeout(() => {
      errorMessage.value = '';
      isWrongKey.value = false;

      currentKeyIndex.value = 0;
    }, 500);
  }
};

const goToRank = () => {
  if (nickname.value.trim()) {
    router.push('/rank');
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
  display: flex;
  flex-direction: column;
}

.timer-label {
  font-size: 30px;
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

.clock {
  width: 70px;
  height: 70px;
}

/* 시계 아이콘 */
.shake-icon {
  font-size: 24px;
  color: white;
  animation: shake 0.5s infinite; /* 떨림 애니메이션 */
  display: block;
  margin: 0 auto 5px auto; /* 중앙 정렬 */
  height: 24px;
}

.shaking {
  animation: shake 0.5s infinite;
  display: block;
  margin: 0 auto 5px auto; /* 중앙 정렬 */
}

@keyframes shake {
  0%,
  100% {
    transform: translate(0, 0);
  }
  20%,
  60% {
    transform: translate(-2px, 0);
  }
  40%,
  80% {
    transform: translate(2px, 0);
  }
}

.swing-icon {
  transform-origin: bottom;
  animation: swing 2s infinite alternate ease-in-out;
}

@keyframes swing {
  0% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(30deg);
  }
}

.bubble {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율 유지 */
}

.resize-icon {
  width: 150px;
  height: 150px;
  position: absolute;
  animation: resize 2s infinite alternate ease-in-out;
  transform-origin: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

@keyframes resize {
  0% {
    transform: scale(1); /* 위치 고정 */
  }
  100% {
    transform: scale(1.5); /* 위치 고정 */
  }
}

/* 나머지 스타일 */
.score-container {
  position: fixed;
  top: 10px;
  right: 20px;
  font-size: 18px;
  font-weight: bold;
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
  background-color: #3498db;
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
  background-color: #2980b9;
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

.animated-icons {
  position: relative;
  pointer-events: none;
}

.animated-icons img {
  position: absolute;
  width: 100px;
  height: 100px;
  animation: none;
  z-index: 2;
}

.shower {
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 2;
}

.animate .shower {
  animation: showerMove 2s infinite;
}

.animate .bubble {
  animation: bubbleMove 2s infinite;
}

@keyframes showerMove {
  0% {
    top: 0;
    left: 0;
  }
  50% {
    top: 50%;
    left: 50%;
  }
  100% {
    top: 100%;
    left: 100%;
  }
}

@keyframes bubbleMove {
  0% {
    top: 0;
    left: 0;
  }
  50% {
    top: 100%;
    left: 100%;
  }
  100% {
    top: 0;
    left: 0;
  }
}

.dog-image {
  width: 300px;
  height: 300px;
  z-index: 1;
  border-radius: 8px;
  margin-top: 20px;
  background-color: white;
}
</style>

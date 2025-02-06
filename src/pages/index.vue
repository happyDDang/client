<template>
  <div class="app">
    <div v-if="showPopup" class="popup-overlay">
      <div class="logo-box">
        <img class="logo" :src="Logo" alt="logo" />
        <div class="popup">
          <a href="#" @click="startGame" class="btn-3d yellow">GAME START!</a>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="timerWidth > 0">
        <div class="timer-container">
          <!-- <font-awesome-icon class="shake-icon" icon="fa-solid fas fa-clock" /> -->
          <div class="shake-icon">
            <img :src="Clock" alt="Clock Image" class="clock" />
            <div class="timer-label">Time!</div>
          </div>
          <div class="timer-bar-box">
            <div class="timer-bar" :style="{ width: timerWidth + '%' }"></div>
          </div>
        </div>
        <div class="score-container">Score: {{ score }}</div>
        <div class="image-container">
          <div>
            <div class="animated-icons">
              <div
                class="resize-icon-big"
                :style="{
                  top: bubblePostion1.top + 'px',
                  left: bubblePostion1.left + 'px',
                }"
              >
                <img class="bubble" :src="Bubble" alt="Bubble" />
              </div>
              <div
                class="resize-icon-small"
                :style="{
                  top: bubblePostion2.top + 'px',
                  left: bubblePostion2.left + 'px',
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
            <p class="keys">
              <ArrowSvg
                v-for="(key, index) in formattedKeyDirection"
                :key="index + Math.random()"
                :direction="key"
                :isFilled="isFilled[index]"
              />
            </p>
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
import './index.css';

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ArrowSvg from '../components/Arrow.vue';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import audioPlayer from '../composable/audioPlayer.js';

// import { checkNickname } from '../api/api.js';

// Import images directly
import Dog1_1 from '../assets/dog1_1.png';
import Dog1_2 from '../assets/dog1_2.png';
import Dog1_3 from '../assets/dog1_3.png';
import Dog1_4 from '../assets/dog1_4.png';
import Dog1_5 from '../assets/dog1_5.png';
import Clock from '../assets/clock.png';
import ShowerHead from '../assets/shower_head.png';
import Bubble from '../assets/bubble.png';
import Logo from '../assets/logo.png';

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
const timerWidth = ref(80);
const score = ref(0);
const nickname = ref('');
const currentKeyIndex = ref(0);
const isWrongKey = ref(false);
const isFilled = ref(Array(8).fill(false));

const bubblePostion1 = ref({ top: 200, left: 30 });
const bubblePostion2 = ref({ top: 50, left: 200 });
const showerPostion = ref({ top: 20, left: 30 });

const wrongInputSound = () => audioPlayer.playSound('wrongInput');

const currentImage = computed(
  () => images[currentImageIndex.value][currentDogStep.value]
);

const formattedKeyDirection = computed(() => {
  return keyList.value.map((key) => {
    switch (key) {
      case 'ArrowUp':
        return 'up';
      case 'ArrowDown':
        return 'down';
      case 'ArrowLeft':
        return 'left';
      case 'ArrowRight':
        return 'right';
      case ' ':
        return 'space';
      default:
        return key;
    }
  });
});

const startGame = () => {
  score.value = 0;
  window.addEventListener('keydown', handleKeyPress);
  showPopup.value = false;
  audioPlayer.playSound('gameStart');
  audioPlayer.stopSound('gameOver');
  generateRandomKeys();
  startTimer();
};

const startTimer = () => {
  timerWidth.value = 80;
  const timerInterval = setInterval(() => {
    if (timerWidth.value > 0) {
      timerWidth.value -= 4;
    } else {
      audioPlayer.stopSound('gameStart');
      audioPlayer.playSound('gameOver');
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(timerInterval);
    }
  }, 200000);
};

const generateRandomKeys = () => {
  isFilled.value = Array(8).fill(false);

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
    isFilled.value[currentKeyIndex.value] = true;
    errorMessage.value = '';
    currentKeyIndex.value++;

    bubblePostion1.value = {
      top: Math.floor(Math.random() * 200),
      left: Math.floor(Math.random() * 200),
    };
    bubblePostion2.value = {
      top: Math.floor(Math.random() * 300),
      left: Math.floor(Math.random() * 300),
    };
    showerPostion.value = {
      top: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 300),
    };

    // 강아지 단계 증가
    if (currentKeyIndex.value % 2 === 0) {
      currentDogStep.value += 1;
    }

    // 다음 강아지로 넘어가기
    if (currentKeyIndex.value >= keyList.value.length) {
      audioPlayer.playSound('dogBark');
      score.value += 20;
      currentKeyIndex.value = 0;
      currentImageIndex.value = Math.floor(Math.random() * images.length);
      currentDogStep.value = 0;
      generateRandomKeys();
    }
  } else {
    wrongInputSound();
    errorMessage.value = 'Incorrect key! Restarting...';
    currentDogStep.value = 0;

    isWrongKey.value = true;

    isFilled.value = Array(8).fill(false);

    setTimeout(() => {
      errorMessage.value = '';
      isWrongKey.value = false;

      currentKeyIndex.value = 0;
    }, 500);
  }
};

const goToRank = async () => {
  if (nickname.value.trim()) {
    router.push('/rank');
  }

  /**
   * API 연동 후 주석 제거 예정
  try {
    const response = await checkNickname(nickname.value);
    const isDuplicated = response.data.value.duplicated;
    if (!isDuplicated && nickname.value.trim()) {
      router.push('/rank');
    } else {
      alert('닉네임 중복입니다. 다른 닉네임을 사용해주세요.');
    }
  } catch (error) {
    console.error('Failed to check nickname duplication:', error);
  }
  */
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

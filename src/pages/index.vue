<template>
  <div class="app">
    <div>
      <button @click="notify">Notify !</button>
    </div>
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
        <div class="timer-container" :class="{ 'shake-icon': is10SecondLeft }">
          <div class="timer-box">
            <div class="clock-icon">
              <img :src="Clock" alt="Clock Image" class="clock" />
            </div>
            <div class="timer-bar-box">
              <div class="timer-bar" :style="{ width: timerWidth + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="score-container">
          <div class="score-box">
            <img :src="ScoreDog" class="score-dog" />
            <img :src="Bone" class="score-bone" />
            <div class="score-text">{{ score }}</div>
          </div>
        </div>
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
          <div v-if="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
          </div>
          <div class="key-list-box" :class="{ shaking: isWrongKey }">
            <p class="keys">
              <ArrowSvg
                class="key"
                v-for="(key, index) in formattedKeyDirection"
                :key="index + Math.random()"
                :direction="key"
                :isFilled="isFilled[index]"
              />
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="popup-overlay">
          <div class="popup2">
            <img :src="ScoreDog" class="score-dog-2" />
            <input
              type="text"
              v-model="nickname"
              class="nickname-input"
              placeholder="Enter your nickname"
            />
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

import audioPlayer from '../composable/audioPlayer.js';

import { checkNickname, registerRanking } from '../api/api.js';

import { useUserStore } from '../stores/userStore.js';

import { toast } from 'vue3-toastify';

// Import images directly
import Dog1_1 from '../assets/dog1_1.png';
import Dog1_2 from '../assets/dog1_2.png';
import Dog1_3 from '../assets/dog1_3.png';
import Dog1_4 from '../assets/dog1_4.png';
import Dog1_5 from '../assets/dog1_5.png';
import Dog2_1 from '../assets/dog2_1.png';
import Dog2_2 from '../assets/dog2_2.png';
import Dog2_3 from '../assets/dog2_3.png';
import Dog2_4 from '../assets/dog2_4.png';
import Dog2_5 from '../assets/dog2_5.png';
import Dog3_1 from '../assets/dog3_1.png';
import Dog3_2 from '../assets/dog3_2.png';
import Dog3_3 from '../assets/dog3_3.png';
import Dog3_4 from '../assets/dog3_4.png';
import Dog3_5 from '../assets/dog3_5.png';
import Dog4_1 from '../assets/dog4_1.png';
import Dog4_2 from '../assets/dog4_2.png';
import Dog4_3 from '../assets/dog4_3.png';
import Dog4_4 from '../assets/dog4_4.png';
import Dog4_5 from '../assets/dog4_5.png';
import Dog5_1 from '../assets/dog5_1.png';
import Dog5_2 from '../assets/dog5_2.png';
import Dog5_3 from '../assets/dog5_3.png';
import Dog5_4 from '../assets/dog5_4.png';
import Dog5_5 from '../assets/dog5_5.png';
import Clock from '../assets/clock.png';
import ShowerHead from '../assets/shower_head.png';
import Bubble from '../assets/bubble.png';
import Logo from '../assets/logo.png';
import ScoreDog from '../assets/score_dog.png';
import Bone from '../assets/bone.png';

const router = useRouter();

const userStore = useUserStore();

const images = [
  [Dog1_1, Dog1_2, Dog1_3, Dog1_4, Dog1_5],
  [Dog2_1, Dog2_2, Dog2_3, Dog2_4, Dog2_5],
  [Dog3_1, Dog3_2, Dog3_3, Dog3_4, Dog3_5],
  [Dog4_1, Dog4_2, Dog4_3, Dog4_4, Dog4_5],
  [Dog5_1, Dog5_2, Dog5_3, Dog5_4, Dog5_5],
];

const currentImageIndex = ref(0);
const currentDogStep = ref(0);
const keyList = ref([]);
const errorMessage = ref('');
const showPopup = ref(true);
const timerWidth = ref(200);
const score = ref(0);
const nickname = ref('');
const currentKeyIndex = ref(0);
const isWrongKey = ref(false);
const isFilled = ref(Array(8).fill(false));
const is10SecondLeft = ref(false);

const animationPosition = ref([
  [
    { top: 140, left: 30 },
    { top: 200, left: 150 },
    { top: -40, left: 200 },
  ],
  [
    { top: 200, left: 30 },
    { top: 100, left: 150 },
    { top: -40, left: 200 },
  ],
  [
    { top: 200, left: 150 },
    { top: 100, left: 30 },
    { top: -40, left: 200 },
  ],
]);
const bubblePostion1 = ref({ top: 200, left: 30 }); // big
const bubblePostion2 = ref({ top: 100, left: 150 }); // small
const showerPostion = ref({ top: -40, left: 200 });

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
  timerWidth.value = 100;
  const timerInterval = setInterval(() => {
    if (timerWidth.value > 0) {
      timerWidth.value -= 5;
    } else {
      audioPlayer.stopSound('gameStart');
      audioPlayer.playSound('gameOver');
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(timerInterval);
    }

    if (timerWidth.value < 50) {
      is10SecondLeft.value = true;
    }
  }, 2000);
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

    let randomPosition = Math.floor(Math.random() * 3);

    bubblePostion1.value = {
      top: animationPosition.value[randomPosition][0].top,
      left: animationPosition.value[randomPosition][0].left,
    };
    bubblePostion2.value = {
      top: animationPosition.value[randomPosition][1].top,
      left: animationPosition.value[randomPosition][1].left,
    };
    showerPostion.value = {
      top: animationPosition.value[randomPosition][2].top,
      left: animationPosition.value[randomPosition][2].left,
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
    errorMessage.value = 'Retry!';
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
  try {
    const response = await checkNickname({
      nickname: nickname.value,
    });

    const isDuplicated = response.value.duplicated;

    if (!isDuplicated && nickname.value.trim()) {
      userStore.setMemberNo(response.value.member.member_no);

      try {
        await registerRanking({
          member_no: response.value.member.member_no,
          nickname: nickname.value,
          score: score.value,
        });
      } catch (rankingError) {
        toast.error('랭킹 등록에 실패하였습니다. 잠시 후에 시도해주세요.', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      router.push('/rank');
    } else {
      toast.warn('닉네임 중복입니다. 다른 닉네임을 사용해주세요.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  } catch (error) {
    toast.error('닉네임 중복 검사에 실패하였습니다. 잠시 후에 시도해주세요.', {
      position: toast.POSITION.TOP_CENTER,
    });
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

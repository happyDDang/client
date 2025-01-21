<template>
  <div class="app">
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <button class="start-button" @click="startGame">START</button>
        <button class="rank-button" @click="goToRank">Go to Rankings</button>
      </div>
    </div>
    <div v-else>
      <div v-if="timerWidth > 0">
        <div class="score-container">Score: {{ score }}</div>
        <div class="timer-container">
          <div class="timer-bar" :style="{ width: timerWidth + '%' }"></div>
        </div>
        <div class="image-container">
          <img :src="currentImage" alt="Random Image" />
        </div>
        <p>Press the correct key to change the image!</p>
        <div class="key-list">
          <p>Random Key List: {{ formattedKeyList }}</p>
        </div>
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
      <div v-else>
        <div class="popup-overlay">
          <div class="popup">
            <button class="start-button" @click="startGame">RESTART</button>
            <button class="rank-button" @click="goToRank">Go to Rankings</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const images = [
  "https://github.com/user-attachments/assets/b530963e-5d2b-4051-b889-401c74559c9b",
  "https://github.com/user-attachments/assets/7da13815-ad00-4906-adcc-380108bbeb9b",
  "https://github.com/user-attachments/assets/a3f96357-928a-459a-90ec-b582f0568059",
  "https://github.com/user-attachments/assets/da7c20a6-eed1-4867-987a-50a43b21dade",
  "https://github.com/user-attachments/assets/5d101c51-c21e-42f9-9e4d-7472620e8c6a",
];

const currentImageIndex = ref(0);
const keyList = ref([]);
const currentKeyIndex = ref(0);
const keyPressCount = ref(0);
const errorMessage = ref("");
const completed = ref(false);
const lastImageTimeout = ref(null);
const showPopup = ref(true);
const timerWidth = ref(100);
const timerInterval = ref(null);
const score = ref(0);

const currentImage = computed(() => images[currentImageIndex.value]);

const formattedKeyList = computed(() => {
  return keyList.value
    .map((key) => {
      switch (key) {
        case "ArrowUp":
          return "⬆️";
        case "ArrowDown":
          return "⬇️";
        case "ArrowLeft":
          return "⬅️";
        case "ArrowRight":
          return "➡️";
        case " ":
          return "⭕";
        default:
          return key;
      }
    })
    .join(", ");
});

const startGame = () => {
  showPopup.value = false;
  generateRandomKeys();
  startTimer();
};

const startTimer = () => {
  timerWidth.value = 100;
  timerInterval.value = setInterval(() => {
    if (timerWidth.value > 0) {
      timerWidth.value -= 5; // Decrease by 5% every second
    } else {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }, 1000);
};

const generateRandomKeys = () => {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
  const randomKeys = [];
  while (randomKeys.length < 8) {
    const remainingKeys = keys.filter((key) => !randomKeys.includes(key));
    if (remainingKeys.length > 0) {
      randomKeys.push(remainingKeys[Math.floor(Math.random() * remainingKeys.length)]);
    } else {
      randomKeys.push(keys[Math.floor(Math.random() * keys.length)]);
    }
  }
  keyList.value = randomKeys;
};

const changeImage = () => {
  if (currentImageIndex.value < images.length - 1) {
    currentImageIndex.value++;
  } else {
    completed.value = true;
    lastImageTimeout.value = setTimeout(() => {
      resetGame();
    }, 2000); // Display last image for 2 seconds
  }
};

const resetGame = () => {
  currentImageIndex.value = 0;
  completed.value = false;
  generateRandomKeys();
  currentKeyIndex.value = 0;
  keyPressCount.value = 0;
  errorMessage.value = "";
  if (lastImageTimeout.value) {
    clearTimeout(lastImageTimeout.value);
    lastImageTimeout.value = null;
  }
};

const handleKeydown = (event) => {
  if (completed.value) {
    resetGame();
    return;
  }

  const currentKey = keyList.value[currentKeyIndex.value];
  if (event.key === currentKey) {
    errorMessage.value = "";
    currentKeyIndex.value++;
    keyPressCount.value++;

    if (keyPressCount.value % 2 === 0) {
      changeImage();
    }

    if (currentKeyIndex.value >= keyList.value.length) {
      score.value += 20; // Increment score by 20
      resetGame();
    }
  } else {
    errorMessage.value = "Incorrect key! Restarting from the beginning.";
    resetGame(); // Reset everything, including the image
  }
};

const goToRank = () => {
  router.push("/rank");
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (lastImageTimeout.value) {
    clearTimeout(lastImageTimeout.value);
  }
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: url("@/assets/game_background.png") no-repeat center center fixed;
  background-size: cover;
}
.app {
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 50px;
  color: white;
}
.image-container img {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.key-list {
  margin-top: 20px;
  font-size: 14px;
  color: white;
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
  transition: transform 0.2s, box-shadow 0.2s;
}
.start-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}
.start-button:active {
  transform: scale(0.95);
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
}
.rank-button {
  background-color: #007bff;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  margin-top: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.rank-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}
.rank-button:active {
  transform: scale(0.95);
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
}
.timer-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 20px;
  background: #ccc;
  margin: 20px auto;
  border-radius: 10px;
  overflow: hidden;
}
.timer-bar {
  height: 100%;
  background: #4caf50;
  transition: width 1s linear;
}
.score-container {
  position: fixed;
  top: 10px;
  right: 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
}
</style>

<template>
  <div class="virtual-gamepad" v-if="showGamepad">
    <div class="gamepad-container">
      <!-- 십자 패드 -->
      <div class="dpad-container">
        <button
          class="dpad-btn dpad-up"
          @touchstart="handleTouch('ArrowUp')"
          @click="handleClick('ArrowUp')"
        >
          <div class="dpad-arrow up-arrow">▲</div>
        </button>
        <div class="dpad-middle-row">
          <button
            class="dpad-btn dpad-left"
            @touchstart="handleTouch('ArrowLeft')"
            @click="handleClick('ArrowLeft')"
          >
            <div class="dpad-arrow left-arrow">◄</div>
          </button>
          <div class="dpad-center"></div>
          <button
            class="dpad-btn dpad-right"
            @touchstart="handleTouch('ArrowRight')"
            @click="handleClick('ArrowRight')"
          >
            <div class="dpad-arrow right-arrow">►</div>
          </button>
        </div>
        <button
          class="dpad-btn dpad-down"
          @touchstart="handleTouch('ArrowDown')"
          @click="handleClick('ArrowDown')"
        >
          <div class="dpad-arrow down-arrow">▼</div>
        </button>
      </div>

      <!-- 스페이스 버튼 -->
      <div class="action-container">
        <button
          class="action-btn space-btn"
          @touchstart="handleTouch(' ')"
          @click="handleClick(' ')"
        >
          SPACE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  showGamepad: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['keypress']);

const handleTouch = (key) => {
  // 터치 시 haptic feedback (지원하는 기기에서)
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
  handleKeyPress(key);
};

const handleClick = (key) => {
  handleKeyPress(key);
};

const handleKeyPress = (key) => {
  emit('keypress', { key });
};
</script>

<style scoped>
.virtual-gamepad {
  position: fixed;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.gamepad-container {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* 십자 패드 */
.dpad-container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 50px 50px 50px;
  gap: 2px;
}

.dpad-btn {
  background: rgba(84, 167, 204, 0.9);
  border: 2px solid #54a7cc;
  border-radius: 8px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;
  min-height: 48px;
  min-width: 48px;
  touch-action: manipulation;
}

.dpad-btn:active {
  background: rgba(84, 167, 204, 1);
  transform: scale(0.95);
}

.dpad-up {
  grid-column: 2;
  grid-row: 1;
}

.dpad-left {
  grid-column: 1;
  grid-row: 2;
}

.dpad-center {
  grid-column: 2;
  grid-row: 2;
}

.dpad-right {
  grid-column: 3;
  grid-row: 2;
}

.dpad-down {
  grid-column: 2;
  grid-row: 3;
}

.dpad-middle-row {
  display: contents;
}

.dpad-arrow {
  font-size: 24px;
  line-height: 1;
}

/* 액션 버튼 */
.action-container {
  display: flex;
  align-items: center;
}

.action-btn {
  background: rgba(242, 72, 76, 0.9);
  border: 2px solid #f2484c;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;
  min-height: 60px;
  min-width: 60px;
  touch-action: manipulation;
}

.space-btn:active {
  background: rgba(242, 72, 76, 1);
  transform: scale(0.95);
}

/* 모바일 최적화 */
@media screen and (max-width: 480px) {
  .gamepad-container {
    gap: 30px;
    padding: 15px;
  }

  .dpad-container {
    grid-template-columns: 45px 45px 45px;
    grid-template-rows: 45px 45px 45px;
  }

  .dpad-btn {
    min-height: 44px;
    min-width: 44px;
    font-size: 18px;
  }

  .dpad-arrow {
    font-size: 20px;
  }

  .action-btn {
    min-height: 55px;
    min-width: 55px;
    font-size: 12px;
  }
}

/* 매우 작은 화면 */
@media screen and (max-width: 360px) {
  .virtual-gamepad {
    bottom: 15px;
  }

  .gamepad-container {
    gap: 25px;
    padding: 12px;
  }

  .dpad-container {
    grid-template-columns: 40px 40px 40px;
    grid-template-rows: 40px 40px 40px;
  }

  .dpad-btn {
    min-height: 40px;
    min-width: 40px;
    font-size: 16px;
  }

  .dpad-arrow {
    font-size: 18px;
  }

  .action-btn {
    min-height: 50px;
    min-width: 50px;
    font-size: 11px;
  }
}
</style>

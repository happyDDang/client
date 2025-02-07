<script>
export default {
  name: 'ArrowSvg',
};
</script>

<template>
  <svg
    v-if="direction === 'space'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    fill="none"
    stroke="#54a7cc"
    stroke-width="2"
    class="circle-icon"
  >
    <!-- 동그라미 -->
    <circle
      cx="20"
      cy="20"
      r="15"
      :class="{ filled: isFilled }"
      stroke="#54a7cc"
    />
  </svg>
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    stroke="#54a7cc"
    stroke-width="2"
    class="arrow-icon"
    fill="none"
    :style="{ transform: rotation }"
  >
    <!-- 화살표 -->
    <polygon
      points="25,5 40,20 30,20 30,35 20,35 20,20 10,20"
      :class="{ filled: isFilled }"
      stroke="#54a7cc"
      stroke-width="2"
    />
  </svg>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  isFilled: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'up', // 기본 방향은 위쪽
    validator: (value) =>
      ['up', 'down', 'left', 'right', 'space'].includes(value), // space 추가
  },
});

const rotationMap = {
  up: 'rotate(0deg)', // 기본 회전 (위쪽)
  right: 'rotate(90deg)', // 오른쪽
  down: 'rotate(180deg)', // 아래쪽
  left: 'rotate(-90deg)', // 왼쪽
};

const rotation = rotationMap[props.direction] || 'rotate(0deg)'; // 기본 회전값
</script>

<style scoped>
.arrow-icon,
.circle-icon {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.3s ease; /* 부드러운 애니메이션 효과 */
}
.filled {
  fill: #54a7cc; /* 색상 변경 */
}
</style>

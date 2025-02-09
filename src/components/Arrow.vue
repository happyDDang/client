<script>
export default {
  name: 'ArrowSvg',
};
</script>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  isFilled: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'up',
    validator: (value) =>
      ['up', 'down', 'left', 'right', 'space'].includes(value),
  },
});

const rotationMap = {
  up: 'rotate(0deg)',
  right: 'rotate(90deg)',
  down: 'rotate(180deg)',
  left: 'rotate(-90deg)',
};

const rotation = computed(() => rotationMap[props.direction] || 'rotate(0deg)');
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
    <!-- 둥근 화살표 -->
    <path
      d="M 25 5 
         Q 38 15, 40 20 
         Q 30 18, 30 30 
         L 30 35 
         Q 30 40, 25 40 
         Q 20 40, 20 35 
         L 20 30 
         Q 20 18, 10 20 
         Q 12 15, 25 5"
      :class="{ filled: isFilled }"
      stroke="#54a7cc"
      stroke-width="2"
    />
  </svg>
</template>

<style scoped>
.arrow-icon,
.circle-icon {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.filled {
  fill: #54a7cc;
}
</style>

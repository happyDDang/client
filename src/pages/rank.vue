<template>
  <div class="rank-container">
    <h1>Ranking</h1>
    <div class="rank-list">
      <div
        v-for="(player, index) in rankings"
        :key="index"
        class="rank-item"
        :class="{ highlight: player.nickname === myRank.nickname }"
      >
        <p>{{ index + 1 }}. {{ player.nickname }} - {{ player.score }} pts</p>
      </div>
    </div>
    <div class="my-rank">
      <h2>Your Rank</h2>
      <p>{{ myRank.nickname }} - {{ myRank.score }} pts</p>
    </div>
    <button class="back-button" @click="backToGame">Back to Game</button>
  </div>
</template>

<script setup>
import './rank.css';

import { ref, onMounted } from 'vue';

import audioPlayer from '../composable/audioPlayer.js';

import { fetchRankings } from '../api/api.js';

import { useUserStore } from '../stores/userStore.js';

const userStore = useUserStore();

const rankings = ref([
  { nickname: 'Alice', score: 100 },
  { nickname: 'Bob', score: 80 },
  { nickname: 'Charlie', score: 60 },
  { nickname: 'Dave', score: 40 },
  { nickname: 'Eve', score: 20 },
]);

const myRank = ref({ name: 'You', score: 50 });

const loadRankings = async () => {
  try {
    const memberNo = userStore.memberNo;

    const response = await fetchRankings(memberNo, 5);

    console.log('rank 응답', response.data);

    rankings.value = response.data.value.top_rank || [];
    myRank.value = response.data.value.my_rank || {};
  } catch (error) {
    console.error('Failed to load rankings:', error);
  }
};

const backToGame = () => {
  audioPlayer.stopSound('gameOver');
  window.location.href = window.location.origin;
};

onMounted(() => {
  loadRankings();
});
</script>

<script>
export default {
  name: 'RankPage',
};
</script>

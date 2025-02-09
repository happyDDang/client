<template>
  <div class="rank-container">
    <div class="rank-box">
      <h1 class="rank-title">Ranking</h1>
      <div class="rank-list">
        <div v-for="(player, index) in rankings" :key="index" class="rank-item">
          <span class="rank-info">{{ index + 1 }}등</span>
          <span class="rank-nickname">{{ player.nickname }}</span>
          <div class="rank-point">{{ player.score }} pts</div>
        </div>
        <div class="rank-item my-rank">
          <img class="me" :src="Star" alt="Star" />
          <span class="rank-info">{{ myRank.rank }}등</span>
          <span class="rank-nickname">{{ myRank.nickname }}</span>
          <div class="rank-point">{{ myRank.score }} pts</div>
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <!-- <button
        class="btnFloat btnBlueGreen button1"
        @click="backToGame"
      ></button> -->
      <button class="btn-jittery" @click="backToGame">RESTART</button>
    </div>
  </div>
</template>

<script setup>
import './rank.css';
import Star from '../assets/star.png';

import { ref, onMounted } from 'vue';

import audioPlayer from '../composable/audioPlayer.js';

import { fetchRankings } from '../api/api.js';

import { useUserStore } from '../stores/userStore.js';

import { toast } from 'vue3-toastify';

const userStore = useUserStore();

const rankings = ref([
  { nickname: 'Alice', score: 100 },
  { nickname: 'Bob', score: 80 },
  { nickname: 'Charlie', score: 60 },
  { nickname: 'Dave', score: 40 },
  { nickname: 'Eve', score: 20 },
  { nickname: 'Eve', score: 20 },
  { nickname: 'Eve', score: 20 },
  { nickname: 'Eve', score: 20 },
]);

const myRank = ref({ rank: 100, nickname: 'You', score: 50 });

const loadRankings = async () => {
  try {
    const memberNo = userStore.memberNo;

    const response = await fetchRankings(memberNo, 7);

    rankings.value = response.value.top_rank || [];
    myRank.value = response.value.my_rank || {};
  } catch (error) {
    toast.error('랭킹 조회에 실패하였습니다.', {
      position: toast.POSITION.TOP_CENTER,
    });
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

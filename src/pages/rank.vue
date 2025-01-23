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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// import { fetchRankings } from '../api/api.js';

const router = useRouter();

const rankings = ref([
  { nickname: 'Alice', score: 100 },
  { nickname: 'Bob', score: 80 },
  { nickname: 'Charlie', score: 60 },
  { nickname: 'Dave', score: 40 },
  { nickname: 'Eve', score: 20 },
]);

const myRank = ref({ name: 'You', score: 50 });

/**
 * 
 const loadRankings = async () => {
  try {
    const response = await fetchRankings(12, 5);
    rankings.value = response.data.value.top_rank || [];
    myRank.value = response.data.value.my_rank || {};
  } catch (error) {
    console.error('Failed to load rankings:', error);
  }
};
*/

const backToGame = () => {
  router.push('/'); // Navigate back to the game start screen
};

onMounted(() => {
  // loadRankings();
});
</script>

<script>
export default {
  name: 'RankPage',
};
</script>

<style>
.rank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  color: #333;
}
.rank-list {
  margin: 20px 0;
}
.rank-item {
  margin: 10px 0;
  font-size: 18px;
}
.rank-item.highlight {
  font-weight: bold;
  color: #007bff;
}
.my-rank {
  margin-top: 20px;
  padding: 15px 20px;
  background-color: #ffcc00;
  color: #333;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.back-button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.back-button:hover {
  background-color: #0056b3;
}
</style>
